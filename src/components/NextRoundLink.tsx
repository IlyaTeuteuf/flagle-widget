import React, { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import EmojiRender from './EmojiRender';

export const NextRoundLink: React.FC<PropsWithChildren<{ to: string }>> = ({
  children,
  to,
}) => {
  return (
    <div className="animate-pop mb-3 mt-3">
      <div className="p-2 w-full flex flex-col justify-center items-center gap-2 rounded-sm animate-reveal">
        <div className="p-2 flex flex-col bg-slate-500 bg-opacity-10 dark:bg-white w-full text-black rounded-lg">
          <div className="w-full flex justify-center items-center mb-2 mt-1 font-bold gap-1">
            <EmojiRender text="★" className="inline-block text-orange-700" />
            <Title>{children}</Title>
            <EmojiRender text="★" className="inline-block text-orange-700" />
          </div>
          <Link
            className="rounded-md text-md text-white font-bold p-1 text-lg flex w-full gap-2 items-center justify-center uppercase my-0.5 translate"
            style={{ backgroundColor: '#1a76d2' }}
            to={to}
          >
            <EmojiRender
              text="🎁"
              className="inline-block"
            />
            PLAY BONUS ROUND
          </Link>
        </div>
      </div>
    </div>
  );
};

const Title = styled('div')`
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;

  @media (prefers-color-scheme: dark) {
    color: #fff;
  }
`;
