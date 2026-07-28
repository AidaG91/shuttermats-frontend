import { createBrowserRouter } from "react-router";
import App from "../App";
import Home from "../pages/Home/Home";
import EventsPage from "../pages/EventsPage/EventsPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import CoverageRequestFormPage from "../pages/CoverageRequestFormPage/CoverageRequestFormPage";
import RequestDetailPage from "../pages/RequestDetailPage/RequestDetailPage";
import LegalDocPage from "../pages/LegalDocPage/LegalDocPage";
import AdminLoginPage from "../pages/AdminLoginPage/AdminLoginPage";
import AdminDashboardPage from "../pages/AdminDashboardPage/AdminDashboardPage";
import AdminProtectedRoute from "./protectedRouter";

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
          path: "requests/:id",
          element: <RequestDetailPage />,
        },
        {
          path: "legal/:slug",
          element: <LegalDocPage />,
        },
        {
          path: "admin/login",
          element: <AdminLoginPage />,
        },
        {
          path: "admin",
          element: <AdminProtectedRoute />,
          children: [
            {
              index: true,
              element: <AdminDashboardPage />,
            },
          ],
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
