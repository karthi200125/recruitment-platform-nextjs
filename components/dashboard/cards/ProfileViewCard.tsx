import Image from "next/image";
import Link from "next/link";

type ProfileView = {
    id: number;
    company: string;
    role: string;
    viewedAt: string;
    logo: string;
};

const profileViews: ProfileView[] = [
    {
        id: 1,
        company: "Tech Solutions Inc.",
        role: "HR Manager",
        viewedAt: "2 hours ago",
        logo: "/logos/techsolutions.png",
    },

    {
        id: 2,
        company: "Google",
        role: "Recruiter",
        viewedAt: "1 day ago",
        logo: "/logos/google.png",
    },

    {
        id: 3,
        company: "Microsoft",
        role: "Talent Acquisition",
        viewedAt: "2 days ago",
        logo: "/logos/microsoft.png",
    },
];

export default function ProfileViewsCard() {
    return (
        <section className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            {/* Header */}
            <div className="flex items-center justify-between mb-5">

                <h2 className="text-[18px] font-semibold tracking-tight text-slate-900">
                    Profile Views
                </h2>

                <Link
                    href="/dashboard/profile-views"
                    className="text-[14px] font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                    View all
                </Link>
            </div>

            {/* List */}
            <div className="flex flex-col">

                {profileViews.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                    >

                        {/* Left */}
                        <div className="flex items-center gap-3 min-w-0">

                            {/* Logo */}
                            <div className="relative w-11 h-11 rounded-xl border border-slate-200 bg-white overflow-hidden flex items-center justify-center flex-shrink-0">

                                <Image
                                    src={item.logo}
                                    alt={item.company}
                                    width={28}
                                    height={28}
                                    className="object-contain"
                                />
                            </div>

                            {/* Info */}
                            <div className="min-w-0">

                                <h3 className="text-[15px] font-medium text-slate-900 truncate">
                                    {item.company}
                                </h3>

                                <p className="text-[14px] text-slate-500 truncate">
                                    {item.role}
                                </p>
                            </div>
                        </div>

                        {/* Time */}
                        <span className="text-[13px] text-slate-400 flex-shrink-0 ml-3">
                            {item.viewedAt}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}