import { RouterProvider } from "react-router-dom";

import { router } from "./lib/routes";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
