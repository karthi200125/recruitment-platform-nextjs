import Image from "next/image"

const AvatarGroup = () => {
    return (
        <div className="flex -space-x-3">
            {[
                '/avatars/user1.webp',
                '/avatars/user2.webp',
                '/avatars/user3.webp',
                '/avatars/user4.webp',
            ].map((avatar, index) => (
                <div
                    key={index}
                    className="relative h-10 w-10 overflow-hidden rounded-full border border-black"
                >
                    <Image
                        src={avatar}
                        alt="Subscriber"
                        fill
                        sizes="40px"
                        className="object-cover"
                    />
                </div>
            ))}
        </div>
    )
}

export default AvatarGroup