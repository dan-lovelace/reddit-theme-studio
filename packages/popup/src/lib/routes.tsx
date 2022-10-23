import { createBrowserRouter, RouteObject } from "react-router-dom";

import HomePage from "../containers/HomePage";
import ThemePage from "../containers/ThemePage";

type Route = RouteObject & {
  path: string;
};

export const ROUTES: { [key: string]: Route } = {
  HOME: {
    path: "/",
    element: <HomePage />,
  },
  THEME: {
    path: "/theme",
    element: <ThemePage />,
  },
};

const routes = Object.keys(ROUTES).map((r) => ROUTES[r]);

export const router = createBrowserRouter(routes, {
  basename: "/popup.html",
});
