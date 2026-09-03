import { ResumeAnalysisData } from "@/types/resume-analysis";
import { OverallScoreCard } from "./OverallScoreCard";
import { ResumeCard } from "./ResumeCard";
import { MetricsGrid } from "./MetricsGrid";
import { StrengthsCard } from "./StrengthsCard";
import { ImproveCard } from "./ImproveCard";
import { SuggestionsCard } from "./SuggestionsCard";
import { SkillsCard } from "./SkillsCard";
import { KeywordsCard } from "./KeywordsCard";

export function AnalysisResult({
    resume,
    analysis,
    onAnalyze,
    isAnalyzing,
}: {
    resume: string;
    analysis: ResumeAnalysisData;
    onAnalyze: () => void;
    isAnalyzing: boolean;
}) {
    return (
        <div className="space-y-5">
            <div className="grid gap-5 lg:grid-cols-[0.9fr_1.4fr]">
                <ResumeCard resume={resume} />

                <OverallScoreCard
                    analysis={analysis}
                    onAnalyze={onAnalyze}
                    isAnalyzing={isAnalyzing}
                />
            </div>

            <MetricsGrid metrics={analysis.metrics} />

            <div className="grid gap-5 lg:grid-cols-2">
                <StrengthsCard strengths={analysis.strengths} />
                <ImproveCard areas={analysis.areasToImprove} />
            </div>

            <SuggestionsCard suggestions={analysis.suggestions} />

            <div className="grid gap-5 lg:grid-cols-2">
                <SkillsCard skills={analysis.skills} />
                <KeywordsCard keywords={analysis.missingKeywords} />
            </div>
        </div>
    );
}