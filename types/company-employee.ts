import { Prisma } from "@prisma/client";

export type CompanyEmployee = Prisma.CompanyEmployeeGetPayload<{}>;

export type CompanyEmployeeWithUser =
    Prisma.CompanyEmployeeGetPayload<{
        include: {
            user: true;
        };
    }>;

export type CompanyEmployeeWithCompany =
    Prisma.CompanyEmployeeGetPayload<{
        include: {
            company: true;
        };
    }>;

export type CompanyEmployeeWithUserAndCompany =
    Prisma.CompanyEmployeeGetPayload<{
        include: {
            user: true;
            company: true;
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