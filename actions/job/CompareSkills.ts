interface SkillsCheckResult {
    percentage: number;
    message: string;
}

interface SkillOwner {
    skills?: string[];
}

export const checkSkills = (
    user?: SkillOwner,
    job?: SkillOwner
): SkillsCheckResult => {
    const userSkills = new Set(
        (user?.skills ?? [])
            .map((skill) => skill.trim().toLowerCase())
            .filter(Boolean)
    );

    const jobSkills = Array.from(
        new Set(
            (job?.skills ?? [])
                .map((skill) => skill.trim().toLowerCase())
                .filter(Boolean)
        )
    );

    if (jobSkills.length === 0) {
        return {
            percentage: 0,
            message: 'No job skills available for comparison.',
        };
    }

    const matchedCount = jobSkills.filter((skill) =>
        userSkills.has(skill)
    ).length;

    const percentage = Math.round(
        (matchedCount / jobSkills.length) * 100
    );

    let message =
        'Poor skill match — consider improving relevant skills.';

    if (percentage >= 70) {
        message =
            'Strong skill match — you may be a great fit!';
    } else if (percentage >= 31) {
        message =
            'Moderate skill match — you have some relevant skills.';
    }

    return {
        percentage,
        message,
    };
};