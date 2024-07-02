import './App.css';
import 'react-toastify/dist/ReactToastify.css';

import Button from '@mui/material/Button';
import { lazy, Suspense, useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Flip, ToastContainer } from 'react-toastify';
import styled from 'styled-components';

import EmojiRender from './components/EmojiRender';
import { HowToModal } from './components/HowToModal';
import { NextRoundLink } from './components/NextRoundLink';
import { SettingsLinkIcon } from './components/SettingsLinkIcon';
import { StatsModal } from './components/StatsModal';
import { Title, TitleBar, TitleBarDiv } from './components/Title';
import { getDayString } from './hooks/useDailySeed';
import { useMainGameCompleted } from './hooks/useMainGameCompleted';
import { TodaysCountryProvider } from './providers/TodaysCountryProvider';
import { MainGameRoute } from './routes/MainGameRoute/MainGameRoute';
import { SettingsRoute } from './routes/SettingsRoute';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ReactComponent: AngleIcon } = require('./angle_favicon.svg');

const CentreWrapper = styled.div`
  margin: 0;
  overflow: auto;
  padding: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;

  @media (prefers-color-scheme: dark) {
    background-color: #121212;
  }
`;

const AdContainer = styled.div`
  width: 100%;
  margin-top: auto;
  margin-bottom: 10px;
  bottom: 0px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  @media (prefers-color-scheme: dark) {
    color: #fff;
  }
`;

const GameButton = styled(Button)`
  span {
    font-weight: bold;
    text-transform: none;
  }
`;

const GamesContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
`;

const LazyFirstBonusRoundRoute = lazy(() =>
  import(
    /* webpackChunkName: "FirstBonusRoundRoute", webpackPreload: true */ './routes/ShapeGameRoute'
  ).then((module) => ({
    default: module.ShapeGameRoute,
  })),
);

const LazySecondBonusRoundRoute = lazy(() =>
  import(
    /* webpackChunkName: "LazySecondBonusRoundRoute", webpackPreload: true */ './routes/CapitalFlagGameRoute'
  ).then((module) => ({
    default: module.CapitalFlagGameRoute,
  })),
);

const LazyThirdBonusRoundRoute = lazy(() =>
  import(
    /* webpackChunkName: "LazyThirdBonusRoundRoute", webpackPreload: true */ './routes/BorderFlagGameRoute'
  ).then((module) => ({
    default: module.BorderFlagGameRoute,
  })),
);

const LazyFourthBonusRoundRoute = lazy(() =>
  import(
    /* webpackChunkName: "FourthBonusRoundRoute", webpackPreload: true */ './routes/QuizGameRoute/QuizGameRoute'
  ).then((module) => ({
    default: module.QuizGameRoute,
  })),
);

/**** MJD - ADDED THIS TO SUPPORT BONUS ROUND FIX *****/

const startDate = getDayString();

window &&
  window.setInterval(() => {
    const currentDate = getDayString();
    if (startDate !== currentDate) {
      window.dispatchEvent(new CustomEvent('date-changed'));
    }
  }, 1000);

const refreshPage = () => {
  window && (window.location.href = '/');
};

/**** MJD - ADDED THIS TO SUPPORT BONUS ROUND FIX END  *****/

export function App() {
  const mainGameCompleted = useMainGameCompleted();
  /**** MJD - ADDED THIS TO SUPPORT BONUS ROUND FIX *****/
  useEffect(() => {
    window.addEventListener('date-changed', refreshPage);
    return () => {
      window.removeEventListener('date-changed', refreshPage);
    };
  }, []);
  /**** MJD - ADDED THIS TO SUPPORT BONUS ROUND FIX END *****/

  return (
    <div className="App">
      <ToastContainer
        hideProgressBar
        position="top-center"
        transition={Flip}
        autoClose={false}
      />
      <CentreWrapper className="App-Center">
        <TodaysCountryProvider>
          <TitleBar>
            <TitleBarDiv />
            <TitleBarDiv justify="flex-end">
              <HowToModal />
            </TitleBarDiv>
            <Title>
              FLAG<span>LE</span>
            </Title>
            <TitleBarDiv>
              <StatsModal />
            </TitleBarDiv>
            <TitleBarDiv>
              <SettingsLinkIcon />
            </TitleBarDiv>
          </TitleBar>

          <Suspense fallback="loading next bonus round…">
            <Switch>
              <Route exact path="/">
                <MainGameRoute />
              </Route>

              <Route exact path="/bonus-round/1">
                {mainGameCompleted ? (
                  <LazyFirstBonusRoundRoute />
                ) : (
                  <Redirect to="/" />
                )}
              </Route>

              <Route exact path="/bonus-round/2">
                {mainGameCompleted ? (
                  <LazySecondBonusRoundRoute />
                ) : (
                  <Redirect to="/" />
                )}
              </Route>

              <Route exact path="/bonus-round/3">
                {mainGameCompleted ? (
                  <LazyThirdBonusRoundRoute />
                ) : (
                  <Redirect to="/" />
                )}
              </Route>

              <Route exact path="/bonus-round/4">
                {mainGameCompleted ? (
                  <LazyFourthBonusRoundRoute />
                ) : (
                  <Redirect to="/" />
                )}
              </Route>

              <Route exact path="/settings">
                <SettingsRoute />
              </Route>

              <Route>
                <NextRoundLink to="/">Home</NextRoundLink>
              </Route>
            </Switch>
          </Suspense>
        </TodaysCountryProvider>

        <AdContainer>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSe-UDln8IMcm53NHYPt2m_a0XDyW1b6SCt8d-wxEmqYcMxYqw/viewform"
            target="_blank"
            rel="noreferrer"
            style={{ marginTop: '15px', textDecoration: 'underline' }}
          >
            Submit Feedback
          </a>
          <div className="flex gap-1 justify-center items-center mt-2 w-full">
            <a
              href="https://www.facebook.com/teuteufgames/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/images/icons/facebook.png"
                width={36}
                height={36}
                alt="facebook"
              />
            </a>
            <a
              href="https://twitter.com/Worldle_Game"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/images/icons/twitter.png"
                width={36}
                height={36}
                alt="twitter"
              />
            </a>
            <a
              href="https://www.instagram.com/teuteufgames"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/images/icons/instagram.png"
                width={31}
                height={31}
                alt="instagram"
              />
            </a>
          </div>
          <div>Our other games:</div>
          <GamesContainer>
            <GameButton
              variant="outlined"
              onClick={() => {
                window.open('https://angle.wtf');
              }}
            >
              <AngleIcon width="12" />
              &nbsp;
              <span>Angle</span>
            </GameButton>
            <GameButton
              variant="outlined"
              onClick={() => {
                window.open('https://worldle.teuteuf.fr');
              }}
            >
              <EmojiRender text="🌍" className="inline-block" />
              &nbsp;
              <span>Worldle</span>
            </GameButton>
            <GameButton
              variant="outlined"
              onClick={() => {
                window.open('https://wheretakenusa.teuteuf.fr');
              }}
            >
              <EmojiRender text="🌍" className="inline-block" />
              &nbsp;
              <span>WhereTaken</span>
            </GameButton>
          </GamesContainer>
        </AdContainer>

        <AdWrapperWrapper className="snigel-sidev">
          <AdWrapper>
            <div id="adngin-sidebar_left-0"></div>
          </AdWrapper>
        </AdWrapperWrapper>
      </CentreWrapper>
    </div>
  );
}

const AdWrapperWrapper = styled('div')`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 200;
`;

const AdWrapper = styled('div')`
  position: sticky;
  padding: 20px 40px 20px 20px;
  pointer-events: all;
`;
