@extends('emails.layout', ['heading' => 'Staff Member Invitation'])

@section('content')
    <div class="text">Hello {{ $name }},</div>

    <div class="text">
        You have been invited by <strong>{{ $inviter_name }}</strong> ({{ $inviter_email }}) to join the administrative team at <strong>{{ config('app.name') }}</strong> as a staff member.
    </div>

    <div class="info-box">
        <div class="text" style="margin-bottom: 0;">
            With this administrative account, you will be authorized to access the control panel and manage operations, products, and access dashboard metrics based on your assigned system roles.
        </div>
    </div>

    <div class="text">
        Please click the button below to accept this invitation, verify your email, and set up your secure password:
    </div>
    <div class="button-container">
        <a href="{{ $acceptUrl }}" class="button" style="background-color: #008060;">Accept Invitation & Set Password</a>
    </div>

    <div class="text" style="font-weight: bold; color: #b45309; font-size: 13.5px; background-color: #fffbeb; padding: 12px; border: 1px dashed #fef3c7; border-radius: 4px;">
        ⚠️ Note: This invitation link is secure and will automatically expire in 3 days. If you do not accept this invitation within 3 days, your pending profile will be automatically removed from the system.
    </div>
@endsection
