import * as geolib from 'geolib';
import { useCallback, useMemo } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { useDailySeed } from './useDailySeed';

export type Guess = {
  name: string;
  distance: number;
  direction: ReturnType<(typeof geolib)['getCompassDirection']>;
  tile: number;
};

export type GuessHistory = { [key: string]: Guess[] };

export function useGuessHistory() {
  const dailySeed = useDailySeed();
  const [guesses, setGuesses] = useLocalStorage<GuessHistory>('guesses', {});

  const addGuess = useCallback(
    (newGuess: Guess) => {
      setGuesses((currGuesses) => ({
        ...currGuesses,
        [dailySeed]: [...(currGuesses[dailySeed] || []), newGuess],
      }));
    },
    [setGuesses, dailySeed],
  );

  return useMemo(() => [guesses, addGuess] as const, [guesses, addGuess]);
}
