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
        image: "/avatars/user1.jpg",
        content:
            "I landed my dream job within two weeks. The platform made it incredibly easy to find relevant opportunities that matched my exact skill set.",
        rating: 5,
    },
    {
        id: 2,
        name: "Priya Sharma",
        role: "HR Manager",
        company: "InnovateX",
        image: "/avatars/user2.jpg",
        content:
            "Hiring has never been this efficient. We found top-quality candidates faster than any other platform we've used before.",
        rating: 5,
    },
    {
        id: 3,
        name: "Rahul Verma",
        role: "Backend Engineer",
        company: "CloudNet",
        image: "/avatars/user3.jpg",
        content:
            "The job recommendations were spot on. It saved me hours of searching and I received interview calls within days of signing up.",
        rating: 5,
    },
    {
        id: 4,
        name: "Sneha Iyer",
        role: "Product Designer",
        company: "DesignHub",
        image: "/avatars/user4.jpg",
        content:
            "The interface is clean and the filters are actually useful. Found a remote design role at a company I genuinely love.",
        rating: 5,
    },
    {
        id: 5,
        name: "Karan Mehta",
        role: "Talent Acquisition Lead",
        company: "ScaleUp",
        image: "/avatars/user5.jpg",
        content:
            "Reduced our time-to-hire by 40%. The candidate quality is consistently high and the messaging tools are seamless.",
        rating: 5,
    },
    {
        id: 6,
        name: "Ananya Nair",
        role: "Data Analyst",
        company: "InsightCo",
        image: "/avatars/user6.jpg",
        content:
            "As a fresher, I was worried about standing out. This platform gave me visibility I never had on other job boards.",
        rating: 5,
    },
];
