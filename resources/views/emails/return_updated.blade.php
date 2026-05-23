@extends('emails.layout')

@section('content')
    <div class="heading">Return Request Updated!</div>

    <div class="text">
        Hello {{ $user->name }},<br><br>
        Your return request for order <strong>#{{ $returnRequest->order->order_number }}</strong> has been updated.
    </div>

    <div class="info-box">
        <div class="text" style="margin-bottom: 10px; font-weight: bold;">Return Details:</div>
        <div style="font-size: 14px; line-height: 1.8;">
            <div style="display: flex; justify-content: space-between;">
                <span>Order Number:</span>
                <span style="font-weight: bold;">#{{ $returnRequest->order->order_number }}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Item returned:</span>
                <span style="font-weight: bold;">{{ $returnRequest->item->product_name }}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Returned Qty:</span>
                <span style="font-weight: bold;">{{ $returnRequest->quantity }}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>New Status:</span>
                <span style="font-weight: bold; color: #008060; text-transform: uppercase;">{{ $returnRequest->status }}</span>
            </div>
            @if($returnRequest->admin_note)
                <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee;">
                    <span style="font-weight: bold; display: block; margin-bottom: 4px;">Support Note:</span>
                    <span style="font-style: italic; color: #555;">{{ $returnRequest->admin_note }}</span>
                </div>
            @endif
        </div>
    </div>

    <div class="button-container">
        <a href="{{ url('/user/orders/' . $returnRequest->order->order_number . '/track') }}" class="button">Track Return Details</a>
    </div>

    <div class="text">
        If you have any questions, please contact our support team.
    </div>
@endsection
