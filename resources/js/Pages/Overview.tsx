import { PageProps } from '@/types';
import { useState } from "react";
import { router, Link, Head } from '@inertiajs/react';
import { useAccount, useWriteContract } from 'wagmi';
import { erc20Abi, parseUnits } from "viem";
import Layout from '@/Layouts/Layout';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { ToastContainer, toast } from 'react-toastify';

type Allowance = {
    id: number;
    contract_address: string;
    owner_address: string;
    spender_address: string;
    amount: string;
}

export default function Overview({ allowances = [] }: PageProps<{ allowances?: Allowance[] }>) {
    const { address } = useAccount();
    const { writeContractAsync, isPending } = useWriteContract();
    const txnBaseURL = 'https://sepolia.etherscan.io/tx';
    
    // Tracks which allowance is being edited.
    const [editingId, setEditingId] = useState<number | null>(null);
    const [newAmount, setNewAmount] = useState<Record<string, string>>({});

    const handleEditAmount = (id: number, amount: string) => {
        setEditingId(id); // Replace cell by input
        setNewAmount({ ...newAmount, [id]: amount });
    };

    const successToastContent = (txnHash: string) => (
        <div>
            <p>🤑 Transaction complete.</p>
            <a 
                href={`https://sepolia.etherscan.io/tx/${txnHash}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="rounded-sm underline hover:text-black"
            >
                Click here for more details
            </a>
        </div>
    );

    const handleSaveAllowance = async (
        id: number,
        contract_address: string,
        owner_address: string,
        spender_address: string
    ) => {
        if (!address || address !== owner_address) {
            toast.warn("🤨 You can't edit this allowance.");
            return;
        }

        try {
            const txnHash = await writeContractAsync({
                address: contract_address as `0x${string}`,
                abi: erc20Abi,
                functionName: "approve",
                args: [spender_address as `0x${string}`, parseUnits(newAmount[id].toString(), 18)],
            });

            console.log("Transaction URL:", `${txnBaseURL}/${txnHash}`);

            router.patch(`/allowances/${id}`, { amount: newAmount[id] });
            setEditingId(null); // Replace input by cell
            toast.success(successToastContent(txnHash));
        } catch (error) {
            toast.error("😭 Something went wrong.");
        }
    };

    const handleRevokeAllowance = async (
        id: number,
        contract_address: string,
        owner_address: string,
        spender_address: string
    ) => {
        if (!address || address !== owner_address) {
            toast.warn("🤨 You can't edit this allowance.");
            return;
        }

        try {
            const txnHash = await writeContractAsync({
                address: contract_address as `0x${string}`,
                abi: erc20Abi,
                functionName: "approve",
                args: [spender_address as `0x${string}`, parseUnits("0", 18)],
            });

            
            console.log("Transaction URL:", `${txnBaseURL}/${txnHash}`);

            router.delete(`/allowances/${id}`);
            setEditingId(null); // Replace input by cell
            toast.success(successToastContent(txnHash));
        } catch (error) {
            console.error("Error:", error);
            toast.error("😭 Something went wrong.");
        }
    };

    const shortenAddress = (address: string): string => {
        if (!address) {
          return "Invalid address";
        }
        return `${address.slice(0, 5)}...${address.slice(-5)}`;
    };

    const addressLink = (address: string): string => {
        if (!address) {
          return "Invalid address";
        }
        return `https://sepolia.etherscan.io/address/${address}`;
    };

    return (
        <Layout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Allowances
                </h2>
            }
        >
            <Head title="Overview" />

            {allowances.length === 0 ? (
                <p className="text-gray-500 m-8">No allowances found. Start by <Link href={route('allowances.create')} className="rounded-sm underline hover:text-black focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2D20]">adding a new one</Link>.</p>
            ) : (
                <div className="overflow-x-auto m-8">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Contract</th>
                            <th className="py-3 px-6 text-left">Owner</th>
                            <th className="py-3 px-6 text-left">Spender</th>
                            <th className="py-3 px-6 text-left">Amount</th>
                            <th className="py-3 px-6 text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                        {allowances.map((allowance) => (
                            <tr key={allowance.id} className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="py-3 px-6">
                                <a href={addressLink(allowance.contract_address)} target="_blank" rel="noopener noreferrer" className="rounded-sm underline hover:text-black">
                                    {shortenAddress(allowance.contract_address)}
                                </a>
                            </td>
                            <td className="py-3 px-6">
                                <a href={addressLink(allowance.owner_address)} target="_blank" rel="noopener noreferrer" className="rounded-sm underline hover:text-black">
                                    {shortenAddress(allowance.owner_address)}
                                </a>
                            </td>
                            <td className="py-3 px-6">
                                <a href={addressLink(allowance.spender_address)} target="_blank" rel="noopener noreferrer" className="rounded-sm underline hover:text-black">
                                    {shortenAddress(allowance.spender_address)}
                                </a>
                            </td>
                            <td className="py-3 px-6">
                                {editingId === allowance.id ? (
                                        <TextInput
                                            type="number"
                                            value={newAmount[allowance.id] || ""}
                                            onChange={(e) =>
                                                setNewAmount({
                                                    ...newAmount,
                                                    [allowance.id]: parseFloat(e.target.value),
                                                })
                                            }
                                            isFocused
                                        />
                                    ) : (
                                        allowance.amount
                                    )}
                            </td>
                            <td className="py-3 px-6 flex space-x-2">
                                {editingId === allowance.id ? (
                                    <SecondaryButton className="ms-4 border-blue-400 text-blue-600 hover:bg-blue-50"
                                        onClick={() => handleSaveAllowance(allowance.id, allowance.contract_address, allowance.owner_address, allowance.spender_address)}
                                        disabled={isPending}
                                    >
                                        Save
                                    </SecondaryButton>
                                ) : (
                                    <SecondaryButton className="ms-4"
                                        onClick={() => handleEditAmount(allowance.id, allowance.amount)}
                                    >
                                        Edit
                                    </SecondaryButton>
                                )}

                                <SecondaryButton className="ms-4 border-red-400 text-red-600 hover:bg-red-50"
                                    onClick={() => handleRevokeAllowance(allowance.id, allowance.contract_address, allowance.owner_address, allowance.spender_address)}
                                >
                                    Revoke
                                </SecondaryButton>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ToastContainer icon={false}/>
        </Layout>
    );
}