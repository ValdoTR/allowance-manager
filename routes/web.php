<?php

use App\Http\Controllers\WalletController;
use App\Http\Controllers\AllowanceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');

// This controls the 'walletConnected' middleware
Route::post('/connect-wallet', [WalletController::class, 'connectWallet']);
Route::post('/disconnect-wallet', [WalletController::class, 'disconnectWallet']);

Route::middleware('walletConnected')->group(function () {
    Route::resource('allowances', AllowanceController::class);
});
