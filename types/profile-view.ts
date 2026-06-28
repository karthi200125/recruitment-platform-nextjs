import { Prisma } from "@prisma/client";

export type ProfileView = Prisma.ProfileViewGetPayload<{}>;

export type ProfileViewWithViewer = Prisma.ProfileViewGetPayload<{
    include: {
        viewer: true;
    };
}>;

export type ProfileViewWithProfileUser = Prisma.ProfileViewGetPayload<{
    include: {
        profileUser: true;
    };
}>;