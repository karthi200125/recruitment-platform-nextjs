import { Sparkles } from "lucide-react";

const AIMatchBadge = () => {
    return (
        <div
            className="
        inline-flex
        items-center
        gap-2
        rounded-full
        border
        border-violet-100
        bg-gradient-to-r
        from-violet-50
        to-indigo-50
        px-3.5
        py-1.5
        text-xs
        font-semibold
        text-indigo-700
        shadow-sm
      "
        >
            <Sparkles
                className="h-3.5 w-3.5 text-violet-500"
                strokeWidth={2}
            />

            <span>AI Match</span>
        </div>
    );
};

export default AIMatchBadge;