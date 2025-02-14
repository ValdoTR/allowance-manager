<?php

namespace App\Http\Middleware;

use Closure;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class WalletConnected
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if the wallet is connected (from session)
        if (session('ownerAddress') === null) {
            // Redirect the user back with an Inertia response
            return Redirect::route('welcome');
        }

        return $next($request);
    }
}
