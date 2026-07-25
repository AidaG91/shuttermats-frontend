import { createBrowserRouter } from "react-router";
import App from "../App";
import Home from "../pages/Home/Home";
import EventsPage from "../pages/EventsPage/EventsPage";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/events",
          element: <EventsPage />
        }
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);