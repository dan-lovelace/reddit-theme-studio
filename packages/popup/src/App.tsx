import { useState } from "react";

import "./App.css";
import StyleInput from "./components/StyleInput";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <StyleInput />
    </div>
  );
}

export default App;
