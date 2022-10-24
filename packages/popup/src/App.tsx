import { BrowserRouter, Route, Routes } from "react-router-dom";

import PageLayout from "./containers/PageLayout/PageLayout";
import { AppProvider } from "./contexts/app";
import { ROUTES } from "./lib/routes";

function App() {
  return (
    <AppProvider>
      <BrowserRouter basename="popup.html">
        <PageLayout>
          <Routes>
            <Route path={ROUTES.HOME.path} element={ROUTES.HOME.element} />
            <Route path={ROUTES.THEME.path} element={ROUTES.THEME.element} />
          </Routes>
        </PageLayout>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
