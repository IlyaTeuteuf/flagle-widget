import { useCallback, useMemo } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { useConfettiThrower } from './useConfettiThrower';

export enum ChoiceStatus {
  CORRECT = 'correct',
  INCORRECT = 'incorrect',
}

export const useRoundState = ({
  seed,
  dailyChoicesOrder,
  maxAttempts,
  correctAnswer,
}: {
  seed: string;
  dailyChoicesOrder: string[];
  maxAttempts: number;
  correctAnswer: string;
}) => {
  const initialState = useMemo(
    () =>
      dailyChoicesOrder.reduce<{ [key: string]: ChoiceStatus | undefined }>(
        (acc, curr) => {
          acc[curr] = undefined;
          return acc;
        },
        {},
      ),
    [dailyChoicesOrder],
  );
  const [dailyChoices, setDailyChoices] = useLocalStorage(seed, initialState);
  const nbAnswers = useMemo(
    () => Object.values(dailyChoices).filter((val) => val !== undefined).length,
    [dailyChoices],
  );
  const attemptsLeft = maxAttempts - nbAnswers;
  const isRoundSuccess = useMemo(
    () => Object.values(dailyChoices).includes(ChoiceStatus.CORRECT),
    [dailyChoices],
  );
  const isRoundComplete = useMemo(
    () => isRoundSuccess || nbAnswers >= maxAttempts,
    [isRoundSuccess, nbAnswers, maxAttempts],
  );
  const throwConfetti = useConfettiThrower();
  const onSelectCountry = useCallback(
    (e: React.MouseEvent<HTMLElement>, name?: string) => {
      const countryName =
        name || e.currentTarget.closest('button')?.dataset?.countryName;

      if (!countryName) {
        return;
      }

      if (countryName === correctAnswer) {
        throwConfetti();
      }

      setDailyChoices((propositions) => {
        const nextPropositions = {
          ...propositions,
          [countryName]:
            countryName === correctAnswer
              ? ChoiceStatus.CORRECT
              : ChoiceStatus.INCORRECT,
        };

        return nextPropositions;
      });
    },
    [setDailyChoices, throwConfetti, correctAnswer],
  );

  return useMemo(
    () => ({
      dailyChoices,
      setDailyChoices,
      isRoundComplete,
      isRoundSuccess,
      attemptsLeft,
      onSelectCountry,
    }),
    [
      dailyChoices,
      setDailyChoices,
      isRoundComplete,
      isRoundSuccess,
      attemptsLeft,
      onSelectCountry,
    ],
  );
};
