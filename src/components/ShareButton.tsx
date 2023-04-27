import Button from '@mui/material/Button';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';

import { useDailySeed } from '../hooks/useDailySeed';
import { Guess, useGuessHistory } from '../hooks/useGuessHistory';

const FIRST_DAY_OF_FLAGLE = DateTime.fromFormat(
  'February 21 2022',
  'LLLL dd yyyy',
);

const MAX_ATTEMPTS = 6;

const generateShareSquares = ({
  score,
  guesses,
}: {
  score: number | 'DNF';
  guesses: Guess[];
}) => {
  if (score === 'DNF') {
    return '🟥🟥🟥\n🟥🟥🟥\n';
  }

  const squares = Array(MAX_ATTEMPTS).fill('🟩');
  for (let i = 0; i < guesses.length - 1; i++) {
    squares[guesses[i].tile] = '🟥';
  }

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    if ((i + 1) % 3 === 0) {
      squares[i] += '\n';
    }
  }
  return squares.join('');
};

export function ShareButton() {
  const dailySeed = useDailySeed();
  const [guessHistory] = useGuessHistory();

  const shareText = useMemo(() => {
    const dailyGuesses = guessHistory[dailySeed] || [];
    const score = dailyGuesses.some(({ distance }) => distance === 0)
      ? dailyGuesses.length
      : 'DNF';

    const trueDayString = dailySeed.slice(0, -2);
    const currentDate = DateTime.fromFormat(trueDayString, 'yyyy-MM-dd');
    const dateDiff = currentDate.diff(FIRST_DAY_OF_FLAGLE, 'days').toObject();
    const squareString = generateShareSquares({
      score,
      guesses: dailyGuesses,
    });
    return `#Flagle #${dateDiff.days} ${
      score === 'DNF' ? 'X' : dailyGuesses.length
    }/${MAX_ATTEMPTS}\n${squareString}https://www.flagle.io`;
  }, [guessHistory, dailySeed]);

  return (
    <CopyToClipboard
      text={shareText}
      onCopy={() => toast('Copied Results to Clipboard', { autoClose: 2000 })}
      options={{ format: 'text/plain' }}
    >
      <Button variant="contained" sx={{ backgroundColor: '#1a76d2' }}>
        <span>Share Score</span>
      </Button>
    </CopyToClipboard>
  );
}
