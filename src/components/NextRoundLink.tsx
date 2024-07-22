import React, { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
// import styled from 'styled-components';

// import EmojiRender from './EmojiRender';

export const NextRoundLink: React.FC<PropsWithChildren<{ to: string }>> = ({
  children,
  to,
}) => {
  return (
    // <div className="mb-3 mt-3 absolute bottom-0 animate-slideInUp z-50">
    //   <div className="p-2 w-full flex flex-col justify-center items-center gap-2 rounded-sm animate-reveal">
    //     <div className="p-2 flex flex-col bg-slate-200 w-full text-black rounded-lg">
    //       <div className="w-full flex justify-center items-center mb-2 mt-1 font-bold gap-1">
    //         <EmojiRender text="★" className="inline-block text-orange-700" />
    //         <Title className="text-slate-900">Next Round?</Title>
    //         <EmojiRender text="★" className="inline-block text-orange-700" />
    //       </div>
    //       <Link
    //         className="rounded-md text-md text-white font-bold p-1 text-lg flex w-full gap-2 items-center justify-center uppercase my-0.5 translate"
    //         style={{ backgroundColor: '#1a76d2' }}
    //         to={to}
    //       >
    //         <EmojiRender text="🎁" className="inline-block" />
    //         PLAY BONUS ROUND
    //       </Link>
    //     </div>
    //   </div>
    // </div>

    <div className="absolute bottom-[7px] mx-auto animate-slideInUp font-bold z-50 text-lg text-center bg-white backdrop-blur-sm">
      {children}
      <Link to={to} className="cursor-pointer w-full px-[1.6rem] bg-[#c0dffbda] py-[.6rem] rounded-t-md">
        Next Round?
      </Link>
    </div>

    // <div className="absolute bottom-[-1px] mx-auto animate-slideInUp font-bold z-50 text-lg text-center backdrop-blur-sm bg-[#c0dffbda] py-[.6rem] rounded-t-md">
    //   {children}
    //   <Link to={to} className="cursor-pointer w-full px-[1.6rem] py-[0.6rem]">
    //     Next Round?
    //   </Link>
    // </div>
  );
};

// const Title = styled('div')`
//   display: inline-flex;
//   flex-direction: row;
//   justify-content: center;
//   align-items: center;
//   gap: 0.25rem;

//   @media (prefers-color-scheme: dark) {
//     color: #fff;
//   }
// `;
