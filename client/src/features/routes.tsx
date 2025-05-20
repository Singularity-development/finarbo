import { lazy } from "react";
import { Navigate, RouteProps } from "react-router-dom";

// Lazy-loaded screens
const Portfolio = lazy(() => import("./portfolio/portfolio"));
const Risks = lazy(() => import("./risks/risks"));
const RiskDetail = lazy(() => import("./risks/detail/risk-detail"));
const Login = lazy(() => import("./auth/login"));
const SignUp = lazy(() => import("./auth/signup"));

// Route config
const ROUTES: RouteProps[] = [
  { path: "portfolio", element: <Portfolio /> },
  { path: "risks", element: <Risks /> },
  { path: "risks/:risk", element: <RiskDetail /> },
  { path: "*", element: <Navigate to="/portfolio" replace /> },
];

// Route config
const AUTH_ROUTES: RouteProps[] = [
  { path: "login", element: <Login /> },
  { path: "signup", element: <SignUp /> },
];

const PUBLIC_ROUTES = AUTH_ROUTES;

export { AUTH_ROUTES, PUBLIC_ROUTES };
export default ROUTES;
