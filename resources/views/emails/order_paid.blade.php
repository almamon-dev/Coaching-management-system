@extends('emails.layout')

@section('content')
    <div class="heading">Payment Confirmation - Order #{{ $order->order_number }}</div>

    <div class="text">
        Hello {{ $user->name }},<br><br>
        We are pleased to inform you that we have successfully received your payment for order <strong>#{{ $order->order_number }}</strong>.
    </div>

    <div class="info-box">
        <div class="text" style="margin-bottom: 10px; font-weight: bold;">Order Summary:</div>
        <div style="font-size: 14px; line-height: 1.8;">
            <div style="display: flex; justify-content: space-between;">
                <span>Order Number:</span>
                <span style="font-weight: bold;">#{{ $order->order_number }}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Payment Method:</span>
                <span style="text-transform: uppercase; font-weight: bold;">{{ $order->payment->payment_method ?? 'Online' }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee; font-size: 18px; color: #ef4a23; font-weight: bold;">
                <span>Total Paid:</span>
                <span>{{ number_format($order->total_amount) }}৳</span>
            </div>
        </div>
    </div>

    <div class="text">
        Your order is now being processed and will be shipped soon. You can track your order and download the invoice by clicking the button below.
    </div>

    <div class="button-container">
        <a href="{{ url('/orders/' . $order->order_number) }}" class="button" style="background-color: #3749bb;">View Order & Invoice</a>
    </div>

    <div class="text">
        If you have any questions, feel free to contact our support at 09678002003.
    </div>
@endsection
