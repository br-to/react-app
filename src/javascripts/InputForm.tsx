import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { randomID, reorderPatch } from './util';
import { api, CardID, ColumnID } from './api';
import * as color from './color';
import { Button, ConfirmButton } from './Button';
import { State as RootState } from './reducer';

// value: 表示する値
// onChange, onConfirm, onCancel イベントを受け取るハンドラー関数
export function InputForm({
  columnID,
  onCancel,
  className,
}: {
  columnID: ColumnID;
  onCancel?(): void;
  className?: string;
}) {
  const dispatch = useDispatch();
  const value = useSelector(
    (state: RootState) => state.columns?.find(c => c.id === columnID)?.text,
  );
  const cardsOrder = useSelector((state: RootState) => state.cardsOrder);

  const onChange = (value: string) =>
    dispatch({
      type: 'InputForm.SetText',
      payload: {
        columnID,
        value,
      },
    });
  const disabled = !value?.trim();
  const handleConfirm = () => {
    if (disabled) return;
    const text = value;

    const cardID = randomID() as CardID;

    const patch = reorderPatch(cardsOrder, cardID, cardsOrder[columnID]);

    dispatch({
      type: 'InputForm.ConfirmInput',
      payload: {
        columnID,
        cardID,
      },
    });

    api('POST /v1/cards', {
      id: cardID,
      text,
    });
    api('PATCH /v1/cardsOrder', patch);
  };

  const ref = useAutoToContentHeight(value);

  return (
    <Container className={className}>
      <Input
        ref={ref}
        autoFocus
        placeholder="Enter a note"
        value={value}
        onChange={e => onChange(e.currentTarget.value)}
        onKeyDown={e => {
          if (!((e.metaKey || e.ctrlKey) && e.key === 'Enter')) return;
          handleConfirm();
        }}
      />

      <ButtonRow>
        <AddButton disabled={disabled} onClick={handleConfirm} />
        <CancelButton onClick={onCancel} />
      </ButtonRow>
    </Container>
  );
}

const useAutoToContentHeight = (content: string | undefined) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { borderTopWidth, borderBottomWidth } = getComputedStyle(el);
    el.style.height = 'auto';
    el.style.height = `calc(${borderTopWidth} + ${el.scrollHeight}px + ${borderBottomWidth})`;
  }, [content]);

  return ref;
};

const Container = styled.div``;

const Input = styled.textarea`
  display: block;
  width: 98%;
  margin-bottom: 8px;
  border: solid 1px ${color.Silver};
  border-radius: 3px;
  background-color: ${color.White};
  font-size: 14px;
  line-height: 1.7;

  :focus {
    outline: none;
    border-color: ${color.Blue};
  }
`;

const ButtonRow = styled.div`
  display: flex;

  > :not(:first-child) {
    margin-left: 8px;
  }
`;

const AddButton = styled(ConfirmButton).attrs({
  children: 'Add',
})``;

const CancelButton = styled(Button).attrs({
  children: 'Cancel',
})``;
