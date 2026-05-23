<?php

namespace App\Observers\Logistics;

use Illuminate\Support\Facades\Redirect;

class ResponseObserver
{
    /**
     * Redirect back with a standardized success flash message for Inertia.
     *
     * @param string $message
     * @return \Illuminate\Http\RedirectResponse
     */
    public function redirectBackWithSuccess(string $message)
    {
        return Redirect::back()->with([
            'toast' => [
                'type'    => 'success',
                'message' => $message
            ]
        ]);
    }

    /**
     * Redirect back with a standardized error flash message.
     *
     * @param string $message
     * @return \Illuminate\Http\RedirectResponse
     */
    public function redirectBackWithError(string $message)
    {
        return Redirect::back()->with([
            'toast' => [
                'type'    => 'error',
                'message' => $message
            ]
        ]);
    }

    /**
     * Redirect to a specific named route with a success message.
     *
     * @param string $routeName
     * @param string $message
     * @param array $parameters
     * @return \Illuminate\Http\RedirectResponse
     */
    public function redirectToRouteWithSuccess(string $routeName, string $message, array $parameters = [])
    {
        return Redirect::route($routeName, $parameters)->with([
            'toast' => [
                'type'    => 'success',
                'message' => $message
            ]
        ]);
    }
}
