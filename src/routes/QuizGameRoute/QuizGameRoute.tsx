import { ReactElement, useCallback, useEffect, useMemo, useRef } from 'react';
import { MobileView } from 'react-device-detect';
import styled from 'styled-components';
import { useLocalStorage } from 'usehooks-ts';

import { BackButton } from '../../components/BackButton';
import { BonusRoundTitle } from '../../components/BonusRoundTitle';
import { ShareButton } from '../../components/ShareButton';
import { WikipediaAndMapsLinks } from '../../components/WikipediaAndGmapsLinks';
import countryData from '../../data/countries';
import { countriesCurrencyAndPopulation } from '../../domain/countries.currencyAndPopulation';
import { useConfettiThrower } from '../../hooks/useConfettiThrower';
import { useDailyCountryName } from '../../hooks/useDailyCountryName';
import { useDailySeed } from '../../hooks/useDailySeed';
import { ChoiceStatus } from '../../hooks/useRoundState';
import { refreshCompleteAd } from '../../utils/ads';

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unused-vars
const { ReactComponent: CurrencyIcon } = require('./CurrencyIcon.svg');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ReactComponent: PopulationIcon } = require('./PopulationIcon.svg');

export function QuizGameRoute() {
  const dailyCountryName = useDailyCountryName();
  const roundSeed = useDailySeed('third-bonus-round');
  const {
    // currency_choices: currencyChoices,
    // currency_name: currencyCorrectAnswer,
    // currency_code,
    population_choices: populationChoices,
    population_answer: populationCorrectAnswer,
  } = useMemo(
    () =>
      countriesCurrencyAndPopulation[
        countryData[dailyCountryName].code.toUpperCase()
      ],
    [dailyCountryName],
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [{ selectedPopulation, selectedCurrency }, setRoundAnswsers] =
    useLocalStorage(roundSeed, {
      selectedPopulation: undefined,
      selectedCurrency: undefined,
    });

  const throwConfetti = useConfettiThrower();
  const selectPopulation = useCallback(
    (e) => {
      const selectedPopulation =
        e.currentTarget.closest('button')?.dataset?.value;

      if (selectedPopulation === populationCorrectAnswer) {
        throwConfetti();
      }

      setRoundAnswsers((roundAnswers) => ({
        ...roundAnswers,
        selectedPopulation,
      }));
    },
    [setRoundAnswsers, throwConfetti, populationCorrectAnswer],
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
          title={`What is the estimated population of ${dailyCountryName}?`}
          icon={
            <PopulationIcon
              width="80"
              height="64"
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
          }
          choices={populationChoices}
          selectedAnswer={selectedPopulation}
          correctAnswer={populationCorrectAnswer}
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
