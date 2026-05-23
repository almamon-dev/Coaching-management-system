<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f2f2f2;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
        }
        .wrapper {
            width: 100%;
            background-color: #f2f2f2;
            padding: 40px 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 40px 50px;
            border-radius: 4px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }
        .logo {
            font-size: 28px;
            font-weight: 800;
            color: #081621;
            margin-bottom: 40px;
            letter-spacing: -0.5px;
        }
        .logo span {
            color: #ef4a23;
        }
        .heading {
            font-size: 24px;
            font-weight: 700;
            color: #081621;
            margin-bottom: 25px;
            line-height: 1.2;
        }
        .text {
            font-size: 15px;
            color: #4b5563;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .support-link {
            color: #ef4a23;
            text-decoration: none;
            font-weight: bold;
        }
        .footer {
            margin-top: 30px;
            padding-top: 25px;
            border-top: 1px solid #eeeeee;
            font-size: 14px;
            color: #9ca3af;
            line-height: 1.5;
        }
        .info-box {
            background: #f8f9fb; 
            padding: 24px; 
            border-radius: 4px; 
            margin-bottom: 25px; 
            border: 1px solid #e5e7eb;
        }
        .text-primary {
            color: #3749bb;
        }
        .button-container {
            text-align: center; 
            margin: 30px 0;
        }
        .button {
            background-color: #3749bb; 
            color: #ffffff !important; 
            padding: 12px 35px; 
            text-decoration: none; 
            font-size: 15px; 
            font-weight: 700; 
            border-radius: 4px; 
            display: inline-block;
            transition: background 0.3s ease;
        }
        .otp-code {
            font-size: 32px;
            font-weight: bold;
            color: #3749bb;
            letter-spacing: 5px;
            text-align: left;
            margin: 20px 0;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="logo">STAR <span>TECH</span></div>
            
            @if(isset($heading))
                <div class="heading">{{ $heading }}</div>
            @endif

            @yield('content')

            <div class="text">
                Please contact <a href="{{ config('app.frontend_url') }}/contact-us" class="support-link">{{ config('app.name') }} Support</a> if you did not authorize this change or need assistance.
            </div>

            <div class="footer">
                Thanks for your time,<br>
                The {{ config('app.name') }} Team
            </div>
        </div>
    </div>
</body>
</html>
