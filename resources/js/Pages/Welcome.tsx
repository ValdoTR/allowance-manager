import { Head } from '@inertiajs/react';
import Layout from '@/Layouts/Layout';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Welcome() {
    const appName = import.meta.env.VITE_APP_NAME

    return (
        <Layout>
            <Head title="Welcome" />
        
            <div className="flex flex-col items-center justify-center min-h-screen -mt-32">
                <ApplicationLogo className="block h-64 w-auto fill-current text-green-700" />
                <h1 className="text-6xl font-bold">Welcome to <span className="text-green-600 font-extrabold">{appName}</span></h1>
                <p className="mt-4 text-lg">Easily track and manage ERC-20 allowances for smart contract wallets.</p>
            </div>
        </Layout>
    );
}