import { useCallback } from "react";
import {
  useAppState,
  itemsSelector,
  listsSelector,
  selectedListSelector,
} from "./AppState";
import { ConnectionBanner } from "./components/ConnectionBanner";
import ItemsScreen from "./ItemsScreen";
import ListsScreen from "./ListsScreen";
import { ItemList, List } from "./models/List";
import { useConnection } from "./useConnection";

export default function App() {
  const { state, dispatch, selectedList, sendJsonMessage } = useAppState();

  const lists = listsSelector(state);

  const setList = useCallback(
    (list: List | undefined) => {
      dispatch({ type: "ui/list-selected", payload: list });
    },
    [dispatch],
  );

  const unsetList = useCallback(() => {
    // setList(undefined);
  }, [setList]);

  const onMessage = useCallback(
    (message: MessageEvent) => {
      const data = JSON.parse(message.data);
      dispatch({ type: data.action, payload: data.payload });
    },
    [dispatch],
  );

  const { readyState, tryReconnect } = useConnection({
    onMessage,
  });

  return (
    <>
      <ConnectionBanner readyState={readyState} tryReconnect={tryReconnect} />
      {selectedList === undefined ? (
        <ListsScreen
          lists={lists}
          setList={setList}
          sendJsonMessage={sendJsonMessage}
          readyState={readyState}
        />
      ) : (
        <ItemsScreen
          items={selectedList.items}
          listId={""}
          closeList={unsetList}
          sendJsonMessage={sendJsonMessage}
          readyState={readyState}
        />
      )}
    </>
  );
}
