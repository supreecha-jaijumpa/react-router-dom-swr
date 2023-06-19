import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import BeersPage from "./pages/Beers";

const router = createBrowserRouter([
  {
    path: "/",
    element: <BeersPage />,
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
