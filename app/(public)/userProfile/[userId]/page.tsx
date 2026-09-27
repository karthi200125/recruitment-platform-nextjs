import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getServerSession } from "next-auth";

import { db } from "@/lib/db";
import { authOptions } from "@/lib/authentication/authOptions";
import { siteConfig } from "@/config";

import { getUserProfileUserById } from "@/actions/user/getuser/getUserProfileUserById";

import UserProfileClient from "./UserProfileClient";

interface Props {
  params: {
    userId: string;
  };
}

/* ---------------------------------------
   Lightweight metadata query
---------------------------------------- */

const getUserProfileMetadata = cache(
  async (userId: number) => {
    return db.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        role: true,
        username: true,
        firstName: true,
        lastName: true,
        userBio: true,
        profileImage: true,

        company: {
          select: {
            companyName: true,
            companyBio: true,
          },
        },
      },
    });
  }
);

/* ---------------------------------------
   SEO Metadata
---------------------------------------- */

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const userId = Number(params.userId);

  if (!Number.isInteger(userId) || userId <= 0) {
    return {
      title: "Profile Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const profile = await getUserProfileMetadata(userId);

  if (!profile) {
    return {
      title: "Profile Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const isOrganization = profile.role === "ORGANIZATION";

  const fullName =
    `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim();

  const title = isOrganization
    ? `${profile.company?.companyName ?? profile.username} | Company Profile`
    : fullName || profile.username;

  const description = isOrganization
    ? profile.company?.companyBio ??
    "Explore company information, hiring details, and open opportunities on Jobify."
    : profile.userBio ??
    "View professional profile, experience, education, projects, and skills on Jobify.";

  const ogImage =
    profile.profileImage ?? siteConfig.ogImage;

  const canonical = `/userProfile/${profile.id}`;

  return {
    title,
    description,

    alternates: {
      canonical,
    },

    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: canonical,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [
        profile.profileImage ??
        siteConfig.twitterImage,
      ],
    },
  };
}


export default async function UserProfilePage({
  params,
}: Props) {
  const userId = Number(params.userId);


  if (!Number.isInteger(userId) || userId <= 0) {
    notFound();
  }  

  const [session, profileResult] = await Promise.all([
    getServerSession(authOptions),
    getUserProfileUserById(userId),
  ]);

  
  if (
    !profileResult.success ||
    !profileResult.data
  ) {
    notFound();
  }  

  const currentUserId = session?.user?.id
    ? Number(session.user.id)
    : undefined;  

  return (
    <UserProfileClient
      initialProfile={profileResult.data}
      currentUserId={currentUserId}
    />
  );
}