import { Head, usePage, useForm } from '@inertiajs/react';
import Layout from '@/Layouts/Layout';
import { useWriteContract } from 'wagmi';
import { erc20Abi, parseUnits } from "viem";
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { FormEventHandler } from 'react';
import { ToastContainer, toast } from 'react-toastify';

export default function Add() {
    const { auth } = usePage().props
    const { writeContractAsync, isPending } = useWriteContract();
            
    const { data, setData, post, processing, errors } = useForm({
        contract_address: "",
        owner_address: auth.ownerAddress!,
        spender_address: "",
        amount: "0", // 1000000 is 1 USDT
    });

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();

        if (!auth.ownerAddress) {
            toast.warn("🤨 Please connect your wallet first!");
            return;
        }

        try {
            const txnHash = await writeContractAsync({
                address: data.contract_address as `0x${string}`,
                abi: erc20Abi,
                functionName: "approve",
                args: [data.spender_address as `0x${string}`, parseUnits(data.amount!, 18)],
            });

            const txBaseURL = 'https://sepolia.etherscan.io/tx'
            console.log("txnHash", txnHash)
            console.log("Transaction URL:", `${txBaseURL}/${txnHash}`);

            post(route('allowances.store'));
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <Layout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Add allowance
                </h2>
            }
        >
            <Head title="Add allowance" />
            <div className="flex min-h-screen flex-col items-center pt-6 sm:pt-0">
                <div className="mt-12 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <InputLabel htmlFor="contract_address" value="Contract Address" />
                            <TextInput
                                id="contract_address"
                                type="text"
                                name="contract_address"
                                value={data.contract_address}
                                className="mt-1 block w-full"
                                isFocused
                                onChange={(e) => setData('contract_address', e.target.value)}
                            />
                            <InputError message={errors.contract_address} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="owner_address" value="Owner Address" />
                            <TextInput
                                id="owner_address"
                                type="text"
                                name="owner_address"
                                value={data.owner_address}
                                className="mt-1 block w-full"
                                disabled
                                onChange={(e) => setData('owner_address', e.target.value as `0x${string}`)}
                            />
                            <InputError message={errors.owner_address} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="spender_address" value="Spender Address" />
                            <TextInput
                                id="spender_address"
                                type="text"
                                name="spender_address"
                                value={data.spender_address}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('spender_address', e.target.value)}
                            />
                            <InputError message={errors.spender_address} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="amount" value="Amount" />
                            <TextInput
                                id="amount"
                                type="number"
                                name="amount"
                                value={data.amount}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('amount', e.target.value)}
                            />
                            <InputError message={errors.amount} className="mt-2" />
                        </div>

                        <div className="mt-4 flex items-center justify-end">
                            <PrimaryButton className="ms-4" disabled={isPending || processing}>
                                Add allowance
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>

            <ToastContainer icon={false}/>
        </Layout>
    );
}