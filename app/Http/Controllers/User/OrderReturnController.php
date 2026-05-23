<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderReturn;
use Illuminate\Http\Request;

class OrderReturnController extends Controller
{
    public function store(Request $request, string $orderNumber)
    {
        $order = Order::query()
            ->with('items')
            ->where('order_number', $orderNumber)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        if ($order->status !== 'delivered') {
            return back()->with('error', 'Return request is available only after delivery.');
        }

        // Support multiple items array input
        if ($request->has('items') && is_array($request->input('items'))) {
            // Filter items that are checked/selected
            $items = collect($request->input('items'))
                ->filter(fn($item) => isset($item['selected']) && filter_var($item['selected'], FILTER_VALIDATE_BOOLEAN))
                ->toArray();

            if (empty($items)) {
                return back()->withErrors(['items' => 'Please select at least one item to return.']);
            }

            // Create validation rules for filtered items
            $validator = \Validator::make(['items' => $items], [
                'items' => ['required', 'array', 'min:1'],
                'items.*.order_item_id' => ['required', 'integer'],
                'items.*.quantity' => ['required', 'integer', 'min:1'],
                'items.*.reason' => ['required', 'string', 'max:120'],
                'items.*.details' => ['nullable', 'string', 'max:1000'],
            ]);

            if ($validator->fails()) {
                return back()->withErrors($validator->errors());
            }

            // Validate all items first
            foreach ($items as $index => $itemData) {
                $item = $order->items->firstWhere('id', (int) $itemData['order_item_id']);
                if (! $item) {
                    return back()->withErrors(["items.{$index}.order_item_id" => 'Selected product does not belong to this order.']);
                }

                if ((int) $itemData['quantity'] > (int) $item->quantity) {
                    return back()->withErrors(["items.{$index}.quantity" => "Return quantity cannot exceed ordered quantity ({$item->quantity})."]);
                }

                $alreadyRequested = OrderReturn::query()
                    ->where('order_item_id', $item->id)
                    ->where('user_id', auth()->id())
                    ->exists();

                if ($alreadyRequested) {
                    return back()->withErrors(["items.{$index}.order_item_id" => 'A return request already exists for this product.']);
                }
            }

            // Create return requests
            foreach ($items as $itemData) {
                $item = $order->items->firstWhere('id', (int) $itemData['order_item_id']);
                OrderReturn::create([
                    'user_id' => auth()->id(),
                    'order_id' => $order->id,
                    'order_item_id' => $item->id,
                    'product_id' => $item->product_id,
                    'quantity' => $itemData['quantity'],
                    'reason' => $itemData['reason'],
                    'details' => $itemData['details'] ?? null,
                    'status' => 'pending',
                    'requested_at' => now(),
                ]);
            }

            return back()->with('success', 'Return requests submitted successfully.');
        }

        // Fallback to single item logic
        $validated = $request->validate([
            'order_item_id' => ['required', 'integer'],
            'quantity' => ['required', 'integer', 'min:1'],
            'reason' => ['required', 'string', 'max:120'],
            'details' => ['nullable', 'string', 'max:1000'],
        ]);

        $item = $order->items->firstWhere('id', (int) $validated['order_item_id']);

        if (! $item) {
            return back()->withErrors(['order_item_id' => 'Selected product does not belong to this order.']);
        }

        if ((int) $validated['quantity'] > (int) $item->quantity) {
            return back()->withErrors(['quantity' => 'Return quantity cannot exceed ordered quantity.']);
        }

        $alreadyRequested = OrderReturn::query()
            ->where('order_item_id', $item->id)
            ->where('user_id', auth()->id())
            ->exists();

        if ($alreadyRequested) {
            return back()->withErrors(['order_item_id' => 'A return request already exists for this product.']);
        }

        OrderReturn::create([
            'user_id' => auth()->id(),
            'order_id' => $order->id,
            'order_item_id' => $item->id,
            'product_id' => $item->product_id,
            'quantity' => $validated['quantity'],
            'reason' => $validated['reason'],
            'details' => $validated['details'] ?? null,
            'status' => 'pending',
            'requested_at' => now(),
        ]);

        return back()->with('success', 'Return request submitted successfully.');
    }
}
