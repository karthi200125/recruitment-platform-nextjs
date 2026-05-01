"use server";

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

type UserRole = "CANDIDATE" | "RECRUITER" | "ORGANIZATION";

export interface MoreProfileUser {
  id: number;
  username: string | null;
  userImage: string | null;
  profession: string | null;
  role: UserRole;
  isPro: boolean;
  isFollowing: boolean;
}

export const moreProUsers = async (
  profileUserId: number,
  followersInput: { id: number }[] | null | undefined,
  userRole: UserRole
): Promise<MoreProfileUser[]> => {
  try {    
    if (!Number.isInteger(profileUserId)) return [];
    
    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id;

    const isCurrentUser = currentUserId === profileUserId;
    
    const followerIds: number[] =
      followersInput?.map((u) => u.id) ?? [];


    let whereClause: Prisma.UserWhereInput;

    switch (userRole) {
      case "CANDIDATE":
      case "RECRUITER":
        whereClause = {
          role: { not: "ORGANIZATION" },
          id: isCurrentUser
            ? { not: profileUserId }
            : {
                in: followerIds.length > 0 ? followerIds : [-1],
                not: profileUserId,
              },
        };
        break;

      case "ORGANIZATION":
        whereClause = {
          role: "ORGANIZATION",
          id: { not: profileUserId },
        };
        break;

      default:
        return [];
    }


    const users = await db.user.findMany({
      where: whereClause,
      take: 8,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        username: true,
        userImage: true,
        profession: true,
        role: true,
        isPro: true,
      },
    });


    let followingIds: number[] = [];

    if (currentUserId) {
      const followings = await db.user.findUnique({
        where: { id: currentUserId },
        select: {
          following: { select: { id: true } },
        },
      });

      followingIds =
        followings?.following.map((u) => u.id) ?? [];
    }


    const formattedUsers: MoreProfileUser[] = users.map(
      (user) => ({
        id: user.id,
        username: user.username,
        userImage: user.userImage,
        profession: user.profession,
        role: user.role as UserRole,
        isPro: user.isPro ?? false,
        isFollowing: followingIds.includes(user.id),
      })
    );

    return formattedUsers;
  } catch (error) {
    console.error("[moreProUsers]", error);
    return [];
  }
};












// "use server";

// import { db } from "@/lib/db";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/authOptions";

// /* ──────────────────────────────────────────────── */
// type UserRole = "CANDIDATE" | "RECRUITER" | "ORGANIZATION";

// export interface MoreProfileUser {
//   id: number;
//   username: string | null;
//   userImage: string | null;
//   profession: string | null;
//   role: UserRole;
//   isPro: boolean;
//   isFollowing: boolean;
// }
// /* ──────────────────────────────────────────────── */

// export const moreProUsers = async (
//   profileUserId: number
// ): Promise<MoreProfileUser[]> => {
//   try {
//     /* ✅ Session */
//     const session = await getServerSession(authOptions);
//     const currentUserId = session?.user?.id;

//     if (!profileUserId) return [];

//     /* ────────────────────────────────────────────────
//        Get current profile user (the one we are viewing)
//     ──────────────────────────────────────────────── */
//     const profileUser = await db.user.findUnique({
//       where: { id: profileUserId },
//       select: {
//         id: true,
//         role: true,
//         profession: true,
//         city: true,
//         followers: { select: { id: true } },
//       },
//     });

//     if (!profileUser) return [];

//     const followerIds = profileUser.followers.map((f) => f.id);

//     /* ────────────────────────────────────────────────
//        Get current logged-in user's following
//     ──────────────────────────────────────────────── */
//     let followingIds: number[] = [];

//     if (currentUserId) {
//       const currentUser = await db.user.findUnique({
//         where: { id: currentUserId },
//         select: {
//           following: { select: { id: true } },
//         },
//       });

//       followingIds =
//         currentUser?.following.map((u) => u.id) ?? [];
//     }

//     /* ────────────────────────────────────────────────
//        Fetch candidate pool (broad query)
//     ──────────────────────────────────────────────── */
//     const users = await db.user.findMany({
//       where: {
//         id: { not: profileUserId },
//       },
//       select: {
//         id: true,
//         username: true,
//         userImage: true,
//         profession: true,
//         role: true,
//         isPro: true,
//         city: true,
//         followers: { select: { id: true } },
//       },
//       take: 50, // 👈 candidate pool
//     });

//     /* ────────────────────────────────────────────────
//        SCORING ENGINE
//     ──────────────────────────────────────────────── */
//     const scoredUsers = users.map((user) => {
//       let score = 0;

//       // same role
//       if (user.role === profileUser.role) score += 40;

//       // same profession
//       if (
//         user.profession &&
//         profileUser.profession &&
//         user.profession === profileUser.profession
//       ) {
//         score += 30;
//       }

//       // same city
//       if (user.city && user.city === profileUser.city) {
//         score += 20;
//       }

//       // mutual followers
//       const mutual = user.followers.filter((f) =>
//         followerIds.includes(f.id)
//       ).length;

//       score += mutual * 10;

//       // already following → reduce score
//       if (followingIds.includes(user.id)) {
//         score -= 50;
//       }

//       return { user, score };
//     });

//     /* ────────────────────────────────────────────────
//        SORT & PICK TOP USERS
//     ──────────────────────────────────────────────── */
//     const topUsers = scoredUsers
//       .sort((a, b) => b.score - a.score)
//       .slice(0, 8);

//     /* ────────────────────────────────────────────────
//        FORMAT RESPONSE
//     ──────────────────────────────────────────────── */
//     return topUsers.map(({ user }) => ({
//       id: user.id,
//       username: user.username,
//       userImage: user.userImage,
//       profession: user.profession,
//       role: user.role as UserRole,
//       isPro: user.isPro ?? false,
//       isFollowing: followingIds.includes(user.id),
//     }));
//   } catch (error) {
//     console.error("[AI moreProUsers]", error);
//     return [];
//   }
// };