import { ImageQuiz } from '@pla324/teuteuf-image-quiz';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';

import { getCountryFlagSvgUrl } from '../api/fetchDataFromCDN';
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

// arrays of country codes that have the same flag
const matchingFlags = [
  ['fr', 'yt'],
  ['nl', 'bq'],
  ['no', 'sj', 'bv'],
  ['au', 'hm'],
  ['td', 'ro'],
];

const useThirdBonusRound = ({
  roundSeed,
  choicesCount,
  maxAttempts,
}: {
  roundSeed: string;
  choicesCount: number;
  maxAttempts: number;
}) => {
  const { todaysCountry, countryList } = useTodaysCountry();

  const randomBorderCountry = useMemo(() => {
    const code = shuffleWithSeed(todaysCountry.borders, roundSeed).pop();
    const country = countryList.find(
      (c) => c.code.toLowerCase() === code?.toLowerCase(),
    );
    return country;
  }, [todaysCountry, roundSeed, countryList]);

  const correctAnswer = useMemo(
    () => randomBorderCountry?.name || '',
    [randomBorderCountry?.name],
  );

  const dailyChoicesOrder = useMemo(() => {
    const choices = [
      {
        name: randomBorderCountry?.name,
        code: randomBorderCountry?.code,
      },
    ];
    const blackList = [
      todaysCountry.code.toLowerCase(),
      ...todaysCountry.borders.map((b) => b.toLowerCase()),
    ];
    const list = shuffleWithSeed(countryList, roundSeed);
    let i = 0;

    while (choices.length < choicesCount) {
      const country = list[i];

      if (country && !blackList.includes(country.code.toLowerCase())) {
        // don't allow more than one country from each matching flag group
        const matchingFlagGroup = matchingFlags.find((a) =>
          a.includes(country.code.toLowerCase()),
        );

        const isCountryInMatchingFlagGroup = choices.some((c) =>
          matchingFlagGroup?.includes(c.code?.toLowerCase() ?? ''),
        );

        if (!matchingFlagGroup || !isCountryInMatchingFlagGroup) {
          choices.push({
            name: country.name,
            code: country.code,
          });
        }
      }
      i++;
    }
    return shuffleWithSeed(
      choices.map((c) => c.name || ''),
      roundSeed,
    );
  }, [
    randomBorderCountry?.name,
    randomBorderCountry?.code,
    todaysCountry.code,
    todaysCountry.borders,
    countryList,
    roundSeed,
    choicesCount,
  ]);

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

export function BorderFlagGameRoute() {
  const { todaysCountry, countryList } = useTodaysCountry();
  const roundSeed = useDailySeed('third-bonus-round');

  const {
    dailyChoicesOrder,
    dailyChoices,
    onSelectCountry,
    isRoundComplete,
    isRoundSuccess,
    attemptsLeft,
    correctAnswer,
  } = useThirdBonusRound({
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
                image: getCountryFlagSvgUrl(
                  countryList.find((c) => c.name === k)?.code || '',
                ),
              }
            : null;
        })
        .filter((g) => g) as { name: string; image: string }[],
    [countryList, dailyChoices],
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
        Pick the flag of a country that neighbours {todaysCountry.name}
      </BonusRoundTitle>

      <div className="max-w-lg mt-3">
        <ImageQuiz
          answerOptions={dailyChoicesOrder.map((countryName) => ({
            name: countryName,
            image: getCountryFlagSvgUrl(
              countryList.find((c) => c.name === countryName)?.code || '',
            ),
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
          {/* <CorrectAnswers answers={[correctAnswer]} /> */}
          <NextRoundLink to="/bonus-round/4" />

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
