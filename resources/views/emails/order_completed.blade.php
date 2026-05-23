@extends('emails.layout')

@section('content')
    <div class="heading">Order Successfully Delivered!</div>

    <div class="text">
        Hello {{ $user->name }},<br><br>
        Great news! Your order <strong>#{{ $order->order_number }}</strong> has been delivered. We hope you're happy with your purchase!
    </div>

    <div class="info-box">
        <div class="text" style="margin-bottom: 10px; font-weight: bold;">Order Summary:</div>
        <div style="font-size: 14px; line-height: 1.8;">
            <div style="display: flex; justify-content: space-between;">
                <span>Order Number:</span>
                <span style="font-weight: bold;">#{{ $order->order_number }}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Delivery Date:</span>
                <span style="font-weight: bold;">{{ now()->format('d M, Y') }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee;">
                <span>Total Amount:</span>
                <span style="font-weight: bold;">{{ number_format($order->total_amount) }}৳</span>
            </div>
        </div>
    </div>

    <div class="text">
        If you have a moment, we'd love to hear your thoughts on the products. You can leave a review by visiting the product page.
    </div>

    <div class="button-container">
        <a href="{{ url('/orders/' . $order->order_number) }}" class="button">View Order Details</a>
    </div>

    <div class="text">
        Thank you for choosing Star Tech. We look forward to serving you again soon!
    </div>
@endsection
