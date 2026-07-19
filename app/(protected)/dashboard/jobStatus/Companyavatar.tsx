import Image from "next/image";

interface CompanyAvatarProps {
    name: string;
    image?: string | null;
    size?: number;
}

const getInitials = (name: string) =>
    name
        .split(" ")
        .filter(Boolean)
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

export function CompanyAvatar({ name, image, size = 40 }: CompanyAvatarProps) {
    if (image) {
        return (
            <div
                className="relative flex-shrink-0 overflow-hidden rounded-xl border border-slate-200"
                style={{ width: size, height: size }}
            >
                <Image src={image || '/noProfile.webp'} alt={name} fill sizes={`${size}px`} className="object-cover" />
            </div>
        );
    }

    return (
        <div
            className="flex flex-shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-sm font-bold text-indigo-600"
            style={{ width: size, height: size }}
        >
            {getInitials(name)}
        </div>
    );
}