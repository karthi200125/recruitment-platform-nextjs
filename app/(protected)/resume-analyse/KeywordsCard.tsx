export function KeywordsCard({
    keywords,
}: {
    keywords: string[];    
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-slate-900">
                Missing / Weak Keywords
            </h2>

            {keywords.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                    {keywords.map((keyword) => (
                        <span
                            key={keyword}
                            className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700"
                        >
                            {keyword}
                        </span>
                    ))}
                </div>
            ) : (
                <p className="mt-3 text-sm text-slate-500">
                    No major keyword gaps were identified.
                </p>
            )}
        </div>
    );
}