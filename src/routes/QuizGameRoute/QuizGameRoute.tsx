import { ReactElement, useCallback, useEffect, useMemo, useRef } from 'react';
import { MobileView } from 'react-device-detect';
import styled from 'styled-components';
import { useLocalStorage } from 'usehooks-ts';

import { BackButton } from '../../components/BackButton';
import { BonusRoundTitle } from '../../components/BonusRoundTitle';
import { ShareButton } from '../../components/ShareButton';
import { WikipediaAndMapsLinks } from '../../components/WikipediaAndGmapsLinks';
import { useConfettiThrower } from '../../hooks/useConfettiThrower';
import { useDailySeed } from '../../hooks/useDailySeed';
import { ChoiceStatus } from '../../hooks/useRoundState';
import { useTodaysCountry } from '../../providers/TodaysCountryProvider';
import { refreshCompleteAd } from '../../utils/ads';

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const { ReactComponent: CurrencyIcon } = require('./CurrencyIcon.svg');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ReactComponent: PopulationIcon } = require('./PopulationIcon.svg');

function getPopulationAnswerIndex(actual: number, boundaries: number[]) {
  if (actual < boundaries[0]) return 0;
  if (actual < boundaries[1]) return 1;
  if (actual < boundaries[2]) return 2;
  return 3;
}

const getPopulationChoices = ({ population }: { population: number }) => {
  let boundaries: number[] = [];
  let populationChoices: string[] = [];

  if (typeof population === 'undefined') population = 0;

  if (population < 10_000) {
    // Micro countries
    populationChoices = ['Less than 25', '25 - 100', '100 - 2000', 'Over 2000'];
    boundaries = [25, 100, 2000];
  } else if (population < 2.5 * 1_000_000) {
    // Small countries
    populationChoices = [
      '< 50 thousand',
      '50 - 500 thousand',
      '500k - 1 million',
      '1+ million',
    ];
    boundaries = [50_000, 500_000, 1_000_000];
  } else if (population < 10 * 1_000_000) {
    // Medium countries
    populationChoices = [
      '< 3 million',
      '3 - 5 million',
      '5 - 8 million',
      '8+ million',
    ];
    boundaries = [3_000_000, 5_000_000, 8_000_000];
  } else if (population < 50 * 1_000_000) {
    // Large countries
    populationChoices = [
      '< 15 million',
      '15 - 25 million',
      '25 - 35 million',
      '35+ million',
    ];
    boundaries = [15_000_000, 25_000_000, 35_000_000];
  } else {
    // Massive countries
    populationChoices = [
      '< 60 million',
      '60 - 80 million',
      '80 - 100 million',
      '100+ million',
    ];
    boundaries = [60_000_000, 80_000_000, 100_000_000];
  }

  const populationAnswer =
    populationChoices[getPopulationAnswerIndex(population, boundaries)];
  return { boundaries, populationChoices, populationAnswer };
};

export function QuizGameRoute() {
  const { todaysCountry } = useTodaysCountry();
  const roundSeed = useDailySeed('fourth-bonus-round');
  const {
    // currency_choices: currencyChoices,
    // currency_name: currencyCorrectAnswer,
    // currency_code,
    populationChoices,
    populationAnswer,
  } = useMemo(
    () =>
      getPopulationChoices({
        population: todaysCountry.population,
      }),
    [todaysCountry],
  );

  const [{ selectedPopulation }, setRoundAnswsers] = useLocalStorage(
    roundSeed,
    {
      selectedPopulation: undefined,
      selectedCurrency: undefined,
    },
  );

  const throwConfetti = useConfettiThrower();
  const selectPopulation = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      const selectedPopulation =
        e.currentTarget.closest('button')?.dataset?.value;

      if (selectedPopulation === populationAnswer) {
        throwConfetti();
      }

      setRoundAnswsers((roundAnswers) => ({
        ...roundAnswers,
        selectedPopulation,
      }));
    },
    [setRoundAnswsers, throwConfetti, populationAnswer],
  );
  // const selectCurrency = useCallback(
  //   (e) => {
  //     const selectedCurrency =
  //       e.currentTarget.closest('button')?.dataset?.value;

  //     if (selectedCurrency === currencyCorrectAnswer) {
  //       throwConfetti();
  //     }

  //     setRoundAnswsers((roundAnswers) => ({
  //       ...roundAnswers,
  //       selectedCurrency,
  //     }));
  //   },
  //   [setRoundAnswsers, throwConfetti, currencyCorrectAnswer],
  // );

  const adRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    refreshCompleteAd();
  }, []);

  return (
    <>
      <BackButtonContainer>
        <BackButton />
      </BackButtonContainer>
      <BonusRoundTitle>Final Bonus Round - Population</BonusRoundTitle>

      <div className="flex flex-row flex-wrap w-full pb-4 gap-2 max-w-lg">
        <Question
          title={`What is the estimated population of ${todaysCountry.name}?`}
          icon={
            <PopulationIcon
              width="80"
              height="64"
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
          }
          choices={populationChoices}
          selectedAnswer={selectedPopulation}
          correctAnswer={populationAnswer}
          onSelectAnswer={selectPopulation}
        />
        {/* {selectedPopulation && (
          <p className="my-0 text-base text-center w-full">
            Population:{' '}
            <span className="font-bold text-xl">{populationCorrectAnswer}</span>
          </p>
        )}
        {selectedPopulation && (
          <>
            <Question
              title={`What is the currency in use in ${dailyCountryName}?`}
              icon={<CurrencyIcon width="80" height="64" />}
              choices={currencyChoices}
              selectedAnswer={selectedCurrency}
              correctAnswer={currencyCorrectAnswer}
              onSelectAnswer={selectCurrency}
            />
            {selectedCurrency && (
              <p className="my-0 text-base text-center w-full">
                Currency:{' '}
                <span className="font-bold text-xl">
                  {currencyCorrectAnswer} ({currency_code})
                </span>
              </p>
            )}
          </>
        )} */}

        {selectedPopulation && (
          <>
            <div className="w-full flex justify-center mt-3">
              <ShareButton />
            </div>
            <div className="w-full">
              <WikipediaAndMapsLinks />
            </div>
          </>
        )}
      </div>

      <MobileView className="w-full flex flex-col">
        <div
          ref={adRef}
          style={{ minHeight: 200, maxHeight: 250 }}
          className="w-full flex justify-center items-center my-4"
        >
          <div id="adngin-end_mobile-0"></div>
        </div>
      </MobileView>
    </>
  );
}

export const Question: React.FC<{
  title: string;
  icon?: ReactElement;
  choices: string[];
  selectedAnswer?: string;
  correctAnswer: string;
  onSelectAnswer?: (e: React.MouseEvent<HTMLElement>) => void;
}> = ({
  title,
  icon,
  choices,
  correctAnswer,
  selectedAnswer,
  onSelectAnswer,
}) => {
  return (
    <div className="w-full flex flex-col">
      <div className="font-bold text-center justify-center flex flex-grow flex-row items-center w-full mt-2 mb-2">
        <div
          className="flex flex-grow flex-row items-center justify-center"
          style={{ width: '90%', maxWidth: '90%' }}
        >
          <div style={{ maxWidth: '25%' }}>{icon}</div>
          <div className="flex-grow pl-2" style={{ lineHeight: 1.6 }}>
            {title}
          </div>
        </div>
      </div>
      <div className="flex flex-row flex-wrap w-full justify-center items-start">
        {choices.map((choice, i) => {
          const prefix = String.fromCharCode(65 + i);

          return (
            <div key={choice} className={`p-2 w-full md:w-1/2`}>
              <StyledButton
                data-value={choice}
                choiceStatus={
                  selectedAnswer && choice === correctAnswer
                    ? ChoiceStatus.CORRECT
                    : selectedAnswer === choice
                      ? ChoiceStatus.INCORRECT
                      : undefined
                }
                disabled={Boolean(selectedAnswer)}
                onClick={onSelectAnswer}
              >
                <span className="mr-2">{prefix}.</span> {choice}
              </StyledButton>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StyledButton = styled('button')<{
  choiceStatus?: ChoiceStatus | undefined;
}>`
  overflow: hidden;
  padding-block: 5px;
  padding-inline: 10px;
  width: 100%;
  border-width: 1px;
  border-radius: 10px;

  background-color: ${({ choiceStatus }) =>
    choiceStatus === ChoiceStatus.CORRECT
      ? 'green !important'
      : choiceStatus === ChoiceStatus.INCORRECT
        ? 'red !important'
        : 'none'};
  color: ${({ choiceStatus }) =>
    choiceStatus === ChoiceStatus.CORRECT ? '#fff !important' : '#000'};

  font-weight: bold;
  text-align: left;

  &:hover:not([disabled]) {
    background-color: #aaa;
  }

  &[disabled] {
    background-color: #ddd;
    color: #666;
  }

  @media (prefers-color-scheme: dark) {
    color: #fff;
  }
`;

const BackButtonContainer = styled.div`
  display: flex;
  max-width: 512px;
  padding: 0.4rem;
  margin-bottom: 1rem;
  width: 100%;
`;
