import { useMemo } from 'react';
import styled from 'styled-components';

import { useTodaysCountry } from '../providers/TodaysCountryProvider';
import EmojiRender from './EmojiRender';

export const WikipediaAndMapsLinks = () => {
  const { todaysCountry } = useTodaysCountry();

  const googleMapsUrl = useMemo(() => {
    return todaysCountry.links
      .find((link) => link.type === 'GoogleMaps')
      ?.url.replace('${cc}', 'en');
  }, [todaysCountry.links]);

  const wikipediaUrl = useMemo(() => {
    return todaysCountry.links
      .find((link) => link.type === 'Wikipedia')
      ?.url.replace('${cc}', 'en');
  }, [todaysCountry.links]);

  return (
    <LinksWrapper>
      {googleMapsUrl && (
        <a
          className="underline text-center block mt-4 whitespace-nowrap"
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <EmojiRender text="👀" className="inline-block" /> on Google Maps
        </a>
      )}
      {wikipediaUrl && (
        <a
          className="underline text-center block mt-4 whitespace-nowrap"
          href={wikipediaUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <EmojiRender text="📚" className="inline-block" /> on Wikipedia
        </a>
      )}
    </LinksWrapper>
  );
};

const LinksWrapper = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
`;
