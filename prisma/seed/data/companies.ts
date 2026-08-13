import { PrismaClient } from "@prisma/client";
import { randomPastDate } from "../utils";

interface SeedCompany {
    companyName: string;
    companyWebsite: string;
    companyImage: string;
    companyBackImage: string;
    companyAddress: string;
    companyCity: string;
    companyState: string;
    companyCountry: string;
    companyAbout: string;
    companyBio: string;
    companyTotalEmployees: string;
}

/*
|--------------------------------------------------------------------------
| Company dataset
|--------------------------------------------------------------------------
|
| These companies are connected to the recruiter / organization
| users created by users.ts.
|
*/

const COMPANIES: SeedCompany[] = [
    {
        companyName: "Google",
        companyWebsite: "https://www.google.com",
        companyImage: "https://cdn.simpleicons.org/google",
        companyBackImage:
            "https://images.unsplash.com/photo-1573164713988-8665fc963095",
        companyAddress: "1600 Amphitheatre Parkway",
        companyCity: "Mountain View",
        companyState: "California",
        companyCountry: "United States",
        companyAbout:
            "Google is a global technology company building products and services that help billions of people access information, communicate, and work more effectively.",
        companyBio:
            "Technology, search, cloud, artificial intelligence, and digital products.",
        companyTotalEmployees: "100,000+",
    },

    {
        companyName: "Amazon",
        companyWebsite: "https://www.amazon.com",
        companyImage: "https://cdn.simpleicons.org/amazon",
        companyBackImage:
            "https://images.unsplash.com/photo-1586528116493-da8f8e5f7f8d",
        companyAddress: "410 Terry Avenue North",
        companyCity: "Seattle",
        companyState: "Washington",
        companyCountry: "United States",
        companyAbout:
            "Amazon is a global technology and commerce company focused on customer experience, cloud computing, digital services, logistics, and innovation.",
        companyBio:
            "E-commerce, cloud computing, logistics, digital services, and artificial intelligence.",
        companyTotalEmployees: "1,500,000+",
    },

    {
        companyName: "Microsoft",
        companyWebsite: "https://www.microsoft.com",
        companyImage: "https://cdn.simpleicons.org/microsoft",
        companyBackImage:
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
        companyAddress: "One Microsoft Way",
        companyCity: "Redmond",
        companyState: "Washington",
        companyCountry: "United States",
        companyAbout:
            "Microsoft develops software, cloud services, productivity platforms, operating systems, and artificial intelligence technologies used by individuals and organizations worldwide.",
        companyBio:
            "Cloud computing, enterprise software, productivity, gaming, and AI.",
        companyTotalEmployees: "200,000+",
    },

    {
        companyName: "Apple",
        companyWebsite: "https://www.apple.com",
        companyImage: "https://cdn.simpleicons.org/apple",
        companyBackImage:
            "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
        companyAddress: "One Apple Park Way",
        companyCity: "Cupertino",
        companyState: "California",
        companyCountry: "United States",
        companyAbout:
            "Apple designs and develops consumer electronics, software, services, and digital experiences used by customers around the world.",
        companyBio:
            "Consumer technology, software, hardware, services, and digital products.",
        companyTotalEmployees: "160,000+",
    },

    {
        companyName: "Meta",
        companyWebsite: "https://www.meta.com",
        companyImage: "https://cdn.simpleicons.org/meta",
        companyBackImage:
            "https://images.unsplash.com/photo-1497366216548-37526070297c",
        companyAddress: "1 Hacker Way",
        companyCity: "Menlo Park",
        companyState: "California",
        companyCountry: "United States",
        companyAbout:
            "Meta builds technologies that help people connect, communicate, and create communities across social platforms and immersive digital experiences.",
        companyBio:
            "Social technology, artificial intelligence, virtual reality, and digital communities.",
        companyTotalEmployees: "70,000+",
    },

    {
        companyName: "NVIDIA",
        companyWebsite: "https://www.nvidia.com",
        companyImage: "https://cdn.simpleicons.org/nvidia",
        companyBackImage:
            "https://images.unsplash.com/photo-1518770660439-4636190af475",
        companyAddress: "2788 San Tomas Expressway",
        companyCity: "Santa Clara",
        companyState: "California",
        companyCountry: "United States",
        companyAbout:
            "NVIDIA develops accelerated computing platforms, graphics technologies, and artificial intelligence solutions used across industries.",
        companyBio:
            "Artificial intelligence, GPUs, accelerated computing, and deep learning.",
        companyTotalEmployees: "30,000+",
    },

    {
        companyName: "Tata Consultancy Services",
        companyWebsite: "https://www.tcs.com",
        companyImage: "https://cdn.simpleicons.org/tcs",
        companyBackImage:
            "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
        companyAddress: "TCS House, Raveline Street",
        companyCity: "Mumbai",
        companyState: "Maharashtra",
        companyCountry: "India",
        companyAbout:
            "Tata Consultancy Services is a global IT services and consulting company helping organizations transform through technology and digital innovation.",
        companyBio:
            "IT services, consulting, cloud, digital transformation, and enterprise technology.",
        companyTotalEmployees: "600,000+",
    },

    {
        companyName: "Infosys",
        companyWebsite: "https://www.infosys.com",
        companyImage: "https://cdn.simpleicons.org/infosys",
        companyBackImage:
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
        companyAddress: "Electronics City",
        companyCity: "Bangalore",
        companyState: "Karnataka",
        companyCountry: "India",
        companyAbout:
            "Infosys provides digital services, consulting, and technology solutions to enterprises around the world.",
        companyBio:
            "Technology consulting, digital services, cloud, and enterprise solutions.",
        companyTotalEmployees: "300,000+",
    },

    {
        companyName: "Accenture",
        companyWebsite: "https://www.accenture.com",
        companyImage: "https://cdn.simpleicons.org/accenture",
        companyBackImage:
            "https://images.unsplash.com/photo-1497366216548-37526070297c",
        companyAddress: "1 Grand Canal Square",
        companyCity: "Dublin",
        companyState: "Dublin",
        companyCountry: "Ireland",
        companyAbout:
            "Accenture provides technology, consulting, and professional services that help organizations build digital capabilities and improve business performance.",
        companyBio:
            "Consulting, technology services, cloud, cybersecurity, and digital transformation.",
        companyTotalEmployees: "700,000+",
    },

    {
        companyName: "Wipro",
        companyWebsite: "https://www.wipro.com",
        companyImage: "https://cdn.simpleicons.org/wipro",
        companyBackImage:
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
        companyAddress: "Doddakannelli",
        companyCity: "Bangalore",
        companyState: "Karnataka",
        companyCountry: "India",
        companyAbout:
            "Wipro is a global technology services company helping organizations solve complex business challenges through digital and engineering solutions.",
        companyBio:
            "IT services, consulting, engineering, cloud, and digital transformation.",
        companyTotalEmployees: "230,000+",
    },

    {
        companyName: "Zoho",
        companyWebsite: "https://www.zoho.com",
        companyImage: "https://cdn.simpleicons.org/zoho",
        companyBackImage:
            "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
        companyAddress: "Estancia IT Park",
        companyCity: "Chennai",
        companyState: "Tamil Nadu",
        companyCountry: "India",
        companyAbout:
            "Zoho builds a broad suite of business applications that help organizations manage sales, finance, marketing, collaboration, and operations.",
        companyBio:
            "Business software, SaaS, CRM, productivity, finance, and enterprise applications.",
        companyTotalEmployees: "15,000+",
    },

    {
        companyName: "Freshworks",
        companyWebsite: "https://www.freshworks.com",
        companyImage: "https://cdn.simpleicons.org/freshworks",
        companyBackImage:
            "https://images.unsplash.com/photo-1497366216548-37526070297c",
        companyAddress: "Global Infocity",
        companyCity: "Chennai",
        companyState: "Tamil Nadu",
        companyCountry: "India",
        companyAbout:
            "Freshworks develops cloud-based customer and employee experience software designed to help businesses deliver better service and productivity.",
        companyBio:
            "SaaS, customer experience, IT service management, and business software.",
        companyTotalEmployees: "5,000+",
    },

    {
        companyName: "Razorpay",
        companyWebsite: "https://razorpay.com",
        companyImage: "https://cdn.simpleicons.org/razorpay",
        companyBackImage:
            "https://images.unsplash.com/photo-1556761175-b413da4baf72",
        companyAddress: "SJR Cyber",
        companyCity: "Bangalore",
        companyState: "Karnataka",
        companyCountry: "India",
        companyAbout:
            "Razorpay builds financial technology products that help businesses accept payments, manage money, and automate financial operations.",
        companyBio:
            "Fintech, payments, banking infrastructure, and financial automation.",
        companyTotalEmployees: "5,000+",
    },

    {
        companyName: "Flipkart",
        companyWebsite: "https://www.flipkart.com",
        companyImage: "https://cdn.simpleicons.org/flipkart",
        companyBackImage:
            "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d",
        companyAddress: "Embassy Tech Village",
        companyCity: "Bangalore",
        companyState: "Karnataka",
        companyCountry: "India",
        companyAbout:
            "Flipkart is an Indian digital commerce company providing a wide range of products and services to customers across the country.",
        companyBio:
            "E-commerce, technology, logistics, payments, and digital commerce.",
        companyTotalEmployees: "30,000+",
    },

    {
        companyName: "Swiggy",
        companyWebsite: "https://www.swiggy.com",
        companyImage: "https://cdn.simpleicons.org/swiggy",
        companyBackImage:
            "https://images.unsplash.com/photo-1556761175-b413da4baf72",
        companyAddress: "Embassy Tech Village",
        companyCity: "Bangalore",
        companyState: "Karnataka",
        companyCountry: "India",
        companyAbout:
            "Swiggy is a technology platform connecting consumers with restaurants, stores, delivery partners, and a wide range of convenience services.",
        companyBio:
            "Food technology, delivery, e-commerce, logistics, and consumer technology.",
        companyTotalEmployees: "10,000+",
    },

    {
        companyName: "PhonePe",
        companyWebsite: "https://www.phonepe.com",
        companyImage: "https://cdn.simpleicons.org/phonepe",
        companyBackImage:
            "https://images.unsplash.com/photo-1556761175-b413da4baf72",
        companyAddress: "Vittal Mallya Road",
        companyCity: "Bangalore",
        companyState: "Karnataka",
        companyCountry: "India",
        companyAbout:
            "PhonePe is a digital payments and financial services platform providing payment, investment, insurance, and other financial products.",
        companyBio:
            "Digital payments, fintech, financial services, and consumer technology.",
        companyTotalEmployees: "30,000+",
    },

    {
        companyName: "Deloitte",
        companyWebsite: "https://www.deloitte.com",
        companyImage: "https://cdn.simpleicons.org/deloitte",
        companyBackImage:
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
        companyAddress: "Prestige Trade Tower",
        companyCity: "Bangalore",
        companyState: "Karnataka",
        companyCountry: "India",
        companyAbout:
            "Deloitte provides consulting, audit, tax, risk, technology, and professional services to organizations worldwide.",
        companyBio:
            "Consulting, technology, audit, risk management, and professional services.",
        companyTotalEmployees: "450,000+",
    },

    {
        companyName: "Cognizant",
        companyWebsite: "https://www.cognizant.com",
        companyImage: "https://cdn.simpleicons.org/cognizant",
        companyBackImage:
            "https://images.unsplash.com/photo-1497366216548-37526070297c",
        companyAddress: "Olympia Technology Park",
        companyCity: "Chennai",
        companyState: "Tamil Nadu",
        companyCountry: "India",
        companyAbout:
            "Cognizant provides technology and consulting services that help organizations modernize their businesses and adopt digital technologies.",
        companyBio:
            "IT services, consulting, digital transformation, cloud, and engineering.",
        companyTotalEmployees: "350,000+",
    },

    {
        companyName: "Atlassian",
        companyWebsite: "https://www.atlassian.com",
        companyImage: "https://cdn.simpleicons.org/atlassian",
        companyBackImage:
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
        companyAddress: "Level 6, 341 George Street",
        companyCity: "Sydney",
        companyState: "New South Wales",
        companyCountry: "Australia",
        companyAbout:
            "Atlassian develops collaboration and productivity software used by software development and business teams around the world.",
        companyBio:
            "Developer tools, collaboration, project management, and cloud software.",
        companyTotalEmployees: "12,000+",
    },

    {
        companyName: "Adobe",
        companyWebsite: "https://www.adobe.com",
        companyImage: "https://cdn.simpleicons.org/adobe",
        companyBackImage:
            "https://images.unsplash.com/photo-1497366216548-37526070297c",
        companyAddress: "345 Park Avenue",
        companyCity: "San Jose",
        companyState: "California",
        companyCountry: "United States",
        companyAbout:
            "Adobe creates creative, document, marketing, and digital experience software used by individuals and organizations worldwide.",
        companyBio:
            "Creative software, digital documents, marketing technology, and digital experiences.",
        companyTotalEmployees: "30,000+",
    },
];

/*
|--------------------------------------------------------------------------
| Seed companies
|--------------------------------------------------------------------------
*/

export async function seedCompanies(
    prisma: PrismaClient
) {
    console.log("🏢 Seeding companies...");

    /*
     * Recruiters occupy users 70-89.
     * Organizations occupy users 90-99.
     *
     * We use those users as company owners.
     */
    const companyOwners =
        await prisma.user.findMany({
            where: {
                role: {
                    in: [
                        "RECRUITER",
                        "ORGANIZATION",
                    ],
                },
            },
            orderBy: {
                id: "asc",
            },
            take: COMPANIES.length,
        });

    if (
        companyOwners.length <
        COMPANIES.length
    ) {
        throw new Error(
            `Not enough recruiter/organization users. Expected ${COMPANIES.length}, found ${companyOwners.length}.`
        );
    }

    for (
        let index = 0;
        index < COMPANIES.length;
        index++
    ) {
        const company =
            COMPANIES[index];

        const owner =
            companyOwners[index];

        const createdAt =
            randomPastDate(30, 600);

        await prisma.company.upsert({
            where: {
                companyName:
                    company.companyName,
            },

            update: {
                companyImage:
                    company.companyImage,

                companyBackImage:
                    company.companyBackImage,

                companyAddress:
                    company.companyAddress,

                companyCity:
                    company.companyCity,

                companyState:
                    company.companyState,

                companyCountry:
                    company.companyCountry,

                companyWebsite:
                    company.companyWebsite,

                companyAbout:
                    company.companyAbout,

                companyBio:
                    company.companyBio,

                companyTotalEmployees:
                    company.companyTotalEmployees,

                companyIsVerified:
                    true,

                userId:
                    owner.id,
            },

            create: {
                companyName:
                    company.companyName,

                companyImage:
                    company.companyImage,

                companyBackImage:
                    company.companyBackImage,

                companyAddress:
                    company.companyAddress,

                companyCity:
                    company.companyCity,

                companyState:
                    company.companyState,

                companyCountry:
                    company.companyCountry,

                companyWebsite:
                    company.companyWebsite,

                companyAbout:
                    company.companyAbout,

                companyBio:
                    company.companyBio,

                companyTotalEmployees:
                    company.companyTotalEmployees,

                companyIsVerified:
                    true,

                userId:
                    owner.id,

                createdAt,
            },
        });

        console.log(
            `   ✅ ${company.companyName} → ${owner.username}`
        );
    }

    console.log(
        `   ✅ Total companies: ${COMPANIES.length}`
    );
}