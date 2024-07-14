import ListScreen from "./screens/list_screen";
import listScreenLoader from "./screens/list_screen_loader";
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
      loader: listScreenLoader,
      element: <ListScreen />,
    },
  ]);

  return (
    <div className="app-frame">
      <RouterProvider router={router} />
    </div>
  );
}
