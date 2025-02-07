<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAllowanceRequest;
use App\Http\Requests\UpdateAllowanceRequest;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Http\RedirectResponse;
use App\Models\Allowance;
use Inertia\Inertia;
use Inertia\Response;

class AllowanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $ownerAddress = session('ownerAddress');
        $allowances = Allowance::where('owner_address', $ownerAddress)->get();
        return Inertia::render('Overview', ['allowances' => $allowances]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Add');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAllowanceRequest $request): RedirectResponse
    {
        Allowance::create($request->validated());

        return Redirect::route('allowances.index')->withSuccess('Allowance added successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Allowance $allowance, UpdateAllowanceRequest $request): RedirectResponse
    {
        $allowance->update($request->validated());

        return Redirect::route('allowances.index')->withSuccess('Allowance updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Allowance $allowance): RedirectResponse
    {
        $allowance->delete();

        return Redirect::route('allowances.index')->withSuccess('Allowance deleted successfully.');
    }
}
