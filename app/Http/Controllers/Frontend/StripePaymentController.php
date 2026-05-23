<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Notifications\OrderPaidNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Checkout\Session;
use Stripe\Stripe;
use Stripe\Webhook;

class StripePaymentController extends Controller
{
    /**
     * Process Stripe Payment and return Checkout URL
     */
    public function processStripe(Request $request)
    {
        $order = Order::with('user')->where('order_number', $request->order_number)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        Stripe::setApiKey(config('services.stripe.secret'));

        try {
            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price_data' => [
                        'currency' => 'bdt',
                        'product_data' => [
                            'name' => 'Order #' . $order->order_number,
                        ],
                        'unit_amount' => (int) ($order->total_amount * 100),
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                'success_url' => route('payment.success', $order->order_number) . '?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('payment.cancel', $order->order_number),
                'metadata' => [
                    'order_number' => $order->order_number,
                ],
                'customer_email' => $order->user->email,
            ]);

            return response()->json(['url' => $session->url]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Handle payment success callback from Stripe
     */
    public function success(Request $request, $orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        Stripe::setApiKey(config('services.stripe.secret'));
        $session = Session::retrieve($request->get('session_id'));

        if ($session->payment_status === 'paid') {
            $this->markAsPaid($order, $session->payment_intent);
            return redirect()->route('checkout.success', $order->order_number)->with('success', 'Payment successful!');
        }

        return redirect()->route('checkout.success', $order->order_number)->with('error', 'Payment failed or pending.');
    }

    /**
     * Handle payment cancellation
     */
    public function cancel($orderNumber)
    {
        return redirect()->route('checkout.success', $orderNumber)->with('error', 'Payment was cancelled.');
    }

    /**
     * Handle Stripe Webhooks
     */
    public function handleWebhook(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $endpointSecret = config('services.stripe.webhook_secret');

        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $endpointSecret);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }

        if ($event->type === 'payment_intent.succeeded') {
            $paymentIntent = $event->data->object;
            $orderNumber = $paymentIntent->metadata->order_number ?? null;

            if ($orderNumber) {
                $order = Order::where('order_number', $orderNumber)->first();
                if ($order && $order->payment_status !== 'paid') {
                    $this->markAsPaid($order, $paymentIntent->id);
                }
            }
        }

        return response()->json(['status' => 'success']);
    }

    /**
     * Private helper to mark order as paid
     */
    private function markAsPaid($order, $transactionId)
    {
        $order->payment()->updateOrCreate(
            ['order_id' => $order->id],
            [
                'payment_method' => 'stripe',
                'transaction_id' => $transactionId,
                'amount' => $order->total_amount,
                'status' => 'paid',
            ]
        );

        $order->update(['status' => 'processing']);

        if ($order->user) {
            $order->user->notify(new OrderPaidNotification($order));
        }

        Log::info("Order #{$order->order_number} marked as PAID.");
    }
}
