export interface SkillsCheckResult {
  percentage: number;
  matchedSkills: string[];
  missingSkills: string[];
}

const normalizeSkill = (skill: string): string =>
  skill
    .trim()
    .toLowerCase()
    .replace(/\.js$/, "")
    .replace(/\s+/g, "");

export const checkSkills = (
  user?: { skills?: string[] },
  job?: { skills?: string[] }
): SkillsCheckResult => {
  const userSkillSet = new Set(
    (user?.skills ?? []).map(normalizeSkill).filter(Boolean)
  );
  
  const uniqueJobSkills = Array.from(
    new Map(
      (job?.skills ?? [])
        .map((label) => [normalizeSkill(label), label] as const)
        .filter(([key]) => key.length > 0)
    ).values()
  );

  if (uniqueJobSkills.length === 0) {
    return { percentage: 0, matchedSkills: [], missingSkills: [] };
  }

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const originalLabel of uniqueJobSkills) {
    if (userSkillSet.has(normalizeSkill(originalLabel))) {
      matchedSkills.push(originalLabel);
    } else {
      missingSkills.push(originalLabel);
    }
  }

  const percentage = Math.round((matchedSkills.length / uniqueJobSkills.length) * 100);

  return { percentage, matchedSkills, missingSkills };
};