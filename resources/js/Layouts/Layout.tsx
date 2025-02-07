import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage, router } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { sepolia } from 'viem/chains';

export default function Layout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth } = usePage().props

    const { address } = useAccount();
    const { connectAsync } = useConnect();
    const { disconnectAsync } = useDisconnect();

    let shortenAddress = "";
    if (address) {
        shortenAddress = `${address.slice(0, 5)}...${address.slice(-5)}`
    }

    // These methods update the shared data 'auth.isWalletConnected' and 'auth.ownerAddress'
    const connectWallet = (ownerAddress: `0x${string}`) => {
        router.post('/connect-wallet', { owner_address: ownerAddress });
    };
    const disconnectWallet = () => {
        router.post('/disconnect-wallet');
    };

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-green-200 bg-green-100">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-green-700" />
                                </Link>
                            </div>

                            { auth.isWalletConnected ? (
                                <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                    <NavLink
                                        href={route('allowances.index')}
                                        active={route().current('allowances.index')}
                                    >
                                        Overview
                                    </NavLink>
                                    <NavLink
                                        href={route('allowances.create')}
                                        active={route().current('allowances.create')}
                                    >
                                        Add
                                    </NavLink>
                                </div> 
                            ) : (
                                <>
                                </> 
                            )}
                            
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                { auth.isWalletConnected ? (
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-3 py-2 text-sm font-medium leading-4 text-white transition duration-150 ease-in-out hover:bg-green-700 focus:outline-none"
                                                >
                                                    {shortenAddress}

                                                    <svg
                                                        className="-me-0.5 ms-2 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <button
                                                onClick={() => disconnectAsync(
                                                    {},
                                                    {
                                                        onSuccess: () => {
                                                            disconnectWallet()
                                                        },
                                                    }
                                                )}
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                Disconnect Wallet
                                            </button>
                                        </Dropdown.Content>
                                    </Dropdown>
                                ) : (
                                    <button
                                        onClick={() => connectAsync(
                                            {
                                                chainId: sepolia.id,
                                                connector: injected(),
                                            },
                                            {
                                                onSuccess: data => {
                                                    if (data) {
                                                        const ownerAddress = data.accounts[0];
                                                        connectWallet(ownerAddress)
                                                    }
                                                },
                                                onError: error => {
                                                    if (error) {
                                                        console.error("Error", error)
                                                    }
                                                }
                                            }
                                        )}
                                        type="button"
                                        className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-3 py-2 text-sm font-medium leading-4 text-white transition duration-150 ease-in-out hover:bg-green-700 focus:outline-none"
                                    >
                                        Connect Wallet
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="nline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                <path
                                    className={
                                    !showingNavigationDropdown
                                        ? 'inline-flex text-green-700'
                                        : 'hidden'
                                    }
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                                <path
                                    className={
                                    showingNavigationDropdown
                                        ? 'inline-flex text-green-700'
                                        : 'hidden'
                                    }
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    { auth.isWalletConnected ? (
                        <div className="space-y-1 pb-3 pt-2">
                            <ResponsiveNavLink
                                href={route('allowances.index')}
                                active={route().current('allowances.index')}
                            >
                                Overview
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                href={route('allowances.create')}
                                active={route().current('allowances.create')}
                            >
                                Add
                            </ResponsiveNavLink>
                        </div>
                    ) : (
                        <>
                        </>
                    )}

                    { auth.isWalletConnected ? (
                        <div className="border-t border-gray-200 pb-1 pt-4">
                            <div className="px-4">
                                <div className="text-base font-medium text-gray-800">
                                    {shortenAddress}
                                </div>
                            </div>

                            <div className="mt-3 space-y-1">
                                <button
                                    onClick={() => disconnectAsync(
                                        {},
                                        {
                                            onSuccess: () => {
                                                disconnectWallet()
                                            },
                                        }
                                    )}
                                    type="button"
                                    className="inline-flex items-center rounded-md border border-transparent bg-inherit px-3 py-2 text-sm font-medium leading-4 text-gray-700 transition duration-150 ease-in-out hover:text-gray-900 focus:outline-none"
                                >
                                    Disconnect Wallet
                                </button>
                            </div>                
                        </div>
                    ) : (
                        <div className="border-t border-gray-200 pb-1 pt-4">
                            <div className="mt-3 space-y-1">
                                <button
                                    onClick={() => connectAsync(
                                        {
                                            chainId: sepolia.id,
                                            connector: injected(),
                                        },
                                        {
                                            onSuccess: data => {
                                                if (data) {
                                                    const ownerAddress = data.accounts[0];
                                                    connectWallet(ownerAddress)
                                                }
                                            },
                                            onError: error => {
                                                if (error) {
                                                    console.error("Error", error)
                                                }
                                            }
                                        }
                                    )}
                                    type="button"
                                    className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-3 py-2 text-sm font-medium leading-4 text-white transition duration-150 ease-in-out hover:bg-green-700 focus:outline-none"
                                >
                                    Connect Wallet
                                </button>
                            </div>                
                        </div>
                    )}
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>
                {children}
            </main>
        </div>
    );
}
