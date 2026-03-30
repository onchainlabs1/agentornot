"use client";

import { useEffect, useMemo, useState } from "react";
import { wizardSteps } from "@/features/decision-wizard/config/steps.config";
import { AnswerMap, UseCaseProfile } from "@/features/decision-wizard/domain/types";

const initialProfile: UseCaseProfile = {
  name: "",
  team: "",
  objective: ""
};

const STORAGE_KEY = "decision-wizard-state-v1";

export function useWizardStore() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [profile, setProfile] = useState<UseCaseProfile>(initialProfile);
  const [answers, setAnswers] = useState<AnswerMap>({});

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        currentStepIndex?: number;
        profile?: UseCaseProfile;
        answers?: AnswerMap;
      };
      if (typeof parsed.currentStepIndex === "number") {
        setCurrentStepIndex(Math.max(0, Math.min(wizardSteps.length - 1, parsed.currentStepIndex)));
      }
      if (parsed.profile) setProfile(parsed.profile);
      if (parsed.answers) setAnswers(parsed.answers);
    } catch {
      // Ignore invalid persisted state.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          currentStepIndex,
          profile,
          answers
        })
      );
    } catch {
      // Ignore storage failures.
    }
  }, [currentStepIndex, profile, answers]);

  const currentStep = wizardSteps[currentStepIndex];
  const progress = useMemo(
    () => Math.round((currentStepIndex / (wizardSteps.length - 1)) * 100),
    [currentStepIndex]
  );

  function nextStep() {
    setCurrentStepIndex((v) => Math.min(wizardSteps.length - 1, v + 1));
  }
  function prevStep() {
    setCurrentStepIndex((v) => Math.max(0, v - 1));
  }
  function goToStep(stepId: string) {
    const idx = wizardSteps.findIndex((s) => s.id === stepId);
    if (idx >= 0) setCurrentStepIndex(idx);
  }
  function restart() {
    setCurrentStepIndex(0);
    setProfile(initialProfile);
    setAnswers({});
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage failures.
    }
  }

  return {
    currentStepIndex,
    currentStep,
    progress,
    profile,
    setProfile,
    answers,
    setAnswers,
    nextStep,
    prevStep,
    goToStep,
    restart
  };
}
