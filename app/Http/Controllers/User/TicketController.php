<?php

declare(strict_types=1);

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Services\User\Ticket\StoreTicketService;
use App\Services\User\Ticket\ReplyTicketService;
use App\Support\Media\FileUrlGenerator;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TicketController extends Controller
{
    protected StoreTicketService $storeService;
    protected ReplyTicketService $replyService;

    public function __construct(StoreTicketService $storeService, ReplyTicketService $replyService)
    {
        $this->storeService = $storeService;
        $this->replyService = $replyService;
    }

    /**
     * Display a listing of the customer's tickets.
     */
    public function index()
    {
        $user = auth()->user();

        // Get tickets belonging to user, paginated
        $tickets = Ticket::where('user_id', $user->id)
            ->with(['assignee'])
            ->orderBy('updated_at', 'desc')
            ->paginate(10);

        // Get count summary
        $stats = [
            'all' => Ticket::where('user_id', $user->id)->count(),
            'open' => Ticket::where('user_id', $user->id)->whereIn('status', ['open', 'in_progress'])->count(),
            'resolved' => Ticket::where('user_id', $user->id)->where('status', 'resolved')->count(),
            'closed' => Ticket::where('user_id', $user->id)->where('status', 'closed')->count(),
        ];

        return Inertia::render('User/Tickets/TicketListPage', [
            'tickets' => $tickets,
            'stats' => $stats
        ]);
    }

    /**
     * Show the form for creating a new ticket.
     */
    public function create()
    {
        return Inertia::render('User/Tickets/CreateTicketPage');
    }

    /**
     * Store a newly created ticket and its first message in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'category' => 'required|string|in:Order Issue,Refund,Technical,Other',
            'priority' => 'required|string|in:low,medium,high,urgent',
            'message' => 'required|string|min:10',
            'attachments' => 'array|nullable',
            'attachments.*' => 'file|mimes:jpeg,png,jpg,gif,pdf|max:5120', // Max 5MB
        ]);

        $ticket = $this->storeService->execute(
            auth()->user(),
            $validated,
            $request->file('attachments')
        );

        return redirect()->route('dashboard.tickets.show', $ticket->id)
            ->with('success', 'Support ticket opened successfully. A support agent will review it shortly.');
    }

    /**
     * Display a specific support ticket and its message thread.
     */
    public function show(Ticket $ticket)
    {
        // Enforce ticket ownership
        if ($ticket->user_id !== auth()->id()) {
            abort(403, 'Unauthorized access to this ticket.');
        }

        // Load full discussion thread
        $ticket->load([
            'assignee:id,name,profile_picture',
            'messages' => function ($query) {
                // Customers cannot see internal agent notes
                $query->where('is_internal', false)->orderBy('created_at', 'desc');
            },
            'messages.sender:id,name,user_type,profile_picture',
            'messages.attachments'
        ]);

        // Map helper URL for attachments
        $ticket->messages->each(function ($message) {
            $message->attachments->each(function ($attachment) {
                $attachment->url = FileUrlGenerator::generate($attachment->file_path);
            });
            if ($message->sender && $message->sender->profile_picture) {
                $message->sender->profile_picture = FileUrlGenerator::generate($message->sender->profile_picture);
            }
        });

        return Inertia::render('User/Tickets/TicketDetailsPage', [
            'ticket' => $ticket
        ]);
    }

    /**
     * Add a new reply to the ticket discussion.
     */
    public function reply(Request $request, Ticket $ticket)
    {
        // Enforce ticket ownership
        if ($ticket->user_id !== auth()->id()) {
            abort(403, 'Unauthorized access to this ticket.');
        }

        // Enforce closed/resolved tickets blocks
        if ($ticket->status === 'closed') {
            return redirect()->back()->with('error', 'This support ticket has been closed. Please open a new one if you need further help.');
        }

        $validated = $request->validate([
            'message' => 'required|string|min:2',
            'attachments' => 'array|nullable',
            'attachments.*' => 'file|mimes:jpeg,png,jpg,gif,pdf|max:5120',
        ]);

        $this->replyService->execute(
            auth()->user(),
            $ticket,
            $validated,
            $request->file('attachments')
        );

        return redirect()->back()->with('success', 'Reply submitted successfully.');
    }
}
