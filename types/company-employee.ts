import { Prisma } from "@prisma/client";

export type CompanyEmployee = Prisma.CompanyEmployeeGetPayload<{}>;

export type CompanyEmployeeWithUser = Prisma.CompanyEmployeeGetPayload<{
    include: {
        user: true;
    };
}>;

export type CompanyEmployeeWithCompany = Prisma.CompanyEmployeeGetPayload<{
    include: {
        company: true;
    };
}>;

export type CompanyEmployeeWithInviter = Prisma.CompanyEmployeeGetPayload<{
    include: {
        invitedBy: true;
    };
}>;

export type PendingCompanyInvitation =
    Prisma.CompanyEmployeeGetPayload<{
        select: {
            id: true;

            role: true;

            status: true;

            createdAt: true;

            company: {
                select: {
                    id: true;
                    companyName: true;
                    companyImage: true;
                    companyIsVerified: true;
                };
            };

            invitedBy: {
                select: {
                    id: true;
                    username: true;
                    firstName: true;
                    lastName: true;
                    profileImage: true;
                };
            };
        };
    }>;

export interface RecruiterSearchResult {
    id: number;
    username: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    profession: string | null;
    profileImage: string | null;
}

export interface InviteRecruiterInput {
    recruiterId: number;
}

export interface InviteRecruiterResponse {
    success: boolean;
    message: string;
}