import { useEffect } from "react";

import { Box, useMediaQuery } from "@mui/material";
import hljs from "highlight.js/lib/core";
import css from "highlight.js/lib/languages/css";
import handlebars from "highlight.js/lib/languages/handlebars";
import xml from "highlight.js/lib/languages/xml";
import Editor from "react-simple-code-editor";

hljs.registerLanguage("css", css);
hljs.registerLanguage("handlebars", handlebars);
hljs.registerLanguage("xml", xml);

type CodeEditorProps = {
  language: string;
  value: string;
  handleChange: (value: string) => void;
};

export default function CodeEditor({
  language,
  value,
  handleChange,
}: CodeEditorProps) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  useEffect(() => {
    async function setStyle() {
      if (prefersDarkMode) {
        await import("highlight.js/styles/a11y-dark.css");
      } else {
        await import("highlight.js/styles/a11y-light.css");
      }
    }

    setStyle();
  }, []);

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "primary.main",
        borderRadius: 1,
        mb: 1,
      }}
    >
      <Editor
        autoFocus
        className="code-editor"
        value={value}
        onValueChange={handleChange}
        highlight={(code) => hljs.highlight(code, { language }).value}
        padding={10}
      />
    </Box>
  );
}
