import React, { useState } from 'react';
import styled from 'styled-components';
import * as color from './color';
import { Card } from './Card';
import { PlusIcon } from './icon';
import { InputForm as _InputForm } from './InputForm';

export function Column({
  title,
  filterValue: rawFilterValue,
  cards: rawCards,
  onCardDragStart,
  onCardDrop,
  onCardDeleteClick,
  text,
  onTextChange,
  onTextConfirm,
  onTextCancel,
}: {
  title?: string;
  filterValue?: string;
  cards?: {
    id: string;
    text?: string;
  }[];
  onCardDragStart?(id: string): void;
  onCardDrop?(entered: string | null): void;
  onCardDeleteClick?(id: string): void;
  text?: string;
  onTextChange?(value: string): void;
  onTextConfirm?(): void;
  onTextCancel?(): void;
}) {
  // rawFilterValueの前後の空白を取り除く
  const filterValue = rawFilterValue?.trim();
  // 検索結果空白排除
  const keywords = filterValue?.toLowerCase().split(/\s+/g) ?? [];

  console.log(`key ${keywords}`);
  const cards = rawCards?.filter(({ text }) =>
    keywords?.every(word => text?.toLowerCase().includes(word)),
  );

  // 各column内のcardの個数
  const totalCount = rawCards?.length;

  // inputForm入力あるたびにonChangeに入れたsetTextを呼ぶ
  // textはColumnコンポーネントのstate
  // const [text, setText] = useState('');
  // inputMode InputForm の表示・非表示を制御しています。
  const [inputMode, setInputMode] = useState(false);
  // 現在の値から次の値を算出する関数を渡す
  const toggleInput = () => setInputMode((value: boolean) => !value);
  // const confirmInput = () => setText('');
  // const cancelInput = () => setInputMode(false);

  const confirmInput = () => {
    onTextConfirm?.();
  };
  const cancelInput = () => {
    setInputMode(false);
    onTextCancel?.();
  };

  const [draggingCardID, setDraggingCardID] =
    useState<string | undefined>(undefined);

  const handleCardDragStart = (id: string) => {
    setDraggingCardID(id);
    onCardDragStart?.(id);
  };
  return (
    <Container>
      <Header>
        {totalCount >= 0 && <CountBadge>{totalCount}</CountBadge>}
        <ColumnName>{title}</ColumnName>

        <AddButton onClick={toggleInput} />
      </Header>

      {inputMode && (
        <InputForm
          value={text}
          onChange={onTextChange}
          onConfirm={confirmInput}
          onCancel={cancelInput}
        />
      )}

      {!cards ? (
        <Loading />
      ) : (
        <>
          {filterValue && <ResultCount>{cards.length} results</ResultCount>}

          <VerticalScroll>
            {cards.map(({ id, text }, i) => (
              <Card.DropArea
                key={id}
                disabled={
                  draggingCardID !== undefined &&
                  (id === draggingCardID || cards[i - 1]?.id === draggingCardID)
                }
                onDrop={() => onCardDrop?.(id)}
              >
                <Card
                  text={text}
                  onDragStart={() => handleCardDragStart(id)}
                  onDragEnd={() => setDraggingCardID(undefined)}
                  onDeleteClick={() => onCardDeleteClick?.(id)}
                />
              </Card.DropArea>
            ))}

            <Card.DropArea
              style={{ height: '100%' }}
              disabled={
                draggingCardID !== undefined &&
                cards[cards.length - 1]?.id === draggingCardID
              }
              onDrop={() => onCardDrop?.(null)}
            />
          </VerticalScroll>
        </>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-flow: column;
  width: 355px;
  height: 100%;
  border: solid 1px ${color.Silver};
  border-radius: 6px;
  background-color: ${color.LightSilver};

  > :not(:last-child) {
    flex-shrink: 0;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 8px;
`;

const CountBadge = styled.div`
  margin-right: 8px;
  border-radius: 20px;
  padding: 2px 6px;
  color: ${color.Black};
  background-color: ${color.Silver};
  font-size: 12px;
  line-height: 1;
`;

const ColumnName = styled.div`
  color: ${color.Black};
  font-size: 14px;
  font-weight: bold;
`;

const AddButton = styled.button.attrs({
  type: 'button',
  children: <PlusIcon />,
})`
  margin-left: auto;
  color: ${color.Black};

  :hover {
    color: ${color.Blue};
  }
`;

// InputFormのstyleを変えるために_InputFormで呼び出している
const InputForm = styled(_InputForm)`
  padding: 8px;
`;

const Loading = styled.div.attrs({
  children: 'Loading...',
})`
  padding: 8px;
  font-size: 14px;
`;

const ResultCount = styled.div`
  color: ${color.Black};
  font-size: 12px;
  text-align: center;
`;

const VerticalScroll = styled.div`
  height: 100%;
  padding: 8px;
  overflow-y: auto;
  flex: 1 1 auto;

  > :not(:first-child) {
    margin-top: 8px;
  }
`;
