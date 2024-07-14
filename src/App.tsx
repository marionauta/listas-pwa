import { lazy } from "react";
import listScreenLoader from "./screens/list/list_screen_loader";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const HomeScreen = lazy(() => import("./screens/home/home_screen"));
const ListScreen = lazy(() => import("./screens/list/list_screen"));

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomeScreen />,
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
