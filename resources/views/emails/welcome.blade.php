@extends('emails.layout')

@section('content')
    <div class="heading">Welcome to DailyFresh!</div>

    <div class="text">
        Hello {{ $user->name }},<br><br>
        Thank you for shopping with us! We have automatically created an account for you to easily track your orders and manage your details.
    </div>

    <div class="info-box">
        <div class="text" style="margin-bottom: 10px; font-weight: bold;">Your Login Credentials:</div>
        <div style="font-size: 14px; line-height: 1.8;">
            <div style="display: flex; justify-content: space-between;">
                <span>Email:</span>
                <span style="font-weight: bold;">{{ $user->email }}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Password:</span>
                <span style="font-weight: bold;">{{ $password }}</span>
            </div>
        </div>
    </div>

    <div class="text">
        For your security, we recommend changing your password after logging in.
    </div>

    <div class="button-container">
        <a href="{{ url('/login') }}" class="button">Login to Your Account</a>
    </div>

    <div class="text">
        If you have any questions, feel free to contact our support team.
    </div>
@endsection
