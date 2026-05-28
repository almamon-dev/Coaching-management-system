<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice #{{ $order->order_number }}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
            color: #081621;
            line-height: 1.3;
            margin: 0;
            padding: 0;
        }
        .invoice-container {
            max-width: 800px;
            margin: auto;
            padding: 25px;
            background: #fff;
        }
        .header {
            border-bottom: 2px solid #f2f4f8;
            padding-bottom: 15px;
            margin-bottom: 25px;
        }
        .header-top {
            display: table;
            width: 100%;
        }
        .logo-section {
            display: table-cell;
            vertical-align: top;
        }
        .invoice-section {
            display: table-cell;
            text-align: right;
            vertical-align: top;
        }
        .logo {
            font-size: 24px;
            font-weight: 900;
            color: #16a34a;
            letter-spacing: -0.5px;
        }
        .logo span {
            color: #081621;
        }
        .invoice-title {
            font-size: 18px;
            font-weight: bold;
            color: #081621;
            margin: 0;
        }
        .order-id {
            color: #727586;
            font-weight: bold;
            font-size: 12px;
            margin-top: 2px;
        }
        .info-grid {
            display: table;
            width: 100%;
            margin-bottom: 25px;
        }
        .info-col {
            display: table-cell;
            width: 33.33%;
            vertical-align: top;
            padding-right: 15px;
        }
        .info-label {
            font-size: 13px;
            font-weight: bold;
            color: #081621;
            margin-bottom: 8px;
            padding-bottom: 4px;
            border-bottom: 1px solid #eef0f5;
        }
        .info-value {
            font-size: 12px;
            font-weight: bold;
            color: #081621;
            line-height: 1.6;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .items-table th {
            background: #f8f9fa;
            color: #081621;
            text-align: left;
            padding: 10px 12px;
            font-size: 12px;
            font-weight: bold;
            border-bottom: 1px solid #eef0f5;
        }
        .items-table td {
            padding: 10px 12px;
            font-size: 12px;
            border-bottom: 1px solid #f2f4f8;
        }
        .summary-section {
            width: 260px;
            float: right;
        }
        .summary-row {
            display: table;
            width: 100%;
            margin-bottom: 6px;
        }
        .summary-label {
            display: table-cell;
            font-size: 12px;
            color: #727586;
            text-align: left;
        }
        .summary-value {
            display: table-cell;
            font-size: 12px;
            font-weight: bold;
            text-align: right;
            color: #081621;
        }
        .total-row {
            border-top: 1.5px solid #081621;
            padding-top: 8px;
            margin-top: 6px;
        }
        .total-label {
            font-size: 14px;
            font-weight: bold;
            color: #081621;
        }
        .total-value {
            font-size: 16px;
            font-weight: bold;
            color: #081621;
        }
        .status-badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 2px;
            font-size: 11px;
            font-weight: bold;
            margin-top: 6px;
        }
        .status-paid { background: #e8f5e9; color: #2e7d32; }
        .status-pending { background: #fff8e1; color: #f57c00; }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #f2f4f8;
            text-align: center;
            font-size: 10px;
            color: #727586;
        }
        .clearfix::after {
            content: "";
            clear: both;
            display: table;
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <div class="header-top">
                <div class="logo-section">
                    <div class="logo">Daily<span>Fresh</span></div>
                    <div style="font-size: 12px; color: #727586; margin-top: 5px;">Your Daily Super Shop</div>
                </div>
                <div class="invoice-section">
                    <h1 class="invoice-title">Official Invoice</h1>
                    <div class="order-id">#{{ $order->order_number }}</div>
                    @php
                        $paymentStatus = $order->payment ? $order->payment->status : 'pending';
                        $isPaid = $paymentStatus === 'paid' || $paymentStatus === 'success';
                    @endphp
                    <div class="status-badge {{ $isPaid ? 'status-paid' : 'status-pending' }}">
                        {{ $isPaid ? 'Paid' : 'Payment Pending' }}
                    </div>
                </div>
            </div>
        </div>

        <div class="info-grid">
            <div class="info-col">
                <div class="info-label">Customer Details</div>
                <div class="info-value" style="font-weight: normal;">
                    <strong>Name:</strong> {{ $order->shipping_name }}<br>
                    <strong>Phone:</strong> {{ $order->shipping_phone }}<br>
                    <strong>Email:</strong> {{ $order->shipping_email }}
                </div>
            </div>
            <div class="info-col">
                <div class="info-label">Shipping Address</div>
                <div class="info-value" style="font-weight: normal;">
                    <strong>Address:</strong> {{ $order->shipping_address }}<br>
                    <strong>City:</strong> {{ $order->shipping_upazila }}, {{ $order->shipping_district }}
                </div>
            </div>
            <div class="info-col">
                <div class="info-label">Order Summary</div>
                <div class="info-value" style="font-weight: normal;">
                    <strong>Date:</strong> {{ $order->created_at->format('d M, Y') }}<br>
                    <strong>Method:</strong> {{ ucfirst($order->payment->payment_method ?? 'COD') }}
                </div>
            </div>
        </div>

        <table class="items-table">
            <thead>
                <tr>
                    <th style="width: 50%;">Product Description</th>
                    <th style="text-align: center;">Price</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->items as $item)
                <tr>
                    <td>
                        <div style="font-weight: bold;">{{ $item->product_name }}</div>
                    </td>
                    <td style="text-align: center;">{{ number_format($item->price) }} Tk</td>
                    <td style="text-align: center;">{{ $item->quantity }}</td>
                    <td style="text-align: right; font-weight: bold;">{{ number_format($item->price * $item->quantity) }} Tk</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="clearfix">
            <div class="summary-section">
                <div class="summary-row">
                    <div class="summary-label">Sub-Total:</div>
                    <div class="summary-value">{{ number_format($order->subtotal) }} Tk</div>
                </div>
                <div class="summary-row">
                    <div class="summary-label">Delivery Charge:</div>
                    <div class="summary-value">{{ number_format($order->shipping_cost) }} Tk</div>
                </div>
                <div class="summary-row total-row">
                    <div class="summary-label total-label">Grand Total:</div>
                    <div class="summary-value total-value">{{ number_format($order->total_amount) }} Tk</div>
                </div>
            </div>
        </div>

       
    </div>
</body>
</html>
