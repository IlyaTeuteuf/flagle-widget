import { ImageQuiz } from '@pla324/teuteuf-image-quiz';
import { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import { AdnginEndMobile0 } from '../components/AdnginEndMobile0';
import AttemptsLeft from '../components/AttemptsLeft';
// import { BackButton } from '../components/BackButton';
import { BonusRoundTitle } from '../components/BonusRoundTitle';
// import { CorrectAnswers } from '../components/CorrectAnswers';
import { NextRoundLink } from '../components/NextRoundLink';
// import { ShareButton } from '../components/ShareButton';
import { useDailySeed } from '../hooks/useDailySeed';
import { useRoundState } from '../hooks/useRoundState';
import { useTodaysCountry } from '../providers/TodaysCountryProvider';
import { shuffleWithSeed } from '../utils/shuffleWithSeed';

const MAX_ATTEMPTS = 3;
const CHOICES_COUNT = 8;

const useFourthBonusRound = ({
  roundSeed,
  choicesCount,
  maxAttempts,
}: {
  roundSeed: string;
  choicesCount: number;
  maxAttempts: number;
}) => {
  const history = useHistory();
  const { todaysCountry, cityList, todaysCity } = useTodaysCountry();

  if (!todaysCity?.flag) {
    history.push('/');
  }

  const correctAnswer = useMemo(
    () => (todaysCity ? todaysCity.names['en'] : ''),
    [todaysCity],
  );

  const dailyChoicesOrder = useMemo(() => {
    const choices = [
      {
        name: todaysCity?.names['en'],
        code: todaysCountry.code,
      },
    ];

    // Gets the cities with flags and then shuffles them as per the round seed
    const list = shuffleWithSeed(
      cityList.filter((c) => c.countryCode !== todaysCountry.code && c.flag),
      roundSeed,
    );
    let i = 0;

    while (choices.length < choicesCount) {
      const city = list[i];
      choices.push({
        name: city.names['en'],
        code: city.countryCode,
      });

      i++;
    }
    return shuffleWithSeed(
      choices.map((c) => c.name || ''),
      roundSeed,
    );
  }, [todaysCity, todaysCountry, cityList, roundSeed, choicesCount]);

  const {
    dailyChoices,
    isRoundComplete,
    isRoundSuccess,
    onSelectCountry,
    attemptsLeft,
  } = useRoundState({
    seed: roundSeed,
    dailyChoicesOrder,
    maxAttempts,
    correctAnswer,
  });

  return useMemo(
    () => ({
      dailyChoicesOrder,
      dailyChoices,
      onSelectCountry,
      isRoundComplete,
      isRoundSuccess,
      attemptsLeft,
      correctAnswer,
    }),
    [
      dailyChoicesOrder,
      dailyChoices,
      onSelectCountry,
      isRoundComplete,
      isRoundSuccess,
      attemptsLeft,
      correctAnswer,
    ],
  );
};

export function CapitalFlagGameRoute() {
  const { todaysCountry, cityList, todaysCity } = useTodaysCountry();

  const roundSeed = useDailySeed('second-bonus-round');

  const {
    dailyChoicesOrder,
    dailyChoices,
    onSelectCountry,
    isRoundComplete,
    isRoundSuccess,
    attemptsLeft,
    correctAnswer,
  } = useFourthBonusRound({
    roundSeed,
    choicesCount: CHOICES_COUNT,
    maxAttempts: MAX_ATTEMPTS,
  });

  useEffect(() => {
    if (!isRoundComplete) {
      return;
    }

    toast(
      isRoundSuccess ? `🎉 ${correctAnswer} 🎉` : `🤔 ${correctAnswer} 🤔`,
      { autoClose: 3000 },
    );
  }, [isRoundComplete, isRoundSuccess, correctAnswer]);

  const startingGuesses = useMemo(
    () =>
      Object.entries(dailyChoices)
        .map(([k, v]) => {
          return typeof v !== 'undefined'
            ? {
                name: k,
                image:
                  'https://teuteuf-dashboard-assets.pages.dev' +
                    cityList.find((c) => c.names['en'] === k)?.flag || '',
              }
            : null;
        })
        .filter((g) => g) as { name: string; image: string }[],
    [cityList, dailyChoices],
  );

  const handleGuess = ({
    guess,
  }: {
    guess: { name: string; image: string };
  }) => {
    onSelectCountry({} as never, guess.name);
  };

  return (
    <>
      {/* <BackButtonContainer>
        <BackButton />
      </BackButtonContainer> */}
      <BonusRoundTitle>
        Pick the flag of the capital city of {todaysCountry.name}:{' '}
        {todaysCity?.names['en']}
      </BonusRoundTitle>

      <div className="max-w-lg mt-3">
        <ImageQuiz
          answerOptions={dailyChoicesOrder.map((cityName) => ({
            name: cityName,
            image:
              'https://teuteuf-dashboard-assets.pages.dev' +
                cityList.find((c) => c.names['en'] === cityName)?.flag || '',
          }))}
          correctAnswer={correctAnswer}
          getAnswerImage={(c) => c.image}
          getAnswerText={(c) => c.name}
          startingGuesses={startingGuesses}
          onGuess={handleGuess}
        />
      </div>

      {!isRoundComplete && (
        <AttemptsLeft inlineEmoji={true} top={32}>{3-attemptsLeft}/3</AttemptsLeft>
      )}

      {isRoundComplete && (
        <>
          <div className="w-full flex justify-center mt-3">
            <NextRoundLink to="/bonus-round/3" />
          </div>
          {/* <CorrectAnswers answers={[correctAnswer]} /> */}
          {/* <ShareButton /> */}
        </>
      )}

      <AdnginEndMobile0 />
    </>
  );
}

// const AttemptsLeft = styled('div')`
//   padding-top: 0.75rem;
//   padding-bottom: 0.75rem;
//   color: #888;
// `;

// const BackButtonContainer = styled.div`
//   display: flex;
//   max-width: 376px;
//   padding: 0.4rem;
//   margin-bottom: 1rem;
//   width: 100%;
// `;
