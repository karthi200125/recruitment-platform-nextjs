export function SkillsCard({
    skills,
}: {
    skills: string[];
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-slate-900">
                Detected Skills
            </h2>

            {skills.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                    {skills.map((skill) => (
                        <span
                            key={skill}
                            className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            ) : (
                <p className="mt-3 text-sm text-slate-500">
                    No skills were detected.
                </p>
            )}
        </div>
    );
}