import { Prisma } from "@prisma/client";

import { db } from "@/lib/db";
import { DashboardPagination as PaginatedResult } from "@/types/dashboard";
import { User } from "@/types";
import { getPaginationArgs, buildPaginationMeta } from "../utils/paginate";
import { ParsedTableParams } from "../utils/parseTableParams";

const USER_SELECT = {
  id: true,
  username: true,
  firstName: true,
  lastName: true,
  profileImage: true,
  profession: true,
} satisfies Prisma.UserSelect;

const searchClause = (search: string): Prisma.UserWhereInput =>
  search
    ? {
        OR: [
          { username: { contains: search, mode: "insensitive" } },
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

interface GetFollowUsersArgs {
  userId: number;
  direction: "followers" | "following";
  params: ParsedTableParams;
}

export const getFollowUsersPage = async ({
  userId,
  direction,
  params,
}: GetFollowUsersArgs): Promise<PaginatedResult<User>> => {
  const where: Prisma.FollowWhereInput =
    direction === "followers" ? { followingId: userId } : { followerId: userId };

  const userFilter = searchClause(params.search);
  const { skip, take } = getPaginationArgs({ page: params.page, limit: params.limit });

  const relationField = direction === "followers" ? "follower" : "following";

  const [rows, total] = await Promise.all([
    db.follow.findMany({
      where: { ...where, [relationField]: userFilter },
      include: { [relationField]: { select: USER_SELECT } },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    db.follow.count({ where: { ...where, [relationField]: userFilter } }),
  ]);

  return {
    data: rows.map((r: any) => r[relationField]) as User[],
    pagination: buildPaginationMeta(params.page, params.limit, total),
  };
};

interface GetEmployeesArgs {
  companyId: number;
  params: ParsedTableParams;
}

export const getEmployeesPage = async ({ companyId, params }: GetEmployeesArgs): Promise<PaginatedResult<User>> => {
  const where: Prisma.CompanyEmployeeWhereInput = {
    companyId,
    status: "ACCEPTED",
    user: searchClause(params.search),
  };

  const { skip, take } = getPaginationArgs({ page: params.page, limit: params.limit });

  const [rows, total] = await Promise.all([
    db.companyEmployee.findMany({
      where,
      include: { user: { select: USER_SELECT } },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    db.companyEmployee.count({ where }),
  ]);

  return {
    data: rows.map((r) => r.user) as User[],
    pagination: buildPaginationMeta(params.page, params.limit, total),
  };
};