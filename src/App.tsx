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
import { List } from "./models/List";
import { useConnection } from "./useConnection";

export default function App() {
  const [state, dispatch] = useAppState();

  const items = itemsSelector(state);
  const lists = listsSelector(state);
  const selectedList = selectedListSelector(state);

  const setList = useCallback(
    (list: List | undefined) => {
      dispatch({ type: "ui/list-selected", payload: list });
    },
    [dispatch],
  );

  const unsetList = useCallback(() => {
    setList(undefined);
  }, [setList]);

  const onMessage = useCallback(
    (message: MessageEvent) => {
      const data = JSON.parse(message.data);
      dispatch({ type: data.action, payload: data.payload });
    },
    [dispatch],
  );

  const { sendJsonMessage, readyState, tryReconnect } = useConnection({
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
          items={items}
          listId={selectedList.id}
          closeList={unsetList}
          sendJsonMessage={sendJsonMessage}
          readyState={readyState}
        />
      )}
    </>
  );
}
