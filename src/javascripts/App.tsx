import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
// import produce from 'immer';
import { api } from './api';
import { State as RootState } from './reducer';
import { Header as _Header } from './Header';
import { Column } from './Column';
import { DeleteDialog } from './DeleteDialog';
import { Overlay as _Overlay } from './Overlay';

export function App() {
  // const [filterValue, setFilterValue] = useState('');
  const dispatch = useDispatch();
  // const filterValue = useSelector((state: RootState) => state.filterValue);
  // const setFilterValue = (value: string) => {
  //   dispatch<Action>({
  //     type: 'Filter.SetFilter',
  //     payload: {
  //       value,
  //     },
  //   });
  // };
  // const [{ columns, cardsOrder }, setData] = useState<State>({
  //   cardsOrder: {},
  // });
  const columns = useSelector(
    (state: RootState) => state.columns?.map(v => v.id),
    shallowEqual,
  );
  // const cardsOrder = useSelector(state => state.cardsOrder);
  // const setData = fn => fn({ cardsOrder: {} });

  // const cardIsBeingDeleted = useSelector((state: RootState) =>
  //   Boolean(state.deletingCardID),
  // );
  // // const setDeletingCardID = (cardID: CardID) =>
  // //   dispatch({
  // //     type: 'Card.SetDeletingCard',
  // //     payload: {
  // //       cardID,
  // //     },
  // //   });
  // const cancelDelete = () =>
  //   dispatch({
  //     type: 'Dialog.CacelDelete',
  //   });

  useEffect(() => {
    (async () => {
      const columns = await api('GET /v1/columns', null);
      dispatch({
        type: 'App.SetColumns',
        payload: {
          columns,
        },
      });

      const [unorderedCards, cardsOrder] = await Promise.all([
        api('GET /v1/cards', null),
        api('GET /v1/cardsOrder', null),
      ]);

      dispatch({
        type: 'App.SetCards',
        payload: {
          cards: unorderedCards,
          cardsOrder,
        },
      });
    })();
  }, [dispatch]);

  // const setText = (columnID: ColumnID, value: string) => {
  //   dispatch({
  //     type: 'InputForm.SetText',
  //     payload: {
  //       columnID,
  //       value,
  //     },
  //   });
  // };

  // const addCard = (columnID: ColumnID) => {
  //   const column = columns?.find(c => c.id === columnID);
  //   if (!column) return;

  //   const text = column.text;
  //   const cardID = randomID() as CardID;

  //   const patch = reorderPatch(cardsOrder, cardID, cardsOrder[columnID]);

  //   dispatch({
  //     type: 'InputForm.ConfirmInput',
  //     payload: {
  //       columnID,
  //       cardID,
  //     },
  //   });

  //   api('POST /v1/cards', {
  //     id: cardID,
  //     text,
  //   });
  //   api('PATCH /v1/cardsOrder', patch);
  // };

  // const [draggingCardID, setDraggingCardID] =
  //   useState<CardID | undefined>(undefined);

  // const draggingCardID = useSelector(state => state.draggingCardID);
  // const setDraggingCardID = (cardID: CardID) =>
  //   dispatch({
  //     type: 'Card.StartDragging',
  //     payload: {
  //       cardID,
  //     },
  //   });

  // const dropCardTo = (toID: CardID | ColumnID) => {
  //   const fromID = draggingCardID;
  //   if (!fromID) return;

  //   // setDraggingCardID(undefined);

  //   if (fromID === toID) return;

  //   const patch = reorderPatch(cardsOrder, fromID, toID);
  // setData(
  //   produce((draft: State) => {
  //     draft.cardsOrder = {
  //       ...draft.cardsOrder,
  //       ...patch,
  //     };

  //     const unorderedCards = draft.columns?.flatMap(c => c.cards ?? []) ?? [];
  //     draft.columns?.forEach(column => {
  //       column.cards = sortBy(unorderedCards, draft.cardsOrder, column.id);
  //     });
  //   }),
  // );

  //   dispatch({
  //     type: 'Card.Drop',
  //     payload: {
  //       toID,
  //     },
  //   });

  //   api('PATCH /v1/cardsOrder', patch);
  // };

  return (
    <Container>
      <Header />

      <MainArea>
        <HorizontalScroll>
          {!columns ? (
            <Loading />
          ) : (
            columns.map(id => <Column key={id} id={id} />)
          )}
          ;
        </HorizontalScroll>
      </MainArea>
      <DialogOverlay />
    </Container>
  );
}

function DialogOverlay() {
  const dispatch = useDispatch();
  const cardIsBeingDeleted = useSelector((state: RootState) =>
    Boolean(state.deletingCardID),
  );

  const cancelDelete = () =>
    dispatch({
      type: 'Dialog.CancelDelete',
    });

  if (!cardIsBeingDeleted) {
    return null;
  }

  return (
    <Overlay onClick={cancelDelete}>
      <DeleteDialog />
    </Overlay>
  );
}

const Container = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
`;

const Header = styled(_Header)`
  flex-shrink: 0;
`;

const MainArea = styled.div`
  height: 100%;
  padding: 16px 0;
  overflow-y: auto;
`;

const HorizontalScroll = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow-x: auto;

  > * {
    margin-left: 16px;
    flex-shrink: 0;
  }

  ::after {
    display: block;
    flex: 0 0 16px;
    content: '';
  }
`;

const Loading = styled.div.attrs({
  children: 'Loading...',
})`
  font-size: 14px;
`;

const Overlay = styled(_Overlay)`
  display: flex;
  justify-content: center;
  align-items: center;
`;
