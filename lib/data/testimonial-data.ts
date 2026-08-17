type Testimonial = {
    id: number;
    name: string;
    role: string;
    company: string;
    image: string;
    content: string;
    rating: number;
};

export const testimonialsdata: Testimonial[] = [
    {
        id: 1,
        name: "Arjun Kumar",
        role: "Frontend Developer",
        company: "TechCorp",
        image: "/avatars/user1.webp",
        content:
            "I landed my dream job within two weeks. The platform made it incredibly easy to find relevant opportunities that matched my exact skill set.",
        rating: 5,
    },
    {
        id: 2,
        name: "Priya Sharma",
        role: "HR Manager",
        company: "InnovateX",
        image: "/avatars/user2.webp",
        content:
            "Hiring has never been this efficient. We found top-quality candidates faster than any other platform we've used before.",
        rating: 5,
    },
    {
        id: 3,
        name: "Rahul Verma",
        role: "Backend Engineer",
        company: "CloudNet",
        image: "/avatars/user3.webp",
        content:
            "The job recommendations were spot on. It saved me hours of searching and I received interview calls within days of signing up.",
        rating: 5,
    },
    {
        id: 4,
        name: "Sneha Iyer",
        role: "Product Designer",
        company: "DesignHub",
        image: "/avatars/user4.webp",
        content:
            "The interface is clean and the filters are actually useful. Found a remote design role at a company I genuinely love.",
        rating: 5,
    },
    {
        id: 5,
        name: "Karan Mehta",
        role: "Talent Acquisition Lead",
        company: "ScaleUp",
        image: "/avatars/user1.webp",
        content:
            "Reduced our time-to-hire by 40%. The candidate quality is consistently high and the messaging tools are seamless.",
        rating: 5,
    },    
];
