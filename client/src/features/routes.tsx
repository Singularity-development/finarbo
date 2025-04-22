import { lazy } from "react";
import { RouteProps } from "react-router-dom";

// Lazy-loaded screens
const Portfolio = lazy(() => import("./portfolio/portfolio"));
const Risks = lazy(() => import("./risks/risks"));
const RiskDetail = lazy(() => import("./risks/detail/risk-detail"));

// Route config
const ROUTES: RouteProps[] = [
  { path: "portfolio", element: <Portfolio /> },
  { path: "risks", element: <Risks /> },
  { path: "risks/:risk", element: <RiskDetail /> },
];

export default ROUTES;
