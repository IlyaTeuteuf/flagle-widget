import { MultipleChoiceQuiz } from '@pla324/teuteuf-multiple-choice-quiz';
import {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { MobileView } from 'react-device-detect';
import { toast } from 'react-toastify';
// import styled from 'styled-components';
import { useLocalStorage } from 'usehooks-ts';

// import { BackButton } from '../../components/BackButton';
// import { BonusRoundTitle } from '../../components/BonusRoundTitle';
// import { ShareButton } from '../../components/ShareButton';
// import { WikipediaAndMapsLinks } from '../../components/WikipediaAndGmapsLinks';
import { useConfettiThrower } from '../../hooks/useConfettiThrower';
import { useDailySeed } from '../../hooks/useDailySeed';
import { useTodaysCountry } from '../../providers/TodaysCountryProvider';
import { refreshCompleteAd } from '../../utils/ads';

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const { ReactComponent: CurrencyIcon } = require('./CurrencyIcon.svg');
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const { ReactComponent: PopulationIcon } = require('./PopulationIcon.svg');

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
    populationChoices = ['Under 25', '25 - 100', '100 - 2000', 'Over 2000'];
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

const getCurrencyData = ({
  currencyData,
}: {
  currencyData:
    | {
        code: string;
        name: string;
        nameChoices: string[];
      }
    | undefined
    | null;
}) => {
  const allChoices = currencyData?.nameChoices ?? [];
  // only add the correct answer if it's not already in the list
  if (
    allChoices.findIndex(
      (a) => a.toLowerCase() === currencyData?.name.toLowerCase(),
    ) === -1 &&
    currencyData?.name
  ) {
    allChoices.push(currencyData?.name);
  }

  return {
    currencyCorrectCode: currencyData?.code,
    currencyCorrectAnswer: currencyData?.name,
    currencyChoices: allChoices.sort(() => Math.random() - 0.5),
  };
};

export function QuizGameRoute() {
  const { todaysCountry } = useTodaysCountry();
  const roundSeed = useDailySeed('fourth-bonus-round');
  const { populationChoices, populationAnswer } = useMemo(
    () =>
      getPopulationChoices({
        population: todaysCountry.population,
      }),
    [todaysCountry],
  );

  const { currencyCorrectCode, currencyCorrectAnswer, currencyChoices } =
    useMemo(
      () => getCurrencyData({ currencyData: todaysCountry.currencyData }),
      [todaysCountry],
    );

  const [{ selectedPopulation, selectedCurrency }, setRoundAnswsers] =
    useLocalStorage(roundSeed, {
      selectedPopulation: undefined,
      selectedCurrency: undefined,
    });

  const throwConfetti = useConfettiThrower();

  const [fade, setFade] = useState(false);

  const selectPopulation = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (selectedPopulation: any) => {
      const isCorrectAnswer = selectedPopulation === populationAnswer;
      if (isCorrectAnswer) {
        throwConfetti();
      }

      setFade(true);
      const emoji = isCorrectAnswer ? '🎉' : '🤔';
      toast(
        <div>
          <span>{emoji}</span>Population: <strong>{populationAnswer}</strong>
          <span>{emoji}</span>
        </div>,
        { autoClose: 3000 },
      );

      setTimeout(() => {
        setRoundAnswsers((roundAnswers) => ({
          ...roundAnswers,
          selectedPopulation,
        }));
        setFade(false);
      }, 1000);
    },
    [setRoundAnswsers, throwConfetti, populationAnswer],
  );
  const selectCurrency = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (selectedCurrency: any) => {
      const isCorrectAnswer = selectedCurrency === currencyCorrectAnswer;
      if (isCorrectAnswer) {
        throwConfetti();
      }

      const emoji = isCorrectAnswer ? '🎉' : '🤔';
      toast(
        <div>
          <span>{emoji}</span>Currency:{' '}
          <strong>
            {currencyCorrectAnswer} ({currencyCorrectCode})
          </strong>
          <span>{emoji}</span>
        </div>,
        { autoClose: 3000 },
      );

      setRoundAnswsers((roundAnswers) => ({
        ...roundAnswers,
        selectedCurrency,
      }));
    },
    [
      setRoundAnswsers,
      throwConfetti,
      currencyCorrectAnswer,
      currencyCorrectCode,
    ],
  );

  const adRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    refreshCompleteAd();
  }, []);

  return (
    <>
      {/* <BackButtonContainer>
        <BackButton />
      </BackButtonContainer> */}
      {/* <BonusRoundTitle>
        Final Bonus Round - Population & Currency
      </BonusRoundTitle> */}

      <div
        className={`flex flex-row flex-wrap w-full pb-4 gap-2 max-w-lg transition-opacity duration-1000 ${fade ? 'opacity-0' : ''}`}
      >
        {!selectedPopulation && (
          <Question
            title={`What is the estimated population of ${todaysCountry.name}?`}
            choices={populationChoices}
            selectedAnswer={selectedPopulation}
            correctAnswer={populationAnswer}
            onSelectAnswer={selectPopulation}
          />
        )}
        {/* {selectedPopulation && (
          <div className="w-full flex justify-center my-1 items-center">
            <p className="text-base text-center border rounded-full p-2 px-6 border-slate-500">
              Population:{' '}
              <span className="font-bold text-xl">{populationAnswer}</span>
            </p>
          </div>
        )} */}
        {selectedPopulation &&
          todaysCountry.currencyData &&
          currencyChoices &&
          currencyCorrectAnswer && (
            <>
              {/* <div className="h-[1px] w-4/6 bg-slate-500 opacity-30 left-1/2 my-3 -translate-x-1/2 relative" /> */}
              <Question
                title={`What is the currency used in ${todaysCountry.name}?`}
                // icon={<CurrencyIcon width="80" height="64" />}
                choices={currencyChoices}
                selectedAnswer={selectedCurrency}
                correctAnswer={currencyCorrectAnswer}
                onSelectAnswer={selectCurrency}
              />
              {/* {selectedCurrency && (
                <div className="w-full flex justify-center my-1 items-center">
                  <p className="text-base text-center border rounded-full p-2 px-6 border-slate-500">
                    Currency:{' '}
                    <span className="font-bold text-xl">
                      {currencyCorrectAnswer} ({currencyCorrectCode})
                    </span>
                  </p>
                </div>
              )} */}
            </>
          )}

        {/* {selectedPopulation &&
          (selectedCurrency ||
            !todaysCountry.currencyData ||
            !currencyChoices) && (
            <>
              <div className="w-full flex justify-center mt-3">
                <ShareButton />
              </div>
              <div className="w-full">
                <WikipediaAndMapsLinks />
              </div>
            </>
          )} */}
      </div>

      {selectedPopulation &&
        (selectedCurrency ||
          !todaysCountry.currencyData ||
          !currencyChoices) && (
          <a
            className="backdrop-blur-sm bg-[#ffffffda] absolute z-50 p-1 text-2xl animate-scaleInOut left-0 right-0 top-28 text-center"
            href="https://www.flagle.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Play{' '}
            <span className="font-bold">
              FLAG<span style={{ color: '#1a76d2' }}>LE</span>
            </span>{' '}
            now!
          </a>
        )}

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
  onSelectAnswer?: (e: string) => void;
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
          <div className="flex-grow pl-2">{title}</div>
        </div>
      </div>
      <div className="flex flex-row flex-wrap w-full justify-center items-start">
        <MultipleChoiceQuiz
          columns={2}
          mobileColumns={1}
          answers={choices}
          correct={correctAnswer}
          onGuess={onSelectAnswer}
          startingGuess={selectedAnswer}
        />
      </div>
    </div>
  );
};

// const BackButtonContainer = styled.div`
//   display: flex;
//   max-width: 512px;
//   padding: 0.4rem;
//   margin-bottom: 1rem;
//   width: 100%;
// `;
