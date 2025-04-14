import { lazy } from "react";
import { RouteProps } from "react-router-dom";

// Lazy-loaded screens
const Portfolio = lazy(() => import("./portfolio/portfolio"));

// Route config
const ROUTES: RouteProps[] = [{ path: "portfolio", element: <Portfolio /> }];

export default ROUTES;
