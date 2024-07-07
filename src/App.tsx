import { useCallback } from "react";
import { useAppState, listsSelector } from "./AppState";
import ItemsScreen, { loader as itemsLoader } from "./ItemsScreen";
import ListsScreen from "./ListsScreen";
import { List } from "./models/List";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

export default function App() {
  const { state, dispatch, sendJsonMessage } = useAppState();

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

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ListsScreen
          lists={lists}
          setList={setList}
          sendJsonMessage={sendJsonMessage}
        />
      ),
    },
    {
      path: "/list/:listId",
      loader: itemsLoader,
      element: (
        <ItemsScreen closeList={unsetList} sendJsonMessage={sendJsonMessage} />
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}
