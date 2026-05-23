<?php

namespace App\Http\Controllers\Admin\Tickets;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\TicketMessage;
use App\Models\TicketAttachment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TicketController extends Controller
{
    /**
     * Display a listing of tickets in the support queue.
     */
    public function index(Request $request)
    {
        $user = auth()->user();

        // Query tickets using the user scope for role-based security isolation
        $query = Ticket::forUser($user)->with(['customer:id,name,email', 'assignee:id,name']);

        // --- Advanced Filtering ---
        // Search filter (ID, subject, customer name)
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('ticket_id', 'like', '%' . $search . '%')
                  ->orWhere('subject', 'like', '%' . $search . '%')
                  ->orWhereHas('customer', function ($sub) use ($search) {
                      $sub->where('name', 'like', '%' . $search . '%');
                  });
            });
        }

        // Status tab/filter
        if ($request->has('status') && !empty($request->status) && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Priority filter
        if ($request->has('priority') && !empty($request->priority) && $request->priority !== 'all') {
            $query->where('priority', $request->priority);
        }

        // Category filter
        if ($request->has('category') && !empty($request->category) && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        // Paginate results
        $tickets = $query->orderBy('updated_at', 'desc')->cursorPaginate(12);

        // Calculate statistics (scoped to what this user is authorized to see)
        $statsQuery = Ticket::forUser($user);
        $stats = [
            'all' => (clone $statsQuery)->count(),
            'open' => (clone $statsQuery)->where('status', 'open')->count(),
            'in_progress' => (clone $statsQuery)->where('status', 'in_progress')->count(),
            'resolved' => (clone $statsQuery)->where('status', 'resolved')->count(),
            'closed' => (clone $statsQuery)->where('status', 'closed')->count(),
        ];

        return Inertia::render('Admin/Tickets/List/TicketListPage', [
            'tickets' => $tickets,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status', 'priority', 'category']),
        ]);
    }

    /**
     * Show a specific ticket in the premium split-pane workspace.
     */
    public function show(Ticket $ticket)
    {
        $user = auth()->user();

        // Enforce role-based access security
        if ($user->user_type !== 'admin') {
            abort(403, 'Unauthorized access.');
        }

        if (!$user->hasRole('Super Admin') && $ticket->assigned_to !== $user->id) {
            abort(403, 'Unauthorized access: This ticket is assigned to another agent.');
        }

        // Load full ticket thread details
        $ticket->load([
            'customer:id,name,email,phone,profile_picture',
            'assignee:id,name,profile_picture',
            'messages' => function ($query) {
                // Admins see all messages including secret internal notes
                $query->orderBy('created_at', 'asc');
            },
            'messages.sender:id,name,user_type,profile_picture',
            'messages.attachments'
        ]);

        // Map helper URLs for assets
        if ($ticket->customer && $ticket->customer->profile_picture) {
            $ticket->customer->profile_picture = \App\Support\Media\FileUrlGenerator::generate($ticket->customer->profile_picture);
        }
        if ($ticket->assignee && $ticket->assignee->profile_picture) {
            $ticket->assignee->profile_picture = \App\Support\Media\FileUrlGenerator::generate($ticket->assignee->profile_picture);
        }

        $ticket->messages->each(function ($message) {
            $message->attachments->each(function ($attachment) {
                $attachment->url = \App\Support\Media\FileUrlGenerator::generate($attachment->file_path);
            });
            if ($message->sender && $message->sender->profile_picture) {
                $message->sender->profile_picture = \App\Support\Media\FileUrlGenerator::generate($message->sender->profile_picture);
            }
        });

        // Get list of all staff members (agents + admins) to populate the "Assign Agent" dropdown
        $agents = User::where('user_type', 'admin')
            ->select('id', 'name', 'email')
            ->get();

        return Inertia::render('Admin/Tickets/TicketDetailsPage', [
            'ticket' => $ticket,
            'agents' => $agents
        ]);
    }

    /**
     * Post a reply or internal note inside a ticket thread.
     */
    public function reply(Request $request, Ticket $ticket)
    {
        $user = auth()->user();

        // Enforce role-based access security
        if (!$user->hasRole('Super Admin') && $ticket->assigned_to !== $user->id) {
            abort(403, 'Unauthorized access.');
        }

        if ($ticket->status === 'closed') {
            return redirect()->back()->with('error', 'This support ticket has been closed. Please open or re-activate it first.');
        }

        $request->validate([
            'message' => 'required|string|min:2',
            'is_internal' => 'boolean',
            'attachments' => 'array|nullable',
            'attachments.*' => 'file|mimes:jpeg,png,jpg,gif,pdf|max:5120',
        ]);

        DB::transaction(function () use ($request, $ticket, $user) {
            // Append Message
            $message = TicketMessage::create([
                'ticket_id' => $ticket->id,
                'sender_id' => $user->id,
                'message' => $request->message,
                'is_internal' => (bool) $request->input('is_internal', false)
            ]);

            // Save attachments if present
            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $originalName = $file->getClientOriginalName();
                    $fileSize = $file->getSize();
                    $mimeType = $file->getClientMimeType();

                    $path = \App\Support\Media\FileUploader::upload('tickets', $file);

                    TicketAttachment::create([
                        'message_id' => $message->id,
                        'file_path' => $path,
                        'file_name' => $originalName,
                        'file_size' => $fileSize,
                        'mime_type' => $mimeType,
                    ]);
                }
            }

            // Only update ticket status to in_progress if this is a public customer-facing reply
            if (!$request->input('is_internal', false)) {
                if ($ticket->status !== 'in_progress') {
                    $ticket->update(['status' => 'in_progress']);
                } else {
                    $ticket->touch();
                }
            } else {
                $ticket->touch(); // touch timestamp anyway
            }
        });

        $messageText = $request->input('is_internal', false) ? 'Internal note added successfully.' : 'Reply sent successfully.';
        return redirect()->back()->with('success', $messageText);
    }

    /**
     * Assign / Re-assign ticket to a support staff member.
     */
    public function assign(Request $request, Ticket $ticket)
    {
        $user = auth()->user();

        // Enforce Super Admin or assigned agent reassignment access
        if (!$user->hasRole('Super Admin') && $ticket->assigned_to !== $user->id) {
            abort(403, 'Unauthorized access.');
        }

        $request->validate([
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        $agentId = $request->assigned_to;
        $agentName = 'Unassigned';

        if ($agentId) {
            $agent = User::find($agentId);
            if ($agent->user_type !== 'admin') {
                return redirect()->back()->with('error', 'Cannot assign support ticket to a customer account.');
            }
            $agentName = $agent->name;
        }

        $ticket->update(['assigned_to' => $agentId]);

        return redirect()->back()->with('success', "Ticket successfully assigned to {$agentName}.");
    }

    /**
     * Change ticket access status (e.g. resolve, close).
     */
    public function updateStatus(Request $request, Ticket $ticket)
    {
        $user = auth()->user();

        if (!$user->hasRole('Super Admin') && $ticket->assigned_to !== $user->id) {
            abort(403, 'Unauthorized access.');
        }

        $request->validate([
            'status' => 'required|string|in:open,in_progress,resolved,closed',
        ]);

        $ticket->update(['status' => $request->status]);

        return redirect()->back()->with('success', "Ticket status updated to " . ucfirst($request->status) . ".");
    }

    /**
     * Change ticket urgency priority level.
     */
    public function updatePriority(Request $request, Ticket $ticket)
    {
        $user = auth()->user();

        if (!$user->hasRole('Super Admin') && $ticket->assigned_to !== $user->id) {
            abort(403, 'Unauthorized access.');
        }

        $request->validate([
            'priority' => 'required|string|in:low,medium,high,urgent',
        ]);

        $ticket->update(['priority' => $request->priority]);

        return redirect()->back()->with('success', "Ticket priority raised to " . ucfirst($request->priority) . ".");
    }
}
