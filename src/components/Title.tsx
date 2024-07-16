import styled from 'styled-components';

export const TitleBarDiv = styled.div<{ justify?: string }>`
  display: flex;
  align-items: center;
  justify-content: ${({ justify = 'center' }) => justify};
`;

export const TitleBar = styled.div`
  display: grid;
  max-width: 376px;
  grid-template-columns: 30px 30px 1fr 30px 30px;
  grid-template-rows: auto 1fr;
  grid-gap: 0.6rem;
  

  /* @media (prefers-color-scheme: dark) {
    color: #fff;
  } */
`;

export const Title = styled.div`
  display: block;
  position: absolute;
  bottom: 0;
  right: 5px;

  color: black;
  font-size: 1rem;
  font-weight: bold;
  span {
    color: #1a76d2;
  }
`;
