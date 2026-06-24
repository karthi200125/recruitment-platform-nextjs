"use client";

import Button from "@/components/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { QuestionAnswers , Question} from "@/types/easyApply";

/* ================= TYPES ================= */


interface EasyApplyQuestionsProps {
  job?: {
    questions?: Question[];
  };
  currentStep?: number;
  onNext?: (step: number) => void;
  onBack?: (step: number) => void;
  onAnswers?: (answers: QuestionAnswers) => void;
}

/* ================= COMPONENT ================= */

const EasyApplyQuestions = ({
  job,
  currentStep = 0,
  onNext,
  onBack,
  onAnswers,
}: EasyApplyQuestionsProps) => {
  const [answers, setAnswers] = useState<QuestionAnswers>({});
  const [errors, setErrors] = useState<QuestionAnswers>({});

  /* ================= HANDLERS ================= */

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    // remove error when user types
    if (value.trim() !== "") {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[questionId];
        return updated;
      });
    }
  };

  const validateAnswers = () => {
    const newErrors: QuestionAnswers = {};
    let isValid = true;

    job?.questions?.forEach((q) => {
      if (!answers[q.id] || answers[q.id].trim() === "") {
        newErrors[q.id] = "This field is required";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (!validateAnswers()) return;

    onAnswers?.(answers);
    onNext?.(currentStep + 1);
  };

  const handleBack = () => {
    onBack?.(currentStep - 1);
  };

  const questions = job?.questions ?? [];

  /* ================= UI ================= */

  return (
    <div className="w-full border rounded-md p-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleNext();
        }}
      >
        {questions.map((q) => (
          <div key={q.id} className="mb-4 space-y-2">
            <Label>
              {q.question} <span className="text-red-500">*</span>
            </Label>

            {q.type === "input" && (
              <div className="space-y-2">
                <Input
                  type="text"
                  value={answers[q.id] || ""}
                  onChange={(e) =>
                    handleAnswerChange(q.id, e.target.value)
                  }
                />

                {errors[q.id] && (
                  <p className="text-red-500 text-sm">
                    {errors[q.id]}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Actions */}
        <div className="flex gap-5">
          <Button variant="border" type="button" onClick={handleBack}>
            Back
          </Button>
          <Button type="submit">
            Review
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EasyApplyQuestions;