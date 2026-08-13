import { PrismaClient } from "@prisma/client";

import { seedUsers } from "./data/users";
import { seedCompanies } from "./data/companies";
import { seedJobs } from "./data/jobs";
import { seedApplications } from "./data/applications";
import { seedSavedJobs } from "./data/saved-jobs";
import { seedCompanyEmployees } from "./data/company-employees";
import { seedEducation } from "./data/education";
import { seedExperiences } from "./data/experiences";
import { seedProjects } from "./data/projects";
import { seedApplicationStatusHistory } from "./data/application-status-history";
import { seedProfileViews } from "./data/profile-views";
import { seedFollows } from "./data/follows";
import { seedChatsMessages } from "./data/chats-messages";
import { seedSubscriptions } from "./data/subscriptions";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting Jobify database seed...");

    // 1. Users
    await seedUsers(prisma);

    // 2. Companies
    await seedCompanies(prisma);

    await seedJobs(prisma);

    await seedApplications(prisma);

    await seedSavedJobs(prisma);

    await seedCompanyEmployees(prisma);

    await seedEducation(prisma);

    await seedExperiences(prisma);

    await seedProjects(prisma);

    await seedApplicationStatusHistory(prisma);

    await seedProfileViews(prisma);

    await seedFollows(prisma);

    await seedChatsMessages(prisma);

    await seedSubscriptions(prisma);

    console.log("✅ Jobify database seed completed.");
}

main()
    .catch((error) => {
        console.error("❌ Seed failed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });