import { PrismaClient } from "@prisma/client";

const EXPERIENCE_DATA = [
    {
        companyName: "Tata Consultancy Services",
        position: "Software Engineer",
        startDate: "2022",
        endDate: "2024",
        description:
            "Developed scalable web applications using React, Node.js and REST APIs while collaborating with cross-functional engineering teams.",
    },
    {
        companyName: "Infosys",
        position: "Frontend Developer",
        startDate: "2021",
        endDate: "2023",
        description:
            "Built responsive enterprise interfaces using React, TypeScript and modern frontend development practices.",
    },
    {
        companyName: "Wipro",
        position: "Full Stack Developer",
        startDate: "2022",
        endDate: "2025",
        description:
            "Worked on full-stack applications using React, Node.js, Express and PostgreSQL.",
    },
    {
        companyName: "Accenture",
        position: "Software Developer",
        startDate: "2021",
        endDate: "2024",
        description:
            "Designed and implemented web features, APIs and database integrations for enterprise applications.",
    },
    {
        companyName: "Zoho",
        position: "Software Engineer",
        startDate: "2022",
        endDate: "2025",
        description:
            "Developed product features and backend services while improving application performance and reliability.",
    },
    {
        companyName: "Freshworks",
        position: "Frontend Engineer",
        startDate: "2023",
        endDate: "2025",
        description:
            "Built reusable React components and improved accessibility, performance and user experience.",
    },
    {
        companyName: "Razorpay",
        position: "Backend Engineer",
        startDate: "2022",
        endDate: "2024",
        description:
            "Developed backend services and payment-related APIs with a focus on reliability and security.",
    },
    {
        companyName: "Swiggy",
        position: "Software Engineer",
        startDate: "2021",
        endDate: "2024",
        description:
            "Worked on consumer-facing web applications and internal engineering tools.",
    },
    {
        companyName: "PhonePe",
        position: "Full Stack Engineer",
        startDate: "2022",
        endDate: "2025",
        description:
            "Built scalable frontend and backend features using modern JavaScript technologies.",
    },
    {
        companyName: "Flipkart",
        position: "Frontend Engineer",
        startDate: "2020",
        endDate: "2023",
        description:
            "Developed responsive e-commerce experiences and reusable frontend components.",
    },
    {
        companyName: "Deloitte",
        position: "Technology Analyst",
        startDate: "2021",
        endDate: "2024",
        description:
            "Developed business applications and integrations for enterprise clients.",
    },
    {
        companyName: "Cognizant",
        position: "Programmer Analyst",
        startDate: "2020",
        endDate: "2023",
        description:
            "Worked on application development, debugging and API integrations.",
    },
    {
        companyName: "Microsoft",
        position: "Software Engineer",
        startDate: "2023",
        endDate: "2025",
        description:
            "Built cloud-connected software features and collaborated with engineering teams on large-scale applications.",
    },
    {
        companyName: "Google",
        position: "Software Engineer",
        startDate: "2022",
        endDate: "2025",
        description:
            "Worked on software development, testing and scalable application architecture.",
    },
    {
        companyName: "Amazon",
        position: "Software Development Engineer",
        startDate: "2021",
        endDate: "2024",
        description:
            "Developed scalable services and customer-facing features with a focus on performance and reliability.",
    },
];

export async function seedExperiences(
    prisma: PrismaClient
) {
    console.log("💼 Seeding experiences...");

    await prisma.experience.deleteMany();

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
         * 35% → no experience
         * 45% → one experience
         * 20% → two experiences
         *
         * This gives the dataset a realistic
         * mixture of freshers and experienced
         * candidates.
         */
        const random =
            Math.random();

        let experienceCount = 0;

        if (random < 0.35) {
            experienceCount = 0;
        } else if (random < 0.80) {
            experienceCount = 1;
        } else {
            experienceCount = 2;
        }

        const usedIndexes =
            new Set<number>();

        for (
            let i = 0;
            i < experienceCount;
            i++
        ) {
            let index =
                Math.floor(
                    Math.random() *
                        EXPERIENCE_DATA.length
                );

            while (usedIndexes.has(index)) {
                index =
                    Math.floor(
                        Math.random() *
                            EXPERIENCE_DATA.length
                    );
            }

            usedIndexes.add(index);

            const experience =
                EXPERIENCE_DATA[index];

            await prisma.experience.create({
                data: {
                    companyName:
                        experience.companyName,

                    position:
                        experience.position,

                    startDate:
                        experience.startDate,

                    endDate:
                        experience.endDate,

                    description:
                        experience.description,

                    userId: user.id,
                },
            });

            created++;
        }
    }

    console.log(
        `   ✅ Experience records: ${created}`
    );
}