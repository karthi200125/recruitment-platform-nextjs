import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { db } from "@/lib/db";
import { getUserProfileUserById } from "@/actions/user/getuser/getUserProfileUserById";
import { siteConfig } from "@/config";
import UserProfileClient from "./UserProfileClient";

interface Props {
  params: {
    userId: string;
  };
}

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

  const isOrg = profile.role === "ORGANIZATION";

  const fullName =
    `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim();

  const title = isOrg
    ? `${profile.company?.companyName ?? profile.username} | Company Profile`
    : `${fullName || profile.username}`;

  const description = isOrg
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

  const result = await getUserProfileUserById(userId);

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <UserProfileClient
      initialProfile={result.data}
    />
  );
}