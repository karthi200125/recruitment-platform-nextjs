'use server';

import { authOptions } from '@/lib/authOptions';
import { db } from '@/lib/db';
import { CompanySchema } from '@/lib/SchemaTypes';
import { Role } from '@prisma/client';
import { getServerSession } from 'next-auth';
import * as z from 'zod';

interface UserProps {
    id: number,
    role?: Role
}

export const createCompanyAction = async (
    values: z.infer<typeof CompanySchema>,
    isEdit?: boolean,
    companyId?: number
) => {
    try {
        const user: UserProps = await getServerSession(authOptions);

        if (!user || user.role !== 'ORGANIZATION') {
            return { error: 'You are not allowed to create a company' };
        }

        const validatedFields = CompanySchema.safeParse(values);

        if (!validatedFields.success) {
            return { error: 'Invalid fields', details: validatedFields.error.errors };
        }

        const data = validatedFields.data;

        if (isEdit) {
            if (!companyId) {
                return { error: 'Company ID is required for editing' };
            }

            const updatedCompany = await db.company.update({
                where: { id: companyId },
                data: { ...data }
            });

            return { success: 'Company edited successfully', data: updatedCompany };
        } else {
            const companyExists = await db.company.findFirst({
                where: { companyName: data.companyName }
            });

            if (companyExists) {
                return { error: `Company '${data.companyName}' already exists` };
            }

            const newCompany = await db.company.create({
                data: {
                    ...data,
                    userId: user.id
                },
            });

            return { success: `Company '${newCompany.companyName}' created successfully`, data: newCompany };
        }
    } catch (error) {
        console.error('Error in createCompanyAction:', error);
        return { error: 'Company creation failed', details: error };
    }
};
