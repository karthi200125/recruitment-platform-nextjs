export interface ResumeAnalysisData {
    overallScore: number;
    headline: string;
    summary: string;
    metrics: {
        atsCompatibility: number;
        workExperience: number;
        skills: number;
        projects: number;
        structureAndClarity: number;
    };
    strengths: {
        title: string;
        description: string;
    }[];
    areasToImprove: {
        title: string;
        description: string;
    }[];
    suggestions: {
        title: string;
        description: string;
        priority: "high" | "medium" | "low";
    }[];
    skills: string[];
    missingKeywords: string[];
}