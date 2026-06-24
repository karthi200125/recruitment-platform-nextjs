export interface SkillsCheckResult {
  percentage: number;
  matchedSkills: string[];
  missingSkills: string[];
}

const normalizeSkill = (skill: string): string => {
  return skill
    .trim()
    .toLowerCase()
    .replace(/\.js$/, "") // react.js → react
    .replace(/\s+/g, ""); // remove spaces
};

export const checkSkills = (
  user?: { skills?: string[] },
  job?: { skills?: string[] }
): SkillsCheckResult => {
  const userSkills = new Set(
    (user?.skills ?? []).map(normalizeSkill)
  );

  const jobSkills = Array.from(
    new Set((job?.skills ?? []).map(normalizeSkill))
  );

  if (!jobSkills.length) {
    return {
      percentage: 0,
      matchedSkills: [],
      missingSkills: [],
    };
  }

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const skill of jobSkills) {
    if (userSkills.has(skill)) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }

  const percentage = Math.round(
    (matchedSkills.length / jobSkills.length) * 100
  );

  return {
    percentage,
    matchedSkills,
    missingSkills,
  };
};