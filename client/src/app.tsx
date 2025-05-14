import { Suspense, useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import PageLoading from "./components/screens/page-loading";
import Page404 from "./components/screens/page-404";
import { useDocumentTitle } from "./common/hooks/useDocumentTitle";
import ROUTES from "./features/routes";
import RootLayout from "./layout/root-layout";

const App = () => {
  useDocumentTitle();

  const routes = useMemo(
    () =>
      ROUTES.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      )),
    []
  );

  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          {routes}
        </Route>

        <Route path="*" element={<Page404 />} />
      </Routes>
    </Suspense>
  );
};

export default App;
