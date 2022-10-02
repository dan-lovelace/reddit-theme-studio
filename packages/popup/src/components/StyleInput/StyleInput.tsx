import { useState } from "react";

import { browser } from "@rju/core";
import { highlight, languages } from "prismjs";
import Editor from "react-simple-code-editor";
import "prismjs/themes/prism.css";

const testValue = `.post-result__title {
  border: 1px solid red;
}`;

export default function StyleInput() {
  const [value, setValue] = useState<string>(testValue);

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  const handleSave = () => {
    browser.runtime.sendMessage(value);
  };

  return (
    <div>
      <Editor
        value={value}
        onValueChange={handleChange}
        highlight={(code) => highlight(code, languages.css, "css")}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
        }}
      />
      <button onClick={handleSave}>Apply</button>
    </div>
  );
}
