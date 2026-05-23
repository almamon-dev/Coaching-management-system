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
            padding-bottom: 12px;
            margin-bottom: 20px;
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
            font-size: 22px;
            font-weight: bold;
            color: #ef4a23;
            text-transform: uppercase;
            letter-spacing: -1px;
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
            color: #ef4a23;
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
        }
        .info-label {
            font-size: 10px;
            font-weight: bold;
            color: #727586;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }
        .info-value {
            font-size: 12px;
            font-weight: bold;
            color: #081621;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .items-table th {
            background: #f8f9ff;
            color: #081621;
            text-align: left;
            padding: 8px 12px;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
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
            color: #ef4a23;
        }
        .status-badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 2px;
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
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
                    <div class="logo">STAR <span>TECH</span></div>
                    <div style="font-size: 12px; color: #727586; margin-top: 5px;">Your Trusted Gadget Shop</div>
                </div>
                <div class="invoice-section">
                    <h1 class="invoice-title">OFFICIAL INVOICE</h1>
                    <div class="order-id">#{{ $order->order_number }}</div>
                    @php
                        $paymentStatus = $order->payment ? $order->payment->status : 'pending';
                        $isPaid = $paymentStatus === 'paid' || $paymentStatus === 'success';
                    @endphp
                    <div class="status-badge {{ $isPaid ? 'status-paid' : 'status-pending' }}">
                        {{ $isPaid ? 'PAID' : 'PAYMENT PENDING' }}
                    </div>
                </div>
            </div>
        </div>

        <div class="info-grid">
            <div class="info-col">
                <div class="info-label">Customer Details</div>
                <div class="info-value">{{ $order->shipping_name }}</div>
                <div class="info-value" style="font-weight: normal; margin-top: 5px;">
                    {{ $order->shipping_phone }}<br>
                    {{ $order->shipping_email }}
                </div>
            </div>
            <div class="info-col">
                <div class="info-label">Shipping Address</div>
                <div class="info-value" style="font-weight: normal;">
                    {{ $order->shipping_address }}<br>
                    {{ $order->shipping_upazila }}, {{ $order->shipping_district }}
                </div>
            </div>
            <div class="info-col">
                <div class="info-label">Order Summary</div>
                <div class="info-value">Date: {{ $order->created_at->format('d M, Y') }}</div>
                <div class="info-value" style="margin-top: 5px;">Method: {{ strtoupper($order->payment->payment_method ?? 'COD') }}</div>
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
                    <td style="text-align: center;">{{ number_format($item->price) }}৳</td>
                    <td style="text-align: center;">{{ $item->quantity }}</td>
                    <td style="text-align: right; font-weight: bold;">{{ number_format($item->price * $item->quantity) }}৳</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="clearfix">
            <div class="summary-section">
                <div class="summary-row">
                    <div class="summary-label">Sub-Total:</div>
                    <div class="summary-value">{{ number_format($order->subtotal) }}৳</div>
                </div>
                <div class="summary-row">
                    <div class="summary-label">Delivery Charge:</div>
                    <div class="summary-value">{{ number_format($order->shipping_cost) }}৳</div>
                </div>
                <div class="summary-row total-row">
                    <div class="summary-label total-label">Grand Total:</div>
                    <div class="summary-value total-value">{{ number_format($order->total_amount) }}৳</div>
                </div>
            </div>
        </div>

        <div class="footer">
            <div style="font-weight: bold; margin-bottom: 10px;">Terms & Conditions</div>
            <div>Please keep this invoice for warranty purposes. Report any manufacturing flaws within 24 hours. Items must be returned with original packaging. Thank you for shopping with Star Tech!</div>
            <div style="margin-top: 20px; font-weight: bold;">www.startech.com.bd</div>
        </div>
    </div>
</body>
</html>
