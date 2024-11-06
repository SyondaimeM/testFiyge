import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import FormBuilder from '@/Components/FormBuilder';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            
            <FormBuilder></FormBuilder>
        </AuthenticatedLayout>
    );
}
