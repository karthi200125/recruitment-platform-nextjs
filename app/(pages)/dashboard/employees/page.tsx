

import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/authOptions';

import { getCompaniesEmployees } from '@/actions/getCompanyEmployees';
import { getCompanyVerifyEmployees } from '@/actions/company/getCompanyVerifyEmployees';
import EmployeesClient from './EmployeesClient';
import { db } from '@/lib/db';

export const metadata: Metadata = {
    title: 'Employees Dashboard',
    robots: {
        index: false,
        follow: false,
    },
};

const EmployeesPage = async () => {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect('/login');
    }

    const userId = Number(session.user.id);

    
    const user = await db.user.findUnique({
        where: { id: userId },
        select: {
            employees: true,
            verifyEmps: true,
        },
    });

    if (!user) {
        redirect('/login');
    }

    const [companyEmps, verificationEmps] = await Promise.all([
        getCompaniesEmployees(user?.employees ?? []),
        getCompanyVerifyEmployees(user?.verifyEmps ?? []),
    ]);

    return (
        <EmployeesClient
            user={user}
            currentUserId={userId}
            companyEmps={companyEmps}
            verificationEmps={verificationEmps}
        />
    );
};

export default EmployeesPage;