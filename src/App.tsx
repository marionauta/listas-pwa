import ItemsScreen from "./ItemsScreen";
import itemsScreenLoader from "./itemsScreenLoader";
import ListsScreen from "./ListsScreen";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <ListsScreen />,
    },
    {
      path: "/list/:listId",
      loader: itemsScreenLoader,
      element: <ItemsScreen />,
    },
  ]);

  return (
    <div className="app-frame">
      <RouterProvider router={router} />
    </div>
  );
}
