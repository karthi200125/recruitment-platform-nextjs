import { PrismaClient } from "@prisma/client";

const EDUCATION_DATA = [
    {
        instituteName: "Anna University",
        degree: "Bachelor of Engineering",
        fieldOfStudy: "Computer Science and Engineering",
        startDate: "2018",
        endDate: "2022",
        percentage: "82%",
    },
    {
        instituteName: "PSG College of Technology",
        degree: "Bachelor of Engineering",
        fieldOfStudy: "Information Technology",
        startDate: "2017",
        endDate: "2021",
        percentage: "86%",
    },
    {
        instituteName: "Vellore Institute of Technology",
        degree: "Bachelor of Technology",
        fieldOfStudy: "Computer Science",
        startDate: "2019",
        endDate: "2023",
        percentage: "79%",
    },
    {
        instituteName: "SRM Institute of Science and Technology",
        degree: "Bachelor of Technology",
        fieldOfStudy: "Computer Science and Engineering",
        startDate: "2018",
        endDate: "2022",
        percentage: "84%",
    },
    {
        instituteName: "Amrita Vishwa Vidyapeetham",
        degree: "Bachelor of Technology",
        fieldOfStudy: "Artificial Intelligence",
        startDate: "2019",
        endDate: "2023",
        percentage: "81%",
    },
    {
        instituteName: "Christ University",
        degree: "Bachelor of Computer Applications",
        fieldOfStudy: "Computer Applications",
        startDate: "2019",
        endDate: "2022",
        percentage: "88%",
    },
    {
        instituteName: "Loyola College",
        degree: "Bachelor of Science",
        fieldOfStudy: "Computer Science",
        startDate: "2018",
        endDate: "2021",
        percentage: "85%",
    },
    {
        instituteName: "Bharathiar University",
        degree: "Master of Computer Applications",
        fieldOfStudy: "Computer Applications",
        startDate: "2021",
        endDate: "2023",
        percentage: "80%",
    },
    {
        instituteName: "University of Hyderabad",
        degree: "Master of Science",
        fieldOfStudy: "Data Science",
        startDate: "2020",
        endDate: "2022",
        percentage: "83%",
    },
    {
        instituteName: "Manipal Institute of Technology",
        degree: "Bachelor of Engineering",
        fieldOfStudy: "Information Technology",
        startDate: "2018",
        endDate: "2022",
        percentage: "87%",
    },
];

export async function seedEducation(
    prisma: PrismaClient
) {
    console.log("🎓 Seeding education...");

    await prisma.education.deleteMany();

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
         * Most candidates have one degree.
         * Some have an additional postgraduate degree.
         */
        const educationCount =
            Math.random() < 0.2 ? 2 : 1;

        const usedIndexes = new Set<number>();

        for (
            let i = 0;
            i < educationCount;
            i++
        ) {
            let index =
                Math.floor(
                    Math.random() *
                        EDUCATION_DATA.length
                );

            while (usedIndexes.has(index)) {
                index =
                    Math.floor(
                        Math.random() *
                            EDUCATION_DATA.length
                    );
            }

            usedIndexes.add(index);

            const education =
                EDUCATION_DATA[index];

            await prisma.education.create({
                data: {
                    instituteName:
                        education.instituteName,

                    degree:
                        education.degree,

                    fieldOfStudy:
                        education.fieldOfStudy,

                    startDate:
                        education.startDate,

                    endDate:
                        education.endDate,

                    percentage:
                        education.percentage,

                    userId: user.id,
                },
            });

            created++;
        }
    }

    console.log(
        `   ✅ Education records: ${created}`
    );
}