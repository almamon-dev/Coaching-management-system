<?php
 
namespace App\Http\Middleware;
 
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
 
class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();
        
        $hasAdminAccess = $user && (
            in_array($user->user_type, ['admin', 'staff']) || 
            $user->roles()->whereNotIn('name', ['teacher', 'student', 'user'])->count() > 0
        );

        if ($hasAdminAccess) {
            return $next($request);
        }
 
        Auth::logout();
        return redirect()->route('admin.login')->withErrors([
            'email' => 'Access denied. You must be an administrator to view this page.',
        ]);
    }
}
