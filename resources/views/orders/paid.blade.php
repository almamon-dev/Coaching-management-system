<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; }
        .header { text-align: center; padding: 30px 0; background: #081621; color: #fff; }
        .logo { font-size: 24px; font-bold; }
        .logo span { color: #ef4a23; }
        .content { padding: 40px 30px; }
        .btn { display: inline-block; padding: 12px 30px; background: #3749bb; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 20px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #888; }
        .order-box { background: #f8f9fb; border: 1px solid #e5e7eb; padding: 20px; border-radius: 4px; margin: 20px 0; }
        .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .total-row { border-top: 1px solid #e5e7eb; padding-top: 8px; font-weight: bold; font-size: 18px; color: #ef4a23; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">STAR <span>TECH</span></div>
        </div>
        <div class="content">
            <h2 style="color: #081621;">Payment Confirmation</h2>
            <p>Hello {{ $user->name }},</p>
            <p>We are pleased to inform you that we have successfully received your payment for order <strong>#{{ $order->order_number }}</strong>.</p>
            
            <div class="order-box">
                <div style="font-weight: bold; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">Order Details</div>
                <table style="width: 100%;">
                    <tr>
                        <td>Order ID:</td>
                        <td style="text-align: right;">#{{ $order->order_number }}</td>
                    </tr>
                    <tr>
                        <td>Payment Method:</td>
                        <td style="text-align: right; text-transform: uppercase;">{{ $order->payment->payment_method ?? 'Stripe' }}</td>
                    </tr>
                    <tr style="font-size: 18px; font-weight: bold; color: #ef4a23;">
                        <td style="padding-top: 15px;">Total Paid:</td>
                        <td style="text-align: right; padding-top: 15px;">{{ number_format($order->total_amount) }}৳</td>
                    </tr>
                </table>
            </div>

            <p>Your order is now being processed and will be shipped soon. You can track your order and download the invoice by clicking the button below:</p>
            
            <div style="text-align: center;">
                <a href="{{ url('/orders/' . $order->order_number) }}" class="btn">View Order & Invoice</a>
            </div>
            
            <p style="margin-top: 30px;">If you have any questions, feel free to contact our support at 09678002003.</p>
            <p>Best regards,<br>Star Tech Team</p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Star Tech Ltd. All rights reserved.
        </div>
    </div>
</body>
</html>
