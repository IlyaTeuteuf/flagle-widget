import styled from 'styled-components';

import { useDailyCountryName } from '../hooks/useDailyCountryName';
import EmojiRender from './EmojiRender';

export const WikipediaAndMapsLinks = () => {
  const dailyCountryName = useDailyCountryName();

  return (
    <LinksWrapper>
      <a
        className="underline text-center block mt-4 whitespace-nowrap"
        href={`https://www.google.com/maps?q=${dailyCountryName}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <EmojiRender
          text="👀"
          className="inline-block"
        />{' '}
        on Google Maps
      </a>
      <a
        className="underline text-center block mt-4 whitespace-nowrap"
        href={`https://en.wikipedia.org/wiki/${dailyCountryName}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <EmojiRender
          text="📚"
          className="inline-block"
        />{' '}
        on Wikipedia
      </a>
    </LinksWrapper>
  );
};

const LinksWrapper = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
`;
