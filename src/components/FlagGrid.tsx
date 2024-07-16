import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { getCountryFlagSvgUrl } from '../api/fetchDataFromCDN';

const DELAY_TIME = 0.5;
const FLAG_WIDTH = 150;

const Grid = styled.div<{ end?: boolean }>`
  transition: 1s;
  transition-delay: ${DELAY_TIME}s;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr;
  grid-gap: ${(props) => (props.end ? '0px' : '2px')};
  width: fit-content;
`;

const TileFront = styled.div`
  width: 100%;
  height: 100%;
  justify-content: center;
  background: #dddddd;
  backface-visibility: hidden;
  position: absolute;
  top: 0;
`;

const TileBack = styled.div`
  transition: 1s;
  transition-delay: ${DELAY_TIME}s;
  width: 100%;
  height: 100%;
  justify-content: center;
  background: #ffffff;
  backface-visibility: hidden;
  position: absolute;
  transform: rotateY(180deg);
  top: 0;
  overflow: hidden;
  @media (prefers-color-scheme: dark) {
    background: #121212;
  }
`;

const Tile = styled.div<{
  height: number;
  rotate: string;
}>`
  transition: transform 1s;
  transform-style: preserve-3d;
  display: flex;
  justify-content: center;
  padding: ${(props) =>
    `${props.height ? `${props.height / 2}px` : '2rem'} ${Math.floor(
      FLAG_WIDTH / 6,
    )}px`};
  position: relative;
  transform: ${(props) =>
    props.rotate === 'true' ? 'rotateY(180deg)' : 'rotateY(0deg)'};
`;

const FlagImage = styled.img<{
  flag: string;
  left: number;
  top: number;
}>`
  content: url(${(props) => props.flag});
  position: relative;
  width: ${FLAG_WIDTH}px;
  left: ${(props) => `${props.left}px`};
  top: ${(props) => `${props.top}px`};
  max-width: unset;
  height: ${(props) => `${props.height}px`};
`;

const FlagContainer = styled.div`
  display: flex;
  align-items: center;
  width: ${FLAG_WIDTH}px;
  min-height: ${(FLAG_WIDTH * 2) / 3}px; // 3:2 aspect ratio
  margin: 10px 0;
`;

export function FlagGrid({
  end,
  countryInfo,
  flippedArray,
}: {
  end: boolean;
  countryInfo: { code: string };
  flippedArray: boolean[];
}) {
  const [flagLoad, setFlagLoad] = useState(false);
  const [scaledFlagHeight, setScaledFlagHeight] = useState(0);

  useEffect(() => {
    // create invisible element to get accurate flag height
    const img = new Image();
    img.src = getCountryFlagSvgUrl(countryInfo.code);
    img.width = FLAG_WIDTH;
    img.style.visibility = 'hidden';
    img.onload = () => {
      setScaledFlagHeight(img.height);
      setFlagLoad(true);
      img.remove();
    };
    document.body.appendChild(img);
    return () => {
      img.onload = null;
      img.remove();
    };
  }, [countryInfo]);

  return (
    <FlagContainer>
      {flagLoad ? (
        <Grid end={end}>
          {flippedArray.map((flipped, n) => (
            <Tile
              key={n}
              rotate={flipped && flagLoad ? 'true' : 'false'}
              height={scaledFlagHeight / 2}
            >
              <TileFront></TileFront>
              <TileBack>
                <FlagImage
                  flag={getCountryFlagSvgUrl(countryInfo.code)}
                  width={FLAG_WIDTH}
                  left={-Math.floor((n % 3) * (FLAG_WIDTH / 3))}
                  top={-((Math.floor(n / 3) * scaledFlagHeight) / 2)}
                ></FlagImage>
              </TileBack>
            </Tile>
          ))}
        </Grid>
      ) : null}
    </FlagContainer>
  );
}
