import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import * as color from './color';
import { SearchIcon as _SearchIcon } from './icon';
import { State as RootState } from './reducer';

export function CardFilter() {
  const dispatch = useDispatch();
  const value = useSelector((state: RootState) => state.filterValue);
  const onChange = (value: string) =>
    dispatch({
      type: 'Filter.SetFilter',
      payload: {
        value,
      },
    });

  return (
    <Container>
      <SearchIcon />
      <Input
        placeholder="Filter cards"
        value={value}
        onChange={e => onChange(e.currentTarget.value)}
      />
    </Container>
  );
}

const Container = styled.label`
  display: flex;
  align-items: center;
  min-width: 300px;

  border-radius: 3px;
`;

const SearchIcon = styled(_SearchIcon)`
  margin: 0 4px 0 8px;
  font-size: 16px;
  color: ${color.White};
`;

const Input = styled.input.attrs({ type: 'search' })`
  width: 100%;
  padding: 6px 8px 6px 0;
  color: ${color.Black};
  font-size: 14px;

  :focus {
    outline: none;
  }
`;
