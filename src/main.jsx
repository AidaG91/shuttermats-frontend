import { createRoot } from "react-dom/client";
import "./styles/main.scss";
import { RouterProvider } from "react-router";
import { router } from "./config/router.jsx";
import { ReadingProvider } from "./context/ReadingContext.jsx";

createRoot(document.getElementById("root")).render(
  <ReadingProvider>
    <RouterProvider router={router} />
  </ReadingProvider>,
);
