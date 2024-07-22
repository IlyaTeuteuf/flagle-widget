import { useEffect, useRef } from 'react';
import { MobileView } from 'react-device-detect';
import styled from 'styled-components';

import { refreshCompleteAd } from '../utils/ads';

export const AdnginEndMobile0 = () => {
  const adRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    refreshCompleteAd();
  }, []);

  return (
    <MobileView
      style={{
        display: 'none',
        flexDirection: 'column',
        width: '100%',
      }}
    >
      <AdWrapper ref={adRef}>
        <div id="adngin-end_mobile-0"></div>
      </AdWrapper>
    </MobileView>
  );
};

const AdWrapper = styled('div')`
  display: flex;
  margin-top: 1rem;
  margin-bottom: 1rem;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 250;
  min-width: 250;
  max-height: 250;
`;
