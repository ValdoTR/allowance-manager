<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;

class WalletConnected
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): RedirectResponse
    {
        // Check if the wallet is connected (from session)
        if (session('ownerAddress') === null) {
            // Redirect the user back with an Inertia response
            return Redirect::route('welcome');
        }

        return $next($request);
    }
}
