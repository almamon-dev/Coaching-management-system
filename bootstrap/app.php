<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
        then: function () {
            \Illuminate\Support\Facades\Route::middleware(['web', 'auth', 'admin'])
                ->prefix('admin')
                ->name('admin.')
                ->group(base_path('routes/admin.php'));

            \Illuminate\Support\Facades\Route::middleware(['web', 'auth'])
                ->prefix('teacher')
                ->name('teacher.')
                ->group(base_path('routes/teacher.php'));

            \Illuminate\Support\Facades\Route::middleware(['web', 'auth', 'user'])
                ->prefix('user') // Keeping /user prefix for students to avoid breaking existing URLs for now
                ->name('user.')
                ->group(base_path('routes/student.php'));
        },
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\SetLocale::class,
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->validateCsrfTokens(except: [
            'stripe/webhook',
        ]);

        $middleware->alias([
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
            'user' => \App\Http\Middleware\UserMiddleware::class,
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
            'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
        ]);
 
        $middleware->redirectTo(function (\Illuminate\Http\Request $request) {
            if ($request->is('admin/*') || $request->is('admin-login')) {
                return route('admin.login');
            }
            if ($request->is('teacher/*') || $request->is('teacher-login')) {
                return route('teacher.login');
            }
            return route('student.login');
        });
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (\Spatie\Permission\Exceptions\UnauthorizedException $e, \Illuminate\Http\Request $request) {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'This action is unauthorized.'], 403);
            }
            return \Inertia\Inertia::render('Errors/403', [
                'message' => 'You do not have the required role or permission to access this page.'
            ])->toResponse($request)->setStatusCode(403);
        });

        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException $e, \Illuminate\Http\Request $request) {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'This action is unauthorized.'], 403);
            }
            return \Inertia\Inertia::render('Errors/403', [
                'message' => $e->getMessage() !== 'This action is unauthorized.' ? $e->getMessage() : 'You do not have permission to access this page.'
            ])->toResponse($request)->setStatusCode(403);
        });

        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\NotFoundHttpException $e, \Illuminate\Http\Request $request) {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Not Found.'], 404);
            }
            return \Inertia\Inertia::render('Errors/404')->toResponse($request)->setStatusCode(404);
        });

        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\HttpException $e, \Illuminate\Http\Request $request) {
            if (!config('app.debug') && in_array($e->getStatusCode(), [500, 503, 404, 403])) {
                if ($request->wantsJson()) {
                    return response()->json(['message' => 'Server Error.'], $e->getStatusCode());
                }
                return \Inertia\Inertia::render('Errors/' . $e->getStatusCode(), [
                    'status' => $e->getStatusCode()
                ])->toResponse($request)->setStatusCode($e->getStatusCode());
            }
        });
    })->create();
