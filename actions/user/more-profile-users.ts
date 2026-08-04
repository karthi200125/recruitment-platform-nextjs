"use server";

import { Prisma, Role } from "@prisma/client";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authentication/authOptions";
import { db } from "@/lib/db";

export interface MoreProfileUser {
  id: number;
  displayName: string;
  image: string | null;
  subtitle: string | null;
  role: Role | null;
  isPro: boolean;
  isFollowing: boolean;
}

const MAX_CANDIDATES = 40;
const MAX_RESULTS = 8;
const FOLLOWER_SAMPLE_CAP = 500;

export const getSuggestedUsers = async (profileUserId: number): Promise<MoreProfileUser[]> => {
  try {
    if (!profileUserId) {
      return [];
    }

    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id ? Number(session.user.id) : null;

    const profileUser = await db.user.findUnique({
      where: { id: profileUserId },
      select: {
        id: true,
        role: true,
        profession: true,
        city: true,
        followers: { select: { id: true }, take: FOLLOWER_SAMPLE_CAP },
        companyMemberships: {
          where: { status: "ACCEPTED" },
          select: { companyId: true },
          take: 1,
        },
      },
    });

    if (!profileUser) {
      return [];
    }

    const followerIds = profileUser.followers.map((f) => f.id);

    const followingIds = currentUserId
      ? (
        await db.follow.findMany({
          where: { followerId: currentUserId },
          select: { followingId: true },
        })
      ).map((f) => f.followingId)
      : [];

    const where = buildCandidateFilter(profileUser);

    const candidates = await db.user.findMany({
      where,
      take: MAX_CANDIDATES,
      select: {
        id: true,
        username: true,
        profileImage: true,
        profession: true,
        city: true,
        role: true,
        isPro: true,
        company: {
          select: { companyName: true, companyImage: true, companyBio: true, companyIsVerified: true },
        },
      },
    });

    if (candidates.length === 0) {
      return [];
    }
    
    const mutualCounts = await getMutualFollowerCounts(
      candidates.map((c) => c.id),
      followerIds
    );

    const scored = candidates.map((candidate) => ({
      candidate,
      score: scoreCandidate(candidate, profileUser, {
        mutualFollowers: mutualCounts.get(candidate.id) ?? 0,
        isAlreadyFollowing: followingIds.includes(candidate.id),
      }),
    }));

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_RESULTS)
      .map(({ candidate }) => toMoreProfileUser(candidate, followingIds));
  } catch (error) {
    console.error("[GET_SUGGESTED_USERS]", error);
    return [];
  }
};

const buildCandidateFilter = (profileUser: {
  id: number;
  role: Role | null;
  companyMemberships: { companyId: number }[];
}): Prisma.UserWhereInput => {
  const base: Prisma.UserWhereInput = { id: { not: profileUser.id } };

  switch (profileUser.role) {
    case Role.CANDIDATE:
      return { ...base, role: { in: [Role.CANDIDATE, Role.RECRUITER] } };

    case Role.RECRUITER: {
      const currentCompanyId = profileUser.companyMemberships[0]?.companyId;
      return {
        ...base,
        role: Role.RECRUITER,
        ...(currentCompanyId && {
          companyMemberships: { none: { companyId: currentCompanyId, status: "ACCEPTED" } },
        }),
      };
    }

    case Role.ORGANIZATION:
      return { ...base, role: Role.ORGANIZATION };

    default:
      // no role set yet — fall back to a generic mixed pool rather than
      // excluding everyone or throwing
      return base;
  }
};

const getMutualFollowerCounts = async (
  candidateIds: number[],
  profileFollowerIds: number[]
): Promise<Map<number, number>> => {
  if (candidateIds.length === 0 || profileFollowerIds.length === 0) {
    return new Map();
  }

  const grouped = await db.follow.groupBy({
    by: ["followingId"],
    where: {
      followingId: { in: candidateIds },
      followerId: { in: profileFollowerIds },
    },
    _count: true,
  });

  return new Map(grouped.map((g) => [g.followingId, g._count]));
};

interface CandidateRow {
  id: number;
  role: Role | null;
  profession: string | null;
  city: string | null;
  isPro: boolean;
  company: { companyIsVerified: boolean } | null;
}

const scoreCandidate = (
  candidate: CandidateRow,
  profileUser: { role: Role | null; profession: string | null; city: string | null },
  extra: { mutualFollowers: number; isAlreadyFollowing: boolean }
): number => {
  let score = 0;

  if (candidate.role && candidate.role === profileUser.role) score += 50;
  if (profileUser.profession && candidate.profession === profileUser.profession) score += 30;
  if (profileUser.city && candidate.city === profileUser.city) score += 20;

  score += extra.mutualFollowers * 10;

  if (candidate.isPro) score += 5;
  if (candidate.role === Role.ORGANIZATION && candidate.company?.companyIsVerified) score += 15;
  if (extra.isAlreadyFollowing) score -= 40;

  return score;
};

const toMoreProfileUser = (
  candidate: {
    id: number;
    username: string;
    profileImage: string | null;
    profession: string | null;
    role: Role | null;
    isPro: boolean;
    company: { companyName: string; companyImage: string | null; companyBio: string } | null;
  },
  followingIds: number[]
): MoreProfileUser => {
  const isOrganization = candidate.role === Role.ORGANIZATION;

  return {
    id: candidate.id,
    displayName: isOrganization ? candidate.company?.companyName ?? candidate.username : candidate.username,
    image: isOrganization ? candidate.company?.companyImage ?? null : candidate.profileImage,
    subtitle: isOrganization ? candidate.company?.companyBio ?? null : candidate.profession,
    role: candidate.role,
    isPro: candidate.isPro,
    isFollowing: followingIds.includes(candidate.id),
  };
};