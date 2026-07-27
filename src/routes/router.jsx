import { createBrowserRouter } from "react-router";
import App from "../App";
import Home from "../pages/Home/Home";
import EventsPage from "../pages/EventsPage/EventsPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import CoverageRequestFormPage from "../pages/CoverageRequestFormPage/CoverageRequestFormPage";

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
          path: "events",
          element: <EventsPage />,
        },
        {
          path: "events/:eventId/request",
          element: <CoverageRequestFormPage />,
        },
        {
          path: "*",
          element: <NotFoundPage />,
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);
