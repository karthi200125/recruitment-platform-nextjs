import { PrismaClient, Role } from "@prisma/client";

import {
    hashPassword,
    randomBoolean,
    randomItem,
    randomItems,
    randomPastDate,
    seedEmail,
    seedUsername,
} from "../utils";

interface SeedUser {
    firstName: string;
    lastName: string;
    gender: string;
    profession: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    address: string;
    skills: string[];
}

const PASSWORD = "Jobify@123";

/*
|--------------------------------------------------------------------------
| Candidate data
|--------------------------------------------------------------------------
*/

const CANDIDATES: SeedUser[] = [
    {
        firstName: "Aarav",
        lastName: "Sharma",
        gender: "Male",
        profession: "Full Stack Developer",
        city: "Bangalore",
        state: "Karnataka",
        country: "India",
        postalCode: "560001",
        address: "Indiranagar",
        skills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
    },
    {
        firstName: "Ananya",
        lastName: "Iyer",
        gender: "Female",
        profession: "Frontend Developer",
        city: "Chennai",
        state: "Tamil Nadu",
        country: "India",
        postalCode: "600001",
        address: "Anna Nagar",
        skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    },
    {
        firstName: "Arjun",
        lastName: "Reddy",
        gender: "Male",
        profession: "Backend Developer",
        city: "Hyderabad",
        state: "Telangana",
        country: "India",
        postalCode: "500001",
        address: "Hitech City",
        skills: ["Java", "Spring Boot", "PostgreSQL", "Redis"],
    },
    {
        firstName: "Diya",
        lastName: "Nair",
        gender: "Female",
        profession: "UI/UX Designer",
        city: "Kochi",
        state: "Kerala",
        country: "India",
        postalCode: "682001",
        address: "Kakkanad",
        skills: ["Figma", "UI Design", "UX Research", "Prototyping"],
    },
    {
        firstName: "Vikram",
        lastName: "Patel",
        gender: "Male",
        profession: "Software Engineer",
        city: "Pune",
        state: "Maharashtra",
        country: "India",
        postalCode: "411001",
        address: "Kothrud",
        skills: ["Java", "Spring Boot", "AWS", "Docker"],
    },
    {
        firstName: "Meera",
        lastName: "Krishnan",
        gender: "Female",
        profession: "Data Analyst",
        city: "Bangalore",
        state: "Karnataka",
        country: "India",
        postalCode: "560034",
        address: "Koramangala",
        skills: ["Python", "SQL", "Power BI", "Excel"],
    },
    {
        firstName: "Rohan",
        lastName: "Mehta",
        gender: "Male",
        profession: "DevOps Engineer",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        postalCode: "400001",
        address: "Andheri",
        skills: ["AWS", "Docker", "Kubernetes", "Terraform"],
    },
    {
        firstName: "Ishita",
        lastName: "Gupta",
        gender: "Female",
        profession: "Product Designer",
        city: "Delhi",
        state: "Delhi",
        country: "India",
        postalCode: "110001",
        address: "Saket",
        skills: ["Figma", "Design Systems", "UX", "Prototyping"],
    },
    {
        firstName: "Karthik",
        lastName: "Rao",
        gender: "Male",
        profession: "Mobile Developer",
        city: "Bangalore",
        state: "Karnataka",
        country: "India",
        postalCode: "560038",
        address: "Ulsoor",
        skills: ["React Native", "Flutter", "Firebase", "TypeScript"],
    },
    {
        firstName: "Priya",
        lastName: "Menon",
        gender: "Female",
        profession: "QA Engineer",
        city: "Chennai",
        state: "Tamil Nadu",
        country: "India",
        postalCode: "600040",
        address: "Velachery",
        skills: ["Selenium", "Playwright", "Java", "API Testing"],
    },
    {
        firstName: "Aditya",
        lastName: "Verma",
        gender: "Male",
        profession: "Machine Learning Engineer",
        city: "Pune",
        state: "Maharashtra",
        country: "India",
        postalCode: "411038",
        address: "Baner",
        skills: ["Python", "TensorFlow", "PyTorch", "Machine Learning"],
    },
    {
        firstName: "Sneha",
        lastName: "Joshi",
        gender: "Female",
        profession: "Business Analyst",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        postalCode: "400053",
        address: "Powai",
        skills: ["SQL", "Power BI", "Business Analysis", "Excel"],
    },
    {
        firstName: "Rahul",
        lastName: "Krishnan",
        gender: "Male",
        profession: "Cloud Engineer",
        city: "Hyderabad",
        state: "Telangana",
        country: "India",
        postalCode: "500081",
        address: "Madhapur",
        skills: ["AWS", "Azure", "Terraform", "Docker"],
    },
    {
        firstName: "Nisha",
        lastName: "Kapoor",
        gender: "Female",
        profession: "Marketing Specialist",
        city: "Delhi",
        state: "Delhi",
        country: "India",
        postalCode: "110017",
        address: "Hauz Khas",
        skills: ["SEO", "Content Marketing", "Google Ads", "Analytics"],
    },
    {
        firstName: "Sanjay",
        lastName: "Kumar",
        gender: "Male",
        profession: "Java Developer",
        city: "Coimbatore",
        state: "Tamil Nadu",
        country: "India",
        postalCode: "641001",
        address: "RS Puram",
        skills: ["Java", "Spring Boot", "MySQL", "REST API"],
    },
    {
        firstName: "Aishwarya",
        lastName: "Raman",
        gender: "Female",
        profession: "Content Strategist",
        city: "Bangalore",
        state: "Karnataka",
        country: "India",
        postalCode: "560025",
        address: "Richmond Town",
        skills: ["Content Strategy", "SEO", "Copywriting", "Analytics"],
    },
    {
        firstName: "Manish",
        lastName: "Singh",
        gender: "Male",
        profession: "Cybersecurity Analyst",
        city: "Gurugram",
        state: "Haryana",
        country: "India",
        postalCode: "122001",
        address: "Sector 44",
        skills: ["Cybersecurity", "SIEM", "Network Security", "Linux"],
    },
    {
        firstName: "Pooja",
        lastName: "Shah",
        gender: "Female",
        profession: "HR Specialist",
        city: "Ahmedabad",
        state: "Gujarat",
        country: "India",
        postalCode: "380001",
        address: "Navrangpura",
        skills: ["Recruitment", "HR", "Talent Acquisition", "Employee Relations"],
    },
    {
        firstName: "Naveen",
        lastName: "Bhat",
        gender: "Male",
        profession: "React Developer",
        city: "Mangalore",
        state: "Karnataka",
        country: "India",
        postalCode: "575001",
        address: "Kadri",
        skills: ["React", "JavaScript", "Redux", "CSS"],
    },
    {
        firstName: "Divya",
        lastName: "Srinivasan",
        gender: "Female",
        profession: "Software Engineer",
        city: "Chennai",
        state: "Tamil Nadu",
        country: "India",
        postalCode: "600018",
        address: "T Nagar",
        skills: ["C#", ".NET", "SQL Server", "Azure"],
    },
];

/*
|--------------------------------------------------------------------------
| Additional candidate names
|--------------------------------------------------------------------------
|
| These are expanded automatically into realistic users using the
| profession/location pools below.
|
*/

const MORE_CANDIDATE_NAMES: Array<
    [string, string, string]
> = [
    ["Harish", "Kumar", "Male"],
    ["Neha", "Agarwal", "Female"],
    ["Siddharth", "Jain", "Male"],
    ["Kavya", "Nair", "Female"],
    ["Akash", "Mishra", "Male"],
    ["Riya", "Chopra", "Female"],
    ["Varun", "Das", "Male"],
    ["Swetha", "Rao", "Female"],
    ["Abhishek", "Yadav", "Male"],
    ["Keerthi", "Reddy", "Female"],
    ["Mohit", "Malhotra", "Male"],
    ["Sahana", "Shetty", "Female"],
    ["Deepak", "Iyer", "Male"],
    ["Tanvi", "Desai", "Female"],
    ["Nikhil", "Thomas", "Male"],
    ["Lakshmi", "Pillai", "Female"],
    ["Ritesh", "Sharma", "Male"],
    ["Pavithra", "Kumar", "Female"],
    ["Gaurav", "Bansal", "Male"],
    ["Shreya", "Gupta", "Female"],
    ["Yash", "Patel", "Male"],
    ["Harini", "Krishnan", "Female"],
    ["Abhinav", "Rao", "Male"],
    ["Swati", "Mehta", "Female"],
    ["Tarun", "Reddy", "Male"],
    ["Anjali", "Menon", "Female"],
    ["Pranav", "Nair", "Male"],
    ["Reshma", "Joseph", "Female"],
    ["Suresh", "Babu", "Male"],
    ["Madhuri", "Sharma", "Female"],
    ["Rakesh", "Gupta", "Male"],
    ["Shalini", "Rao", "Female"],
    ["Aravind", "Mohan", "Male"],
    ["Bhavana", "Iyer", "Female"],
    ["Vivek", "Nair", "Male"],
    ["Amritha", "Menon", "Female"],
    ["Rajat", "Kapoor", "Male"],
    ["Pallavi", "Shah", "Female"],
    ["Lokesh", "Reddy", "Male"],
    ["Shruti", "Joshi", "Female"],
    ["Ajay", "Kumar", "Male"],
    ["Anusha", "Raman", "Female"],
    ["Ravi", "Shankar", "Male"],
    ["Monika", "Verma", "Female"],
    ["Ashwin", "Krishnan", "Male"],
    ["Deepa", "Nair", "Female"],
    ["Kiran", "Patel", "Male"],
    ["Namrata", "Singh", "Female"],
    ["Vishal", "Mehta", "Male"],
    ["Pooja", "Raman", "Female"],
];

/*
|--------------------------------------------------------------------------
| Candidate pools
|--------------------------------------------------------------------------
*/

const PROFESSIONS = [
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "Software Engineer",
    "React Developer",
    "Next.js Developer",
    "Java Developer",
    "Python Developer",
    "DevOps Engineer",
    "Cloud Engineer",
    "Data Analyst",
    "QA Engineer",
    "Mobile Developer",
    "UI/UX Designer",
    "Product Designer",
    "Business Analyst",
    "Machine Learning Engineer",
    "Cybersecurity Analyst",
];

const LOCATIONS = [
    {
        city: "Bangalore",
        state: "Karnataka",
        postalCode: "560001",
        address: "Koramangala",
    },
    {
        city: "Chennai",
        state: "Tamil Nadu",
        postalCode: "600001",
        address: "Anna Nagar",
    },
    {
        city: "Hyderabad",
        state: "Telangana",
        postalCode: "500001",
        address: "Hitech City",
    },
    {
        city: "Pune",
        state: "Maharashtra",
        postalCode: "411001",
        address: "Baner",
    },
    {
        city: "Mumbai",
        state: "Maharashtra",
        postalCode: "400001",
        address: "Andheri",
    },
    {
        city: "Delhi",
        state: "Delhi",
        postalCode: "110001",
        address: "Saket",
    },
    {
        city: "Gurugram",
        state: "Haryana",
        postalCode: "122001",
        address: "Sector 44",
    },
    {
        city: "Coimbatore",
        state: "Tamil Nadu",
        postalCode: "641001",
        address: "RS Puram",
    },
    {
        city: "Kochi",
        state: "Kerala",
        postalCode: "682001",
        address: "Kakkanad",
    },
    {
        city: "Ahmedabad",
        state: "Gujarat",
        postalCode: "380001",
        address: "Navrangpura",
    },
];

const SKILLS = [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Express",
    "Java",
    "Spring Boot",
    "Python",
    "Django",
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Redis",
    "AWS",
    "Azure",
    "Docker",
    "Kubernetes",
    "Git",
    "REST API",
    "GraphQL",
    "Tailwind CSS",
    "Figma",
    "Selenium",
    "Playwright",
    "Power BI",
    "SQL",
    "Machine Learning",
];

/*
|--------------------------------------------------------------------------
| Recruiters
|--------------------------------------------------------------------------
*/

const RECRUITERS: SeedUser[] = [
    {
        firstName: "Rahul",
        lastName: "Mehra",
        gender: "Male",
        profession: "Senior Technical Recruiter",
        city: "Bangalore",
        state: "Karnataka",
        country: "India",
        postalCode: "560001",
        address: "Whitefield",
        skills: ["Talent Acquisition", "Technical Recruiting", "Hiring"],
    },
    {
        firstName: "Priyanka",
        lastName: "Sharma",
        gender: "Female",
        profession: "Talent Acquisition Manager",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        postalCode: "400001",
        address: "Bandra",
        skills: ["Recruitment", "Talent Acquisition", "HR"],
    },
    {
        firstName: "Arvind",
        lastName: "Menon",
        gender: "Male",
        profession: "Recruitment Lead",
        city: "Chennai",
        state: "Tamil Nadu",
        country: "India",
        postalCode: "600001",
        address: "OMR",
        skills: ["Recruitment", "Hiring", "Employer Branding"],
    },
    {
        firstName: "Sneha",
        lastName: "Kapoor",
        gender: "Female",
        profession: "Senior Recruiter",
        city: "Gurugram",
        state: "Haryana",
        country: "India",
        postalCode: "122001",
        address: "Golf Course Road",
        skills: ["Recruitment", "Sourcing", "Interviewing"],
    },
    {
        firstName: "Vivek",
        lastName: "Rao",
        gender: "Male",
        profession: "Technical Recruiter",
        city: "Hyderabad",
        state: "Telangana",
        country: "India",
        postalCode: "500081",
        address: "Madhapur",
        skills: ["Technical Recruiting", "Sourcing", "LinkedIn Recruiting"],
    },
    {
        firstName: "Neha",
        lastName: "Verma",
        gender: "Female",
        profession: "HR Business Partner",
        city: "Pune",
        state: "Maharashtra",
        country: "India",
        postalCode: "411001",
        address: "Hinjewadi",
        skills: ["HR", "Recruitment", "Employee Relations"],
    },
    {
        firstName: "Rohit",
        lastName: "Shah",
        gender: "Male",
        profession: "Talent Partner",
        city: "Ahmedabad",
        state: "Gujarat",
        country: "India",
        postalCode: "380001",
        address: "SG Highway",
        skills: ["Talent Acquisition", "Recruitment", "Hiring"],
    },
    {
        firstName: "Kavitha",
        lastName: "Iyer",
        gender: "Female",
        profession: "Recruitment Manager",
        city: "Bangalore",
        state: "Karnataka",
        country: "India",
        postalCode: "560034",
        address: "Koramangala",
        skills: ["Recruitment", "Leadership", "Talent Management"],
    },
    {
        firstName: "Sandeep",
        lastName: "Joshi",
        gender: "Male",
        profession: "Technical Hiring Manager",
        city: "Delhi",
        state: "Delhi",
        country: "India",
        postalCode: "110001",
        address: "Connaught Place",
        skills: ["Technical Hiring", "Recruitment", "Engineering"],
    },
    {
        firstName: "Divya",
        lastName: "Nair",
        gender: "Female",
        profession: "Talent Acquisition Specialist",
        city: "Kochi",
        state: "Kerala",
        country: "India",
        postalCode: "682001",
        address: "Kakkanad",
        skills: ["Recruitment", "Sourcing", "Talent Acquisition"],
    },
];

/*
|--------------------------------------------------------------------------
| Additional recruiter names
|--------------------------------------------------------------------------
*/

const MORE_RECRUITER_NAMES: Array<
    [string, string, string]
> = [
    ["Amit", "Khanna", "Male"],
    ["Shreya", "Reddy", "Female"],
    ["Karan", "Malhotra", "Male"],
    ["Nandini", "Rao", "Female"],
    ["Manoj", "Kumar", "Male"],
    ["Swathi", "Menon", "Female"],
    ["Vikash", "Gupta", "Male"],
    ["Ritika", "Sharma", "Female"],
    ["Ashok", "Patel", "Male"],
    ["Megha", "Joshi", "Female"],
];

/*
|--------------------------------------------------------------------------
| Organization users
|--------------------------------------------------------------------------
*/

const ORGANIZATIONS: SeedUser[] = [
    {
        firstName: "Rajiv",
        lastName: "Malhotra",
        gender: "Male",
        profession: "Founder & CEO",
        city: "Bangalore",
        state: "Karnataka",
        country: "India",
        postalCode: "560001",
        address: "Whitefield",
        skills: ["Leadership", "Strategy", "Hiring"],
    },
    {
        firstName: "Kavita",
        lastName: "Sharma",
        gender: "Female",
        profession: "Chief People Officer",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        postalCode: "400001",
        address: "Bandra",
        skills: ["Leadership", "HR", "Talent Management"],
    },
    {
        firstName: "Ramesh",
        lastName: "Iyer",
        gender: "Male",
        profession: "Co-Founder",
        city: "Chennai",
        state: "Tamil Nadu",
        country: "India",
        postalCode: "600001",
        address: "OMR",
        skills: ["Business Strategy", "Leadership", "Hiring"],
    },
    {
        firstName: "Anita",
        lastName: "Kapoor",
        gender: "Female",
        profession: "People Operations Director",
        city: "Gurugram",
        state: "Haryana",
        country: "India",
        postalCode: "122001",
        address: "Golf Course Road",
        skills: ["People Operations", "HR", "Leadership"],
    },
    {
        firstName: "Vijay",
        lastName: "Reddy",
        gender: "Male",
        profession: "Founder",
        city: "Hyderabad",
        state: "Telangana",
        country: "India",
        postalCode: "500081",
        address: "Hitech City",
        skills: ["Entrepreneurship", "Strategy", "Leadership"],
    },
];

/*
|--------------------------------------------------------------------------
| Additional organization names
|--------------------------------------------------------------------------
*/

const MORE_ORGANIZATION_NAMES: Array<
    [string, string, string]
> = [
    ["Suresh", "Mehta", "Male"],
    ["Padmini", "Rao", "Female"],
    ["Nitin", "Shah", "Male"],
    ["Sweta", "Patel", "Female"],
    ["Akhil", "Menon", "Male"],
];

/*
|--------------------------------------------------------------------------
| Build generated users
|--------------------------------------------------------------------------
*/

function buildGeneratedUsers(): SeedUser[] {
    const generatedCandidates: SeedUser[] =
        MORE_CANDIDATE_NAMES.map(
            ([firstName, lastName, gender]) => {
                const location =
                    randomItem(LOCATIONS);

                return {
                    firstName,
                    lastName,
                    gender,
                    profession:
                        randomItem(PROFESSIONS),
                    city: location.city,
                    state: location.state,
                    country: "India",
                    postalCode:
                        location.postalCode,
                    address: location.address,
                    skills: randomItems(
                        SKILLS,
                        4
                    ),
                };
            }
        );

    const generatedRecruiters: SeedUser[] =
        MORE_RECRUITER_NAMES.map(
            ([firstName, lastName, gender]) => {
                const location =
                    randomItem(LOCATIONS);

                return {
                    firstName,
                    lastName,
                    gender,
                    profession:
                        randomItem([
                            "Technical Recruiter",
                            "Senior Recruiter",
                            "Talent Acquisition Manager",
                            "Recruitment Lead",
                            "HR Business Partner",
                        ]),
                    city: location.city,
                    state: location.state,
                    country: "India",
                    postalCode:
                        location.postalCode,
                    address: location.address,
                    skills: randomItems(
                        [
                            "Recruitment",
                            "Talent Acquisition",
                            "Technical Recruiting",
                            "Hiring",
                            "Sourcing",
                            "HR",
                        ],
                        3
                    ),
                };
            }
        );

    const generatedOrganizations: SeedUser[] =
        MORE_ORGANIZATION_NAMES.map(
            ([firstName, lastName, gender]) => {
                const location =
                    randomItem(LOCATIONS);

                return {
                    firstName,
                    lastName,
                    gender,
                    profession:
                        randomItem([
                            "Founder & CEO",
                            "Co-Founder",
                            "People Operations Director",
                            "Chief People Officer",
                        ]),
                    city: location.city,
                    state: location.state,
                    country: "India",
                    postalCode:
                        location.postalCode,
                    address: location.address,
                    skills: randomItems(
                        [
                            "Leadership",
                            "Strategy",
                            "Hiring",
                            "People Operations",
                            "Talent Management",
                            "Business Strategy",
                        ],
                        3
                    ),
                };
            }
        );

    return [
        ...CANDIDATES,
        ...generatedCandidates,
        ...RECRUITERS,
        ...generatedRecruiters,
        ...ORGANIZATIONS,
        ...generatedOrganizations,
    ];
}

/*
|--------------------------------------------------------------------------
| Seed users
|--------------------------------------------------------------------------
*/

export async function seedUsers(
    prisma: PrismaClient
) {
    console.log("👤 Seeding users...");

    const passwordHash =
        await hashPassword(PASSWORD);

    const users = buildGeneratedUsers();

    /*
     * Expected:
     *
     * 70 candidates
     * 20 recruiters
     * 10 organizations
     *
     * Total = 100 users
     */

    if (users.length !== 100) {
        throw new Error(
            `Expected 100 users, got ${users.length}.`
        );
    }

    let candidateCount = 0;
    let recruiterCount = 0;
    let organizationCount = 0;

    for (
        let index = 0;
        index < users.length;
        index++
    ) {
        const data = users[index];

        let role: Role;

        if (index < 70) {
            role = Role.CANDIDATE;
            candidateCount++;
        } else if (index < 90) {
            role = Role.RECRUITER;
            recruiterCount++;
        } else {
            role = Role.ORGANIZATION;
            organizationCount++;
        }

        const username =
            seedUsername(
                data.firstName,
                data.lastName,
                index + 1
            );

        const email =
            seedEmail(username);

        const profileImage =
            `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                `${data.firstName} ${data.lastName}`
            )}`;

        const createdAt =
            randomPastDate(30, 720);

        await prisma.user.upsert({
            where: {
                email,
            },

            update: {
                username,
                role,
                firstName:
                    data.firstName,
                lastName:
                    data.lastName,
                gender:
                    data.gender,
                profession:
                    data.profession,
                city:
                    data.city,
                state:
                    data.state,
                country:
                    data.country,
                postalCode:
                    data.postalCode,
                address:
                    data.address,
                skills:
                    data.skills,
                profileImage,
                userImage:
                    profileImage,
                isPro:
                    role === Role.CANDIDATE
                        ? randomBoolean(0.15)
                        : randomBoolean(0.65),
            },

            create: {
                username,
                email,
                password:
                    passwordHash,

                authProvider:
                    "credentials",

                role,

                isPro:
                    role === Role.CANDIDATE
                        ? randomBoolean(0.15)
                        : randomBoolean(0.65),

                firstName:
                    data.firstName,

                lastName:
                    data.lastName,

                gender:
                    data.gender,

                phoneNo:
                    `+91${9000000000 + index}`,

                userBio:
                    `${data.profession} based in ${data.city}, ${data.state}. Open to new opportunities and professional connections.`,

                profession:
                    data.profession,

                website:
                    `https://jobify-demo.com/users/${username}`,

                address:
                    data.address,

                city:
                    data.city,

                state:
                    data.state,

                country:
                    data.country,

                postalCode:
                    data.postalCode,

                userImage:
                    profileImage,

                profileImage,

                skills:
                    data.skills,

                createdAt,
            },
        });
    }

    console.log(
        `   ✅ Candidates: ${candidateCount}`
    );

    console.log(
        `   ✅ Recruiters: ${recruiterCount}`
    );

    console.log(
        `   ✅ Organizations: ${organizationCount}`
    );

    console.log(
        `   🔐 Demo password: ${PASSWORD}`
    );

    console.log(
        "   ✅ Total users: 100"
    );
}