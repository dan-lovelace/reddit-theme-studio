import { useEffect, useState } from "react";

import { browser, STORAGE_KEYS } from "@rju/core";
import { highlight, languages } from "prismjs";
import Editor from "react-simple-code-editor";
import "prismjs/themes/prism.css";

export default function StyleInput() {
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    async function init() {
      const style = await browser.storage.sync.get(STORAGE_KEYS.CURRENT_STYLE);

      if (
        Object.prototype.hasOwnProperty.call(style, STORAGE_KEYS.CURRENT_STYLE)
      ) {
        setValue(style[STORAGE_KEYS.CURRENT_STYLE]);
      }
    }

    init();
  }, []);

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  const handleSave = () => {
    browser.runtime.sendMessage({ action: "update-style", value });
    browser.storage.sync.set({
      [STORAGE_KEYS.CURRENT_STYLE]: value,
    });
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
          marginBottom: "1rem",
        }}
      />
      <button onClick={handleSave}>Apply</button>
    </div>
  );
}
