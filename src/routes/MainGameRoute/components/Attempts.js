import styled from 'styled-components';

export const Attempts = styled(({ attempts, max, ...props }) => (
  <div {...props}>
    🤔
    <br />
    <span>
      {attempts}/{max}
    </span>
  </div>
))`
  display: block;
  font-size: 1em;
  position: absolute;
  top: 37px;
  right: 5px;
  /* color: black; */
  border-radius: 10px;
  padding: 3px 5px;
  background: #ddd;
  span {
    font-weight: bold;
  }
  /* @media (prefers-color-scheme: dark) {
    color: #fff;
  } */
`;
