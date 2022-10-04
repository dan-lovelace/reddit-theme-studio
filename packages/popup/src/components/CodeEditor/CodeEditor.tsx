import { Box } from "@mui/material";
import { highlight, languages } from "prismjs";
import Editor from "react-simple-code-editor";
import "prismjs/themes/prism.css";

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
        highlight={(code) => highlight(code, languages[language], language)}
        padding={10}
      />
    </Box>
  );
}
