import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import { getCountryFlagSvgUrl } from '../api/fetchDataFromCDN';
import { AdnginEndMobile0 } from '../components/AdnginEndMobile0';
import { BackButton } from '../components/BackButton';
import { BonusRoundTitle } from '../components/BonusRoundTitle';
import { CorrectAnswers } from '../components/CorrectAnswers';
import { NextRoundLink } from '../components/NextRoundLink';
import { ShareButton } from '../components/ShareButton';
import { useDailySeed } from '../hooks/useDailySeed';
import { ChoiceStatus, useRoundState } from '../hooks/useRoundState';
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
];

const useSecondBonusRound = ({
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
    const blackList = [todaysCountry.code, ...todaysCountry.borders];
    const list = shuffleWithSeed(countryList, roundSeed);
    let i = 0;
    while (choices.length < choicesCount) {
      const country = list[i];

      if (country && !blackList.includes(country.code)) {
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
  const roundSeed = useDailySeed('second-bonus-round');

  const {
    dailyChoicesOrder,
    dailyChoices,
    onSelectCountry,
    isRoundComplete,
    isRoundSuccess,
    attemptsLeft,
    correctAnswer,
  } = useSecondBonusRound({
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

  return (
    <>
      <BackButtonContainer>
        <BackButton />
      </BackButtonContainer>
      <BonusRoundTitle>
        Pick the flag of a country that neighbours {todaysCountry.name}
      </BonusRoundTitle>

      <div className="grid grid-cols-4 gap-2 mt-3">
        {dailyChoicesOrder.map((countryName, index) => {
          if (countryList.findIndex((c) => c.name === countryName) !== -1) {
            return (
              <CountryFlag
                key={countryName}
                countryName={countryName}
                countryCode={
                  countryList.find((c) => c.name === countryName)?.code || ''
                }
                index={index + 1}
                choiceStatus={
                  dailyChoices[countryName] ||
                  (isRoundComplete && countryName === correctAnswer
                    ? ChoiceStatus.CORRECT
                    : undefined)
                }
                disabled={
                  isRoundComplete || dailyChoices[countryName] !== undefined
                }
                onSelect={onSelectCountry}
              />
            );
          } else {
            console.error(countryName);
          }
        })}
      </div>

      {!isRoundComplete && (
        <AttemptsLeft>You have {attemptsLeft} guesses remaining</AttemptsLeft>
      )}

      {isRoundComplete && (
        <>
          <CorrectAnswers answers={[correctAnswer]} />
          <NextRoundLink to="/bonus-round/3">
            Bonus Round - 3/3 - Population
          </NextRoundLink>

          <ShareButton />
        </>
      )}

      <AdnginEndMobile0 />
    </>
  );
}

const AttemptsLeft = styled('div')`
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  color: #888;
`;

const BackButtonContainer = styled.div`
  display: flex;
  max-width: 376px;
  padding: 0.4rem;
  margin-bottom: 1rem;
  width: 100%;
`;

const CountryFlag: React.FC<{
  countryName: string;
  countryCode: string;
  index: number;
  onSelect: (e: React.MouseEvent<HTMLElement>) => void;
  disabled: boolean;
  choiceStatus: ChoiceStatus | undefined;
}> = ({
  countryName,
  countryCode = '',
  index = 0,
  onSelect,
  disabled = false,
  choiceStatus,
}) => {
  return (
    <button
      key={countryName}
      data-country-name={countryName}
      onClick={onSelect}
      disabled={disabled}
      className="rounded-md p-3 relative"
      style={{
        border: '4px solid #CCC',
        borderColor:
          choiceStatus === ChoiceStatus.CORRECT
            ? 'green'
            : choiceStatus === ChoiceStatus.INCORRECT
            ? 'red'
            : '',
        paddingTop: '24px',
        paddingBottom: '24px',
      }}
    >
      <div
        className="font-bold absolute"
        style={{ top: '4px', left: '8px', color: '#fff' }}
      >
        {index}.
      </div>
      <div className="font-bold absolute" style={{ top: '3px', left: '7px' }}>
        {index}.
      </div>
      <img
        src={getCountryFlagSvgUrl(countryCode)}
        width="70"
        height="70"
        alt=""
        style={{ border: '1px solid #CCC' }}
      />
    </button>
  );
};
