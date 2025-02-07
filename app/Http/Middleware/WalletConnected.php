<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Inertia\Inertia;

class WalletConnected
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if the wallet is connected (from session)
        if (!session('isWalletConnected', false)) {
            // Redirect the user back with an Inertia response
            return Inertia::render('Welcome', [
                'message' => 'You need to connect your wallet to access this page.',
            ]);
        }

        return $next($request);
    }
}
