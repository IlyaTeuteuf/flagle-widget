import { useMemo, useState } from 'react';
import Select from 'react-select';
import styled, { css } from 'styled-components';

const StyledSelect = styled(Select)`
  margin-top: 5px;
  color: #000;
  :hover {
    border-color: #123456;
  }
  z-index: 500;
`;

const Container = styled.div`
  width: 100%;
  height: 27px;
  /* padding: 0 8px; */
  /* margin-top: 1px; */
  /* margin-bottom: 10px; */
  max-width: 300px;
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

  const customStyles = {
    control: (provided) => ({
      ...provided,
      height: '27px',
      minHeight: '27px',
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: '27px',
      padding: '0 6px',
    }),
    input: (provided) => ({
      ...provided,
      margin: '0px',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: '27px',
    }),
    menuList: (provided) => ({
      ...provided,
      height: '205px',
    }),
  };

  return (
    <Container disabled={disabled}>
      <StyledSelect
        styles={customStyles}
        value={selectedOption}
        options={sortedCountries}
        onChange={handleSubmit}
        placeholder="Guess the flag!"
        isOptionDisabled={() => disabled}
      />
    </Container>
  );
};
