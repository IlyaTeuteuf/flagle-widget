import { ReactNode } from 'react';
import styled from 'styled-components';

const AttemptsLeft = styled.div<{ top: number }>`
  display: block;
  font-size: 1em;
  position: absolute;
  top: ${(props) => props.top}px;
  right: 5px;
  border-radius: 10px;
  padding: 3px 5px;
  background: #ddd;
  span {
    font-weight: bold;
  }
`;

const AttemptsLeftComponent = ({
  children,
  inlineEmoji = false,
  top = 40
}: {
  children: ReactNode;
  inlineEmoji?: boolean;
  top?: number
}) => (
  <AttemptsLeft top={top}>
    🤔
    {!inlineEmoji && <br />}
    <span>{children}</span>
  </AttemptsLeft>
);

export default AttemptsLeftComponent;
