"use client";

import { useEffect, useState } from "react";

import Button from "@/components/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { Job } from "@/types";
import type { Question, QuestionAnswers } from "@/types/easyApply";

interface EasyApplyQuestionsProps {
  job?: any;
  currentStep?: number;
  onNext?: (step: number) => void;
  onBack?: (step: number) => void;
  onAnswers?: (answers: QuestionAnswers) => void;
}

const EasyApplyQuestions = ({
  job,
  currentStep = 0,
  onNext,
  onBack,
  onAnswers,
}: EasyApplyQuestionsProps) => {
  const questions = job?.questions ?? [];

  const [answers, setAnswers] = useState<QuestionAnswers>({});
  const [errors, setErrors] = useState<QuestionAnswers>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (questions.length === 0) {
      onAnswers?.({});
      onNext?.(currentStep + 1);
    }
  }, [questions, currentStep, onAnswers, onNext]);

  const handleAnswerChange = (
    questionId: number,
    value: string
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    if (value.trim()) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[questionId];
        return next;
      });
    }
  };

  const validateAnswers = () => {
    const nextErrors: QuestionAnswers = {};

    for (const question of questions) {
      if (!answers[question.id]?.trim()) {
        nextErrors[question.id] = "This field is required.";
      }
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isSubmitting) return;

    if (!validateAnswers()) return;

    setIsSubmitting(true);

    onAnswers?.(answers);
    onNext?.(currentStep + 1);
  };

  const handleBack = () => {
    if (isSubmitting) return;
    onBack?.(currentStep - 1);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Additional Questions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Please answer the employer's required questions.
          </p>
        </div>

        {questions.map((question: Question) => (
          <div
            key={question.id}
            className="space-y-2"
          >
            <Label>
              {question.question}

              <span className="ml-1 text-red-500">
                *
              </span>
            </Label>

            <Input
              type="text"
              value={answers[question.id] ?? ""}
              onChange={(e) =>
                handleAnswerChange(
                  question.id,
                  e.target.value
                )
              }
              placeholder="Type your answer..."
            />

            {errors[question.id] && (
              <p className="text-sm text-red-500">
                {errors[question.id]}
              </p>
            )}
          </div>
        ))}

        <div className="flex items-center justify-between border-t border-slate-200 pt-6">
          <Button
            type="button"
            variant="border"
            onClick={handleBack}
            disabled={isSubmitting}
          >
            Back
          </Button>

          <Button
            type="submit"
            isLoading={isSubmitting}
          >
            Review Application
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EasyApplyQuestions;