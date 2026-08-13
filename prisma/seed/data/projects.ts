import { PrismaClient } from "@prisma/client";

const PROJECT_DATA = [
    {
        proName: "Jobify",
        proDesc:
            "A full-stack job marketplace platform connecting candidates, recruiters and organizations with job discovery, applications and recruitment workflows.",
    },
    {
        proName: "TaskFlow",
        proDesc:
            "A project management application with boards, tasks, team collaboration and productivity tracking.",
    },
    {
        proName: "ShopSphere",
        proDesc:
            "A modern e-commerce platform with product browsing, cart management, checkout and order tracking.",
    },
    {
        proName: "Foodie",
        proDesc:
            "A food ordering application that allows users to discover restaurants, browse menus and place orders.",
    },
    {
        proName: "FinanceTracker",
        proDesc:
            "A personal finance dashboard for tracking income, expenses, budgets and financial trends.",
    },
    {
        proName: "FitTrack",
        proDesc:
            "A fitness management application for tracking workouts, exercises, goals and personal progress.",
    },
    {
        proName: "ChatSphere",
        proDesc:
            "A real-time messaging platform supporting conversations, user profiles and media sharing.",
    },
    {
        proName: "ResumeBuilder",
        proDesc:
            "An online resume builder allowing users to create professional resumes using customizable templates.",
    },
    {
        proName: "DevPortfolio",
        proDesc:
            "A developer portfolio platform showcasing projects, technical skills, experience and professional achievements.",
    },
    {
        proName: "EventHub",
        proDesc:
            "An event discovery and management platform for browsing events, registrations and attendee information.",
    },
    {
        proName: "TravelMate",
        proDesc:
            "A travel planning application for discovering destinations and organizing trips and itineraries.",
    },
    {
        proName: "LearningHub",
        proDesc:
            "An online learning platform for discovering courses, tracking progress and managing learning resources.",
    },
];

function projectImage(
    projectName: string
) {
    return `https://placehold.co/1200x800/png?text=${encodeURIComponent(
        projectName
    )}`;
}

export async function seedProjects(
    prisma: PrismaClient
) {
    console.log("🚀 Seeding projects...");

    await prisma.project.deleteMany();

    const candidates =
        await prisma.user.findMany({
            where: {
                role: "CANDIDATE",
            },
            select: {
                id: true,
            },
        });

    if (candidates.length === 0) {
        throw new Error(
            "No candidate users found. Seed users first."
        );
    }

    let created = 0;

    for (const user of candidates) {
        /*
         * Some candidates have one project,
         * some have multiple projects.
         *
         * This creates a realistic portfolio
         * distribution.
         */
        const random =
            Math.random();

        let projectCount = 1;

        if (random < 0.20) {
            projectCount = 1;
        } else if (random < 0.65) {
            projectCount = 2;
        } else if (random < 0.90) {
            projectCount = 3;
        } else {
            projectCount = 4;
        }

        const usedIndexes =
            new Set<number>();

        for (
            let i = 0;
            i < projectCount;
            i++
        ) {
            let index =
                Math.floor(
                    Math.random() *
                    PROJECT_DATA.length
                );

            while (usedIndexes.has(index)) {
                index =
                    Math.floor(
                        Math.random() *
                        PROJECT_DATA.length
                    );
            }

            usedIndexes.add(index);

            const project =
                PROJECT_DATA[index];

            const slug =
                project.proName
                    .toLowerCase()
                    .replace(
                        /[^a-z0-9]+/g,
                        "-"
                    )
                    .replace(
                        /^-|-$/g,
                        ""
                    );

            await prisma.project.create({
                data: {
                    proName:
                        project.proName,

                    proLink:
                        `https://github.com/example/${slug}`,

                    proImage:
                        projectImage(
                            project.proName
                        ),

                    proDesc:
                        project.proDesc,

                    userId: user.id,
                },
            });

            created++;
        }
    }

    console.log(
        `   ✅ Project records: ${created}`
    );
}