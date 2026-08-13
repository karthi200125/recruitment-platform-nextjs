import { Prisma, PrismaClient } from "@prisma/client";

const JOBS_PER_COMPANY = 8;

const JOB_TEMPLATES = [
    {
        title: "Software Engineer",
        experience: "2-4 years",
        salary: "₹8L - ₹16L per year",
        type: "Full Time",
        mode: "Hybrid",
        skills: ["JavaScript", "TypeScript", "React", "Node.js", "Git"],
    },
    {
        title: "Frontend Developer",
        experience: "1-3 years",
        salary: "₹6L - ₹13L per year",
        type: "Full Time",
        mode: "Remote",
        skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Git"],
    },
    {
        title: "Backend Developer",
        experience: "2-5 years",
        salary: "₹9L - ₹18L per year",
        type: "Full Time",
        mode: "Hybrid",
        skills: ["Node.js", "Java", "PostgreSQL", "REST API", "Docker"],
    },
    {
        title: "Full Stack Developer",
        experience: "2-4 years",
        salary: "₹8L - ₹17L per year",
        type: "Full Time",
        mode: "Remote",
        skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
    },
    {
        title: "Data Engineer",
        experience: "2-5 years",
        salary: "₹10L - ₹20L per year",
        type: "Full Time",
        mode: "Hybrid",
        skills: ["Python", "SQL", "Spark", "AWS", "ETL"],
    },
    {
        title: "DevOps Engineer",
        experience: "3-6 years",
        salary: "₹12L - ₹24L per year",
        type: "Full Time",
        mode: "Remote",
        skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Linux"],
    },
    {
        title: "Product Manager",
        experience: "3-6 years",
        salary: "₹12L - ₹22L per year",
        type: "Full Time",
        mode: "Onsite",
        skills: ["Product Management", "Agile", "Jira", "Analytics", "Strategy"],
    },
    {
        title: "UI/UX Designer",
        experience: "1-4 years",
        salary: "₹6L - ₹14L per year",
        type: "Full Time",
        mode: "Hybrid",
        skills: ["Figma", "UI Design", "UX Research", "Prototyping", "Design Systems"],
    },
];

const LOCATIONS = [
    {
        city: "Bengaluru",
        state: "Karnataka",
        country: "India",
    },
    {
        city: "Chennai",
        state: "Tamil Nadu",
        country: "India",
    },
    {
        city: "Hyderabad",
        state: "Telangana",
        country: "India",
    },
    {
        city: "Pune",
        state: "Maharashtra",
        country: "India",
    },
    {
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
    },
    {
        city: "Delhi",
        state: "Delhi",
        country: "India",
    },
    {
        city: "Gurugram",
        state: "Haryana",
        country: "India",
    },
    {
        city: "Noida",
        state: "Uttar Pradesh",
        country: "India",
    },
    {
        city: "New York",
        state: "New York",
        country: "United States",
    },
    {
        city: "Seattle",
        state: "Washington",
        country: "United States",
    },
    {
        city: "Austin",
        state: "Texas",
        country: "United States",
    },
    {
        city: "London",
        state: "England",
        country: "United Kingdom",
    },
];

const JOB_DESCRIPTIONS = [
    "We are looking for a talented professional to join our growing team. You will work closely with engineers, designers, product managers, and other stakeholders to build reliable and scalable products.",

    "Join a collaborative team working on products used by customers around the world. You will have the opportunity to solve challenging technical problems and contribute throughout the product development lifecycle.",

    "We are looking for someone who enjoys solving complex problems, writing clean and maintainable code, and working in a fast-paced environment. This role offers strong opportunities for learning and career growth.",

    "You will work with a highly motivated team to design, develop, test, and continuously improve our products. Strong communication, ownership, and problem-solving skills are important for this position.",

    "This is an opportunity to work on meaningful products at scale. You will collaborate with cross-functional teams and help turn business requirements into reliable and user-friendly solutions.",
];

const JOB_RESPONSIBILITIES = [
    "Design, develop, test, and maintain high-quality software.",
    "Collaborate with engineers, product managers, designers, and other stakeholders.",
    "Participate in code reviews and contribute to engineering best practices.",
    "Troubleshoot production issues and improve application reliability.",
    "Write maintainable, scalable, and well-documented code.",
];

const JOB_REQUIREMENTS = [
    "Strong problem-solving and analytical skills.",
    "Good communication and collaboration skills.",
    "Ability to work independently and as part of a team.",
    "Experience working with modern development tools and practices.",
    "Passion for learning new technologies and solving real-world problems.",
];

function randomPastDate(minDays: number, maxDays: number) {
    const now = Date.now();

    const days =
        Math.floor(
            Math.random() * (maxDays - minDays + 1)
        ) + minDays;

    return new Date(
        now - days * 24 * 60 * 60 * 1000
    );
}

function randomItem<T>(items: T[]): T {
    return items[
        Math.floor(Math.random() * items.length)
    ];
}

function buildDescription(
    companyName: string,
    title: string
) {
    const intro = randomItem(JOB_DESCRIPTIONS);

    return `
${intro}

About the role:
As a ${title} at ${companyName}, you will take ownership of important projects and work with a talented team to deliver high-quality solutions.

Key responsibilities:
${JOB_RESPONSIBILITIES.map(
        (item) => `• ${item}`
    ).join("\n")}

What we're looking for:
${JOB_REQUIREMENTS.map(
        (item) => `• ${item}`
    ).join("\n")}

Why join us:
• Work on meaningful products and challenging problems.
• Collaborate with experienced professionals.
• Learn modern technologies and engineering practices.
• Grow your career in a supportive environment.
`.trim();
}

export async function seedJobs(
    prisma: PrismaClient
) {
    console.log("💼 Seeding jobs...");

    /*
     * DEV SEED ONLY
     *
     * We can safely recreate jobs at this stage because
     * applications and saved jobs have not been seeded yet.
     *
     * Later, once dependent data exists, remove this.
     */
    await prisma.job.deleteMany();

    const companies = await prisma.company.findMany({
        orderBy: {
            id: "asc",
        },
    });

    if (companies.length === 0) {
        throw new Error(
            "No companies found. Seed companies before jobs."
        );
    }

    const jobPosters = await prisma.user.findMany({
        where: {
            role: {
                in: ["RECRUITER", "ORGANIZATION"],
            },
        },
        orderBy: {
            id: "asc",
        },
    });

    if (jobPosters.length === 0) {
        throw new Error(
            "No recruiter or organization users found."
        );
    }

    let createdJobs = 0;

    for (let companyIndex = 0; companyIndex < companies.length; companyIndex++) {
        const company = companies[companyIndex];

        for (
            let jobIndex = 0;
            jobIndex < JOBS_PER_COMPANY;
            jobIndex++
        ) {
            const template =
                JOB_TEMPLATES[
                (companyIndex + jobIndex) %
                JOB_TEMPLATES.length
                ];

            const location =
                LOCATIONS[
                (companyIndex + jobIndex) %
                LOCATIONS.length
                ];

            const poster =
                jobPosters[
                (companyIndex + jobIndex) %
                jobPosters.length
                ];

            const createdAt =
                randomPastDate(1, 180);

            const expiresAt = new Date(
                createdAt.getTime() +
                45 *
                24 *
                60 *
                60 *
                1000
            );

            const isEasyApply =
                (companyIndex + jobIndex) % 3 === 0;

            const title =
                template.title;

            const jobDesc =
                buildDescription(
                    company.companyName,
                    title
                );

            await prisma.job.create({
                data: {
                    jobTitle: title,

                    jobDesc,

                    experience:
                        template.experience,

                    salary:
                        template.salary,

                    vacancies:
                        String(
                            ((companyIndex +
                                jobIndex) %
                                5) +
                            1
                        ),

                    city:
                        location.city,

                    state:
                        location.state,

                    country:
                        location.country,

                    type:
                        template.type,

                    mode:
                        template.mode,

                    isEasyApply,

                    applyLink:
                        isEasyApply
                            ? null
                            : company.companyWebsite ??
                            null,

                    skills:
                        template.skills,

                    questions: isEasyApply
                        ? [
                            {
                                question:
                                    "Why are you interested in this position?",
                                required: true,
                            },
                            {
                                question:
                                    "How soon can you join?",
                                required: true,
                            },
                        ]
                        : Prisma.JsonNull,

                    status: "ACTIVE",

                    expiresAt,

                    userId:
                        poster.id,

                    companyId:
                        company.id,

                    createdAt,
                },
            });

            createdJobs++;

            console.log(
                `   ✅ ${company.companyName} → ${title}`
            );
        }
    }

    console.log(
        `\n   🎉 Total jobs created: ${createdJobs}`
    );
}