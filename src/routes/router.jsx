import { createBrowserRouter } from "react-router";
import App from "../App";
import Home from "../pages/Home/Home";
import EventsPage from "../features/events/pages/EventsPage/EventsPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import CoverageRequestFormPage from "../features/coverage-requests/pages/CoverageRequestFormPage/CoverageRequestFormPage";
import RequestDetailPage from "../features/coverage-requests/pages/RequestDetailPage/RequestDetailPage";
import LegalDocPage from "../pages/LegalDocPage/LegalDocPage";
import AdminLoginPage from "../features/auth/pages/AdminLoginPage/AdminLoginPage";
import AdminDashboardPage from "../features/coverage-requests/pages/AdminDashboardPage/AdminDashboardPage";
import AdminRequestDetailPage from "../features/coverage-requests/pages/AdminRequestDetailPage/AdminRequestDetailPage";
import AdminEventsPage from "../features/events/pages/AdminEventsPage/AdminEventsPage";
import AdminEventFormPage from "../features/events/pages/AdminEventFormPage/AdminEventFormPage";
import ContactPage from "../features/contact/pages/ContactPage/ContactPage";
import AdminContactMessagesPage from "../features/contact/pages/AdminContactMessagesPage/AdminContactMessagesPage";
import ContactMessageEmptyState from "../features/contact/pages/AdminContactMessagesPage/ContactMessageEmptyState";
import AdminContactMessageDetailPage from "../features/contact/pages/AdminContactMessageDetailPage/AdminContactMessageDetailPage";
import AdminProtectedRoute from "../features/auth/routes/protectedRouter";
import AdminLayout from "../shared/layouts/AdminLayout/AdminLayout";

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
          path: "contacto",
          element: <ContactPage />,
        },
        {
          path: "*",
          element: <NotFoundPage />,
        },
      ],
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
          element: <AdminLayout />,
          children: [
            {
              index: true,
              element: <AdminDashboardPage />,
            },
            {
              path: "requests/:id",
              element: <AdminRequestDetailPage />,
            },
            {
              path: "events",
              element: <AdminEventsPage />,
            },
            {
              path: "events/new",
              element: <AdminEventFormPage />,
            },
            {
              path: "events/:id/edit",
              element: <AdminEventFormPage />,
            },
            {
              path: "contact-messages",
              element: <AdminContactMessagesPage />,
              children: [
                {
                  index: true,
                  element: <ContactMessageEmptyState />,
                },
                {
                  path: ":id",
                  element: <AdminContactMessageDetailPage />,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);
