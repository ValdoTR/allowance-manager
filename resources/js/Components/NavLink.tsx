import { InertiaLinkProps, Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}: InertiaLinkProps & { active: boolean }) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-green-600 text-gray-900 focus:border-green-700'
                    : 'border-transparent text-gray-500 hover:border-green-200 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700') +
                className
            }
        >
            {children}
        </Link>
    );
}
