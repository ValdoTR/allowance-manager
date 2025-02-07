<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;

class WalletController extends Controller
{
    public function connectWallet(Request $request): RedirectResponse
    {
        session(['isWalletConnected' => true]);

        $ownerAddress = $request->input('owner_address');
        session(['ownerAddress' => $ownerAddress]);

        // Redirect users to the overview page after connecting a wallet
        return Redirect::route('allowances.index');
    }

    public function disconnectWallet(): RedirectResponse
    {
        session(['isWalletConnected' => false]);
        session(['ownerAddress' => null]);

        // Redirect users to the welcome page after disconnecting a wallet
        return Redirect::route('welcome');
    }
}
