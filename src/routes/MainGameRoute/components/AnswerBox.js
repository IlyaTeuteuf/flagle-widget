import { useMemo, useState } from 'react';
import Select from 'react-select';
import styled, { css } from 'styled-components';

const StyledSelect = styled(Select)`
  color: #000;
  :hover {
    border-color: #123456;
  }
`;

const Container = styled.div`
  width: 100%;
  height: 38px;
  padding: 0 8px;
  margin-bottom: 1rem;
  max-width: 376px;
  transition:
    transform 0.4s ease-in-out,
    height 0.5s ease-in-out;

  ${(props) =>
    props.disabled &&
    css`
      transform: scale(0);
      height: 0;
    `}
`;

export const AnswerBox = ({ disabled, countries, onGuess }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSubmit = (guess) => {
    onGuess(guess.value);
    setSelectedOption(null);
  };

  const sortedCountries = useMemo(
    () => countries.sort().map((val) => ({ label: val, value: val })),
    [countries],
  );

  return (
    <Container disabled={disabled}>
      <StyledSelect
        value={selectedOption}
        options={sortedCountries}
        onChange={handleSubmit}
        placeholder="Guess the flag!"
        isOptionDisabled={() => disabled}
      />
    </Container>
  );
};
