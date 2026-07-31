import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getUserProfileUserById } from "@/actions/user/getuser/getUserProfileUserById";
import { siteConfig } from "@/config";

import UserProfileClient from "./UserProfileClient";

interface UserProfilePageProps {
  params: {
    userId: string;
  };
}

export async function generateMetadata({
  params,
}: UserProfilePageProps): Promise<Metadata> {
  const userId = Number(params.userId);

  if (Number.isNaN(userId)) {
    return {
      title: "Profile Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const result = await getUserProfileUserById(userId);

  if (!result.success || !result.data) {
    return {
      title: "Profile Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const profile = result.data;

  const isOrganization = profile.role === "ORGANIZATION";

  const title = isOrganization
    ? `${profile.company?.companyName ?? profile.username} | Company Profile`
    : `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim() ||
    profile.username;

  const description = isOrganization
    ? profile.company?.companyBio ??
    "Explore company information, hiring details, and open opportunities on Jobify."
    : profile.userBio ??
    "View professional profile, experience, education, projects, and skills on Jobify.";

  return {
    title,

    description,

    alternates: {
      canonical: `/userProfile/${profile.id}`,
    },

    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: `/userProfile/${profile.id}`,
      images: [
        {
          url:
            profile.profileImage ??
            siteConfig.ogImage,
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
}: UserProfilePageProps) {
  const userId = Number(params.userId);

  if (Number.isNaN(userId)) {
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