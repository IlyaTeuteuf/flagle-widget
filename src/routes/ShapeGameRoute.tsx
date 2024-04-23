import React, { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import { getCountryShapeSvgUrl } from '../api/fetchDataFromCDN';
import { AdnginEndMobile0 } from '../components/AdnginEndMobile0';
import { BackButton } from '../components/BackButton';
import { BonusRoundTitle } from '../components/BonusRoundTitle';
import { NextRoundLink } from '../components/NextRoundLink';
import { ShareButton } from '../components/ShareButton';
import { useDailySeed } from '../hooks/useDailySeed';
import { ChoiceStatus, useRoundState } from '../hooks/useRoundState';
import { useTodaysCountry } from '../providers/TodaysCountryProvider';
import { shuffleWithSeed } from '../utils/shuffleWithSeed';

const MAX_ATTEMPTS = 2;
const CHOICES_COUNT = 4;

const useFirstBonusRound = ({
  roundSeed,
  choicesCount,
  maxAttempts,
}: {
  roundSeed: string;
  choicesCount: number;
  maxAttempts: number;
}) => {
  const { todaysCountry, countryList } = useTodaysCountry();
  const blackList = useMemo(() => [todaysCountry.name], [todaysCountry]);

  const dailyChoicesOrder = useMemo(() => {
    const blackListRemoved = countryList.filter(
      (c) => !blackList.includes(c.name),
    );
    const shuffled = shuffleWithSeed(blackListRemoved, roundSeed);
    const choices = shuffled.slice(0, choicesCount - 1).map((c) => c.name);
    choices.push(todaysCountry.name);
    return shuffleWithSeed(choices, roundSeed);
  }, [countryList, roundSeed, choicesCount, todaysCountry.name, blackList]);

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
    correctAnswer: todaysCountry.name,
  });

  return useMemo(
    () => ({
      dailyChoicesOrder,
      dailyChoices,
      onSelectCountry,
      isRoundComplete,
      isRoundSuccess,
      attemptsLeft,
      correctAnswer: todaysCountry.name,
    }),
    [
      dailyChoicesOrder,
      dailyChoices,
      onSelectCountry,
      isRoundComplete,
      isRoundSuccess,
      attemptsLeft,
      todaysCountry,
    ],
  );
};

export const ShapeGameRoute: React.FC = () => {
  const { todaysCountry, countryList } = useTodaysCountry();
  const roundSeed = useDailySeed('first-bonus-round');
  const {
    dailyChoicesOrder,
    dailyChoices,
    onSelectCountry,
    isRoundComplete,
    isRoundSuccess,
    attemptsLeft,
    correctAnswer,
  } = useFirstBonusRound({
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
        What's the shape of {todaysCountry.name}?
      </BonusRoundTitle>

      <OutlineGrid>
        {dailyChoicesOrder.map((countryName, index) => (
          <CountryShape
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
        ))}
      </OutlineGrid>

      <p style={{ marginTop: '10px' }}>
        Sponsored by WORLD<span style={{ color: '#16A34A' }}>L</span>E
      </p>
      <p>
        Like this round?&nbsp;
        <a
          className="underline"
          href={`https://worldle.teuteuf.fr`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Try WORLD<span style={{ color: '#16A34A' }}>L</span>E
        </a>
      </p>

      {!isRoundComplete && (
        <AttemptsLeft>You have {attemptsLeft} guesses remaining</AttemptsLeft>
      )}

      {isRoundComplete && (
        <>
          <NextRoundLink to="/bonus-round/2">
            Bonus Round - 2/3 - Pick the flag of a neighbouring country
          </NextRoundLink>

          <ShareButton />
        </>
      )}

      <AdnginEndMobile0 />
    </>
  );
};

const AttemptsLeft = styled('div')`
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  color: #888;
`;

const CountryShape: React.FC<{
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
    <StyledButton
      key={countryName}
      data-country-name={countryName}
      onClick={onSelect}
      disabled={disabled}
      style={{
        borderColor:
          choiceStatus === ChoiceStatus.CORRECT
            ? 'green'
            : choiceStatus === ChoiceStatus.INCORRECT
            ? 'red'
            : '',
      }}
    >
      <IndexShadow>{index}.</IndexShadow>
      <Index>{index}.</Index>
      <CountrySVG
        src={getCountryShapeSvgUrl(countryCode)}
        width="120"
        height="120"
        alt=""
      />
    </StyledButton>
  );
};

const StyledButton = styled('button')`
  position: relative;
  padding: 0.75rem;
  border: 4px solid #ccc;
  border-radius: 0.375rem;
`;

const Index = styled('div')`
  position: absolute;
  top: 3px;
  left: 7px;
  font-weight: bold;
  color: #000;
  @media (prefers-color-scheme: dark) {
    color: #fff;
  }
`;

const IndexShadow = styled('div')`
  position: absolute;
  top: 4px;
  left: 8px;
  font-weight: bold;
  color: #fff;
  @media (prefers-color-scheme: dark) {
    color: #000;
  }
`;

const CountrySVG = styled('img')`
  @media (prefers-color-scheme: dark) {
    filter: invert(1);
  }
`;

const OutlineGrid = styled.div`
  display: grid;
  gap: 0.8rem;
  grid-template-columns: repeat(2, 1fr);
  margin: 1rem;
`;

const BackButtonContainer = styled.div`
  display: flex;
  max-width: 376px;
  padding: 0.4rem;
  margin-bottom: 1rem;
  width: 100%;
`;
