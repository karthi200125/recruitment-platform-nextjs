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
| 20 companies total.
|
| 10 companies -> recruiter users
| 10 companies -> organization users
|
| The company owner is assigned by the role of the user,
| not by hard-coded database IDs.
|
*/

const COMPANIES: SeedCompany[] = [
    /*
    |--------------------------------------------------------------------------
    | 1. Google
    |--------------------------------------------------------------------------
    */

    {
        companyName: "Google",
        companyWebsite:
            "https://www.google.com",

        companyImage:
            "https://res.cloudinary.com/duextvtta/image/upload/v1784774565/jobify/file_uwbzc7.webp",

        companyBackImage:
            "https://images.unsplash.com/photo-1573164713988-8665fc963095",

        companyAddress:
            "1600 Amphitheatre Parkway",

        companyCity:
            "Mountain View",

        companyState:
            "California",

        companyCountry:
            "United States",

        companyAbout:
            "Google is a global technology company building products and services that help billions of people access information, communicate, and work more effectively.",

        companyBio:
            "Technology, search, cloud, artificial intelligence, and digital products.",

        companyTotalEmployees:
            "100,000+",
    },

    /*
    |--------------------------------------------------------------------------
    | 2. Amazon
    |--------------------------------------------------------------------------
    */

    {
        companyName: "Amazon",
        companyWebsite:
            "https://www.amazon.com",

        companyImage:
            "https://res.cloudinary.com/duextvtta/image/upload/v1784264936/jobify/file_wqqert.webp",

        companyBackImage:
            "https://images.unsplash.com/photo-1586528116493-da8f8e5f7f8d",

        companyAddress:
            "410 Terry Avenue North",

        companyCity:
            "Seattle",

        companyState:
            "Washington",

        companyCountry:
            "United States",

        companyAbout:
            "Amazon is a global technology and commerce company focused on customer experience, cloud computing, digital services, logistics, and innovation.",

        companyBio:
            "E-commerce, cloud computing, logistics, digital services, and artificial intelligence.",

        companyTotalEmployees:
            "1,500,000+",
    },

    /*
    |--------------------------------------------------------------------------
    | 3. Microsoft
    |--------------------------------------------------------------------------
    */

    {
        companyName: "Microsoft",
        companyWebsite:
            "https://www.microsoft.com",

        companyImage:
            "https://res.cloudinary.com/duextvtta/image/upload/v1784264482/jobify/file_bwhipe.webp",

        companyBackImage:
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72",

        companyAddress:
            "One Microsoft Way",

        companyCity:
            "Redmond",

        companyState:
            "Washington",

        companyCountry:
            "United States",

        companyAbout:
            "Microsoft develops software, cloud services, productivity platforms, operating systems, and artificial intelligence technologies used by individuals and organizations worldwide.",

        companyBio:
            "Cloud computing, enterprise software, productivity, gaming, and AI.",

        companyTotalEmployees:
            "200,000+",
    },

    /*
    |--------------------------------------------------------------------------
    | 4. Apple
    |--------------------------------------------------------------------------
    */

    {
        companyName: "Apple",
        companyWebsite:
            "https://www.apple.com",

        companyImage:
            "https://res.cloudinary.com/duextvtta/image/upload/v1784264212/jobify/file_lmf6za.webp",

        companyBackImage:
            "https://images.unsplash.com/photo-1497366811353-6870744d04b2",

        companyAddress:
            "One Apple Park Way",

        companyCity:
            "Cupertino",

        companyState:
            "California",

        companyCountry:
            "United States",

        companyAbout:
            "Apple designs and develops consumer electronics, software, services, and digital experiences used by customers around the world.",

        companyBio:
            "Consumer technology, software, hardware, services, and digital products.",

        companyTotalEmployees:
            "160,000+",
    },

    /*
    |--------------------------------------------------------------------------
    | 5. Meta
    |--------------------------------------------------------------------------
    */

    {
        companyName: "Meta",
        companyWebsite:
            "https://www.meta.com",

        companyImage:
            "https://res.cloudinary.com/duextvtta/image/upload/v1784263690/jobify/file_b6o5nj.webp",

        companyBackImage:
            "https://images.unsplash.com/photo-1497366216548-37526070297c",

        companyAddress:
            "1 Hacker Way",

        companyCity:
            "Menlo Park",

        companyState:
            "California",

        companyCountry:
            "United States",

        companyAbout:
            "Meta builds technologies that help people connect, communicate, and create communities across social platforms and immersive digital experiences.",

        companyBio:
            "Social technology, artificial intelligence, virtual reality, and digital communities.",

        companyTotalEmployees:
            "70,000+",
    },

    /*
    |--------------------------------------------------------------------------
    | 6. NVIDIA
    |--------------------------------------------------------------------------
    */

    {
        companyName: "NVIDIA",
        companyWebsite:
            "https://www.nvidia.com",

        companyImage:
            "https://res.cloudinary.com/duextvtta/image/upload/v1784260630/jobify/file_qa9jrv.webp",

        companyBackImage:
            "https://images.unsplash.com/photo-1518770660439-4636190af475",

        companyAddress:
            "2788 San Tomas Expressway",

        companyCity:
            "Santa Clara",

        companyState:
            "California",

        companyCountry:
            "United States",

        companyAbout:
            "NVIDIA develops accelerated computing platforms, graphics technologies, and artificial intelligence solutions used across industries.",

        companyBio:
            "Artificial intelligence, GPUs, accelerated computing, and deep learning.",

        companyTotalEmployees:
            "30,000+",
    },

    /*
    |--------------------------------------------------------------------------
    | 7. Wipro
    |--------------------------------------------------------------------------
    */

    {
        companyName: "Wipro",
        companyWebsite:
            "https://www.wipro.com",

        companyImage:
            "https://res.cloudinary.com/duextvtta/image/upload/v1786634841/wipro_npmxa0.webp",

        companyBackImage:
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72",

        companyAddress:
            "Doddakannelli",

        companyCity:
            "Bangalore",

        companyState:
            "Karnataka",

        companyCountry:
            "India",

        companyAbout:
            "Wipro is a global technology services company helping organizations solve complex business challenges through digital and engineering solutions.",

        companyBio:
            "IT services, consulting, engineering, cloud, and digital transformation.",

        companyTotalEmployees:
            "230,000+",
    },

    /*
    |--------------------------------------------------------------------------
    | 8. Zoho
    |--------------------------------------------------------------------------
    */

    {
        companyName: "Zoho",
        companyWebsite:
            "https://www.zoho.com",

        companyImage:
            "https://res.cloudinary.com/duextvtta/image/upload/v1786634841/zoho_ja5fi3.webp",

        companyBackImage:
            "https://images.unsplash.com/photo-1497366811353-6870744d04b2",

        companyAddress:
            "Estancia IT Park",

        companyCity:
            "Chennai",

        companyState:
            "Tamil Nadu",

        companyCountry:
            "India",

        companyAbout:
            "Zoho builds a broad suite of business applications that help organizations manage sales, finance, marketing, collaboration, and operations.",

        companyBio:
            "Business software, SaaS, CRM, productivity, finance, and enterprise applications.",

        companyTotalEmployees:
            "15,000+",
    },

    /*
    |--------------------------------------------------------------------------
    | 9. TCS
    |--------------------------------------------------------------------------
    */

    {
        companyName:
            "Tata Consultancy Services",

        companyWebsite:
            "https://www.tcs.com",

        companyImage:
            "https://res.cloudinary.com/duextvtta/image/upload/v1786634841/tcs_tlnmoc.webp",

        companyBackImage:
            "https://images.unsplash.com/photo-1497366811353-6870744d04b2",

        companyAddress:
            "TCS House, Raveline Street",

        companyCity:
            "Mumbai",

        companyState:
            "Maharashtra",

        companyCountry:
            "India",

        companyAbout:
            "Tata Consultancy Services is a global IT services and consulting company helping organizations transform through technology and digital innovation.",

        companyBio:
            "IT services, consulting, cloud, digital transformation, and enterprise technology.",

        companyTotalEmployees:
            "600,000+",
    },

    /*
    |--------------------------------------------------------------------------
    | 10. Swiggy
    |--------------------------------------------------------------------------
    */

    {
        companyName: "Swiggy",
        companyWebsite:
            "https://www.swiggy.com",

        companyImage:
            "https://res.cloudinary.com/duextvtta/image/upload/v1786634840/swiggy_cdoeke.webp",

        companyBackImage:
            "https://images.unsplash.com/photo-1556761175-b413da4baf72",

        companyAddress:
            "Embassy Tech Village",

        companyCity:
            "Bangalore",

        companyState:
            "Karnataka",

        companyCountry:
            "India",

        companyAbout:
            "Swiggy is a technology platform connecting consumers with restaurants, stores, delivery partners, and a wide range of convenience services.",

        companyBio:
            "Food technology, delivery, e-commerce, logistics, and consumer technology.",

        companyTotalEmployees:
            "10,000+",
    },

    /*
    |--------------------------------------------------------------------------
    | 11. Cognizant
    |--------------------------------------------------------------------------
    */

    {
        companyName: "Cognizant",
        companyWebsite:
            "https://www.cognizant.com",

        companyImage:
            "https://res.cloudinary.com/duextvtta/image/upload/v1786634836/cognizant_zj4tzr.webp",

        companyBackImage:
            "https://images.unsplash.com/photo-1497366216548-37526070297c",

        companyAddress:
            "Olympia Technology Park",

        companyCity:
            "Chennai",

        companyState:
            "Tamil Nadu",

        companyCountry:
            "India",

        companyAbout:
            "Cognizant provides technology and consulting services that help organizations modernize their businesses and adopt digital technologies.",

        companyBio:
            "IT services, consulting, digital transformation, cloud, and engineering.",

        companyTotalEmployees:
            "350,000+",
    },

    /*
    |--------------------------------------------------------------------------
    | 12. Infosys
    |--------------------------------------------------------------------------
    */

    {
        companyName: "Infosys",
        companyWebsite:
            "https://www.infosys.com",

        companyImage:
            "https://res.cloudinary.com/duextvtta/image/upload/v1786634836/infoysys_mpwsks.webp",

        companyBackImage:
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72",

        companyAddress:
            "Electronics City",

        companyCity:
            "Bangalore",

        companyState:
            "Karnataka",

        companyCountry:
            "India",

        companyAbout:
            "Infosys provides digital services, consulting, and technology solutions to enterprises around the world.",

        companyBio:
            "Technology consulting, digital services, cloud, and enterprise solutions.",

        companyTotalEmployees:
            "300,000+",
    },

    /*
    |--------------------------------------------------------------------------
    | 13. PhonePe
    |--------------------------------------------------------------------------
    */

    {
        companyName: "PhonePe",
        companyWebsite:
            "https://www.phonepe.com",

        companyImage:
            "https://res.cloudinary.com/duextvtta/image/upload/v1786634837/phonepe_anlgwa.webp",

        companyBackImage:
            "https://images.unsplash.com/photo-1556761175-b413da4baf72",

        companyAddress:
            "Vittal Mallya Road",

        companyCity:
            "Bangalore",

        companyState:
            "Karnataka",

        companyCountry:
            "India",

        companyAbout:
            "PhonePe is a digital payments and financial services platform providing payment, investment, insurance, and other financial products.",

        companyBio:
            "Digital payments, fintech, financial services, and consumer technology.",

        companyTotalEmployees:
            "30,000+",
    },

    /*
    |--------------------------------------------------------------------------
    | 14. Freshworks
    |--------------------------------------------------------------------------
    */

    {
        companyName: "Freshworks",
        companyWebsite:
            "https://www.freshworks.com",

        companyImage:
            "https://res.cloudinary.com/duextvtta/image/upload/v1786634836/freshworks_maocz5.webp",

        companyBackImage:
            "https://images.unsplash.com/photo-1497366216548-37526070297c",

        companyAddress:
            "Global Infocity",

        companyCity:
            "Chennai",

        companyState:
            "Tamil Nadu",

        companyCountry:
            "India",

        companyAbout:
            "Freshworks develops cloud-based customer and employee experience software designed to help businesses deliver better service and productivity.",

        companyBio:
            "SaaS, customer experience, IT service management, and business software.",

        companyTotalEmployees:
            "5,000+",
    },

    /*
    |--------------------------------------------------------------------------
    | 15. Razorpay
    |--------------------------------------------------------------------------
    */

    {
        companyName: "Razorpay",
        companyWebsite:
            "https://razorpay.com",

        companyImage:
            "https://res.cloudinary.com/duextvtta/image/upload/v1786635056/rozrapay_c0ltvi.webp",

        companyBackImage:
            "https://images.unsplash.com/photo-1556761175-b413da4baf72",

        companyAddress:
            "SJR Cyber",

        companyCity:
            "Bangalore",

        companyState:
            "Karnataka",

        companyCountry:
            "India",

        companyAbout:
            "Razorpay builds financial technology products that help businesses accept payments, manage money, and automate financial operations.",

        companyBio:
            "Fintech, payments, banking infrastructure, and financial automation.",

        companyTotalEmployees:
            "5,000+",
    },

    /*
    |--------------------------------------------------------------------------
    | 16. Adobe
    |--------------------------------------------------------------------------
    */

    {
        companyName: "Adobe",
        companyWebsite:
            "https://www.adobe.com",

        companyImage:
            "https://res.cloudinary.com/duextvtta/image/upload/v1786634836/adobe_sysc4y.webp",

        companyBackImage:
            "https://images.unsplash.com/photo-1497366216548-37526070297c",

        companyAddress:
            "345 Park Avenue",

        companyCity:
            "San Jose",

        companyState:
            "California",

        companyCountry:
            "United States",

        companyAbout:
            "Adobe creates creative, document, marketing, and digital experience software used by individuals and organizations worldwide.",

        companyBio:
            "Creative software, digital documents, marketing technology, and digital experiences.",

        companyTotalEmployees:
            "30,000+",
    },

    /*
    |--------------------------------------------------------------------------
    | 17. Accenture
    |--------------------------------------------------------------------------
    */

    {
        companyName: "Accenture",
        companyWebsite:
            "https://www.accenture.com",

        companyImage:
            "https://res.cloudinary.com/duextvtta/image/upload/v1786634836/accenture_cqupzq.webp",

        companyBackImage:
            "https://images.unsplash.com/photo-1497366216548-37526070297c",

        companyAddress:
            "1 Grand Canal Square",

        companyCity:
            "Dublin",

        companyState:
            "Dublin",

        companyCountry:
            "Ireland",

        companyAbout:
            "Accenture provides technology, consulting, and professional services that help organizations build digital capabilities and improve business performance.",

        companyBio:
            "Consulting, technology services, cloud, cybersecurity, and digital transformation.",

        companyTotalEmployees:
            "700,000+",
    },

    /*
    |--------------------------------------------------------------------------
    | 18. Deloitte
    |--------------------------------------------------------------------------
    */

    {
        companyName: "Deloitte",
        companyWebsite:
            "https://www.deloitte.com",

        companyImage:
            "https://res.cloudinary.com/duextvtta/image/upload/v1786634836/deloite_dacvws.webp",

        companyBackImage:
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72",

        companyAddress:
            "Prestige Trade Tower",

        companyCity:
            "Bangalore",

        companyState:
            "Karnataka",

        companyCountry:
            "India",

        companyAbout:
            "Deloitte provides consulting, audit, tax, risk, technology, and professional services to organizations worldwide.",

        companyBio:
            "Consulting, technology, audit, risk management, and professional services.",

        companyTotalEmployees:
            "450,000+",
    },

    /*
    |--------------------------------------------------------------------------
    | 19. Atlassian
    |--------------------------------------------------------------------------
    */

    {
        companyName: "Atlassian",
        companyWebsite:
            "https://www.atlassian.com",

        companyImage:
            "https://res.cloudinary.com/duextvtta/image/upload/v1786634836/atlassian_l1dhbb.webp",

        companyBackImage:
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72",

        companyAddress:
            "Level 6, 341 George Street",

        companyCity:
            "Sydney",

        companyState:
            "New South Wales",

        companyCountry:
            "Australia",

        companyAbout:
            "Atlassian develops collaboration and productivity software used by software development and business teams around the world.",

        companyBio:
            "Developer tools, collaboration, project management, and cloud software.",

        companyTotalEmployees:
            "12,000+",
    },

    /*
    |--------------------------------------------------------------------------
    | 20. Flipkart
    |--------------------------------------------------------------------------
    */

    {
        companyName: "Flipkart",
        companyWebsite:
            "https://www.flipkart.com",

        companyImage:
            "https://res.cloudinary.com/duextvtta/image/upload/v1786634836/flipkart_zqvnxy.webp",

        companyBackImage:
            "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d",

        companyAddress:
            "Embassy Tech Village",

        companyCity:
            "Bangalore",

        companyState:
            "Karnataka",

        companyCountry:
            "India",

        companyAbout:
            "Flipkart is an Indian digital commerce company providing a wide range of products and services to customers across the country.",

        companyBio:
            "E-commerce, technology, logistics, payments, and digital commerce.",

        companyTotalEmployees:
            "30,000+",
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
    |--------------------------------------------------------------------------
    | Validate company count
    |--------------------------------------------------------------------------
    */

    if (COMPANIES.length !== 20) {
        throw new Error(
            `Expected exactly 20 companies, got ${COMPANIES.length}.`
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Get recruiters
    |--------------------------------------------------------------------------
    |
    | Fresh users.ts creates exactly 20 recruiters.
    |
    */

    const recruiters =
        await prisma.user.findMany({
            where: {
                role: "RECRUITER",
            },

            orderBy: {
                id: "asc",
            },

            take: 10,

            select: {
                id: true,
                username: true,
                email: true,
                role: true,
            },
        });

    /*
    |--------------------------------------------------------------------------
    | Get organizations
    |--------------------------------------------------------------------------
    |
    | Fresh users.ts creates exactly 10 organizations.
    |
    */

    const organizations =
        await prisma.user.findMany({
            where: {
                role: "ORGANIZATION",
            },

            orderBy: {
                id: "asc",
            },

            take: 10,

            select: {
                id: true,
                username: true,
                email: true,
                role: true,
            },
        });

    /*
    |--------------------------------------------------------------------------
    | Validate owners
    |--------------------------------------------------------------------------
    */

    if (recruiters.length < 10) {
        throw new Error(
            `Not enough recruiter users. Expected at least 10, found ${recruiters.length}.`
        );
    }

    if (organizations.length < 10) {
        throw new Error(
            `Not enough organization users. Expected at least 10, found ${organizations.length}.`
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Combine owners
    |--------------------------------------------------------------------------
    |
    | Companies 1-10  -> Recruiters
    | Companies 11-20 -> Organizations
    |
    */

    const companyOwners = [
        ...recruiters,
        ...organizations,
    ];

    /*
    |--------------------------------------------------------------------------
    | Create / update companies
    |--------------------------------------------------------------------------
    */

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

            /*
            |--------------------------------------------------------------------------
            | Update
            |--------------------------------------------------------------------------
            |
            | Important:
            | Rerunning the seed updates the image,
            | owner, website, etc.
            |
            */

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

            /*
            |--------------------------------------------------------------------------
            | Create
            |--------------------------------------------------------------------------
            */

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
            `   ✅ ${company.companyName} → ${owner.username} (${owner.role})`
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Final validation
    |--------------------------------------------------------------------------
    */

    const companyCount =
        await prisma.company.count();

    console.log(
        `   🏢 Total companies in database: ${companyCount}`
    );

    console.log(
        "   ✅ Company seeding completed successfully."
    );
}