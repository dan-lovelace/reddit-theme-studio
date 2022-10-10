import { useEffect, useRef, useState } from "react";

import { Box, Button, InputLabel } from "@mui/material";
import { browser, STORAGE_KEYS } from "@rju/core";
import { TView, TViewInputValue } from "@rju/types";

import { getSaveShortcut, saveListener } from ".";
import CodeEditor from "../CodeEditor";

const { CURRENT_TEMPLATE } = STORAGE_KEYS;

type ViewInputProps = {
  initialState: TViewInputValue;
  view: TView;
};

export default function ViewInput({ initialState, view }: ViewInputProps) {
  const [templateValues, setTemplateValues] =
    useState<TViewInputValue>(initialState);
  const [initialized, setInitialized] = useState<boolean>(false);
  const canSave =
    templateValues.template ||
    !templateValues.partials ||
    templateValues.partials.some((partial) => partial.template);

  // configure a ref for templateValues so the latest value can be accessed
  // within save listener
  const templateValuesRef = useRef<TViewInputValue>();
  templateValuesRef.current = templateValues;

  useEffect(() => {
    async function init() {
      const viewTemplate = CURRENT_TEMPLATE[view];
      const code = await browser.storage.sync.get(viewTemplate);
      if (Object.prototype.hasOwnProperty.call(code, viewTemplate)) {
        setTemplateValues(code[viewTemplate]);
      }

      document.addEventListener("keydown", (event) =>
        saveListener(event, handleSave)
      );
      setInitialized(true);
    }

    init();

    return () => {
      document.removeEventListener("keydown", (event) =>
        saveListener(event, handleSave)
      );
    };
  }, []);

  const handleTemplateChange = (newValue: string) => {
    const newValues = { ...templateValues };
    newValues.template = newValue;

    setTemplateValues(newValues);
  };

  const handlePartialChange = (idx: number) => (newValue: string) => {
    const newValues = { ...templateValues };

    if (!newValues.partials) return;

    newValues.partials[idx].template = newValue;

    setTemplateValues(newValues);
  };

  const handleSave = () => {
    browser.storage.sync.set({
      [CURRENT_TEMPLATE[view]]: templateValuesRef.current,
    });
  };

  return (
    <>
      {initialized && (
        <Box>
          <InputLabel shrink>Layout</InputLabel>
          <CodeEditor
            id="template"
            language="handlebars"
            value={templateValues.template}
            handleChange={handleTemplateChange}
            handleSave={handleSave}
          />
          {templateValues.partials?.map(({ label, name, template }, idx) => (
            <Box key={name}>
              <InputLabel shrink>{label}</InputLabel>
              <CodeEditor
                id={name}
                language="handlebars"
                value={template}
                handleChange={handlePartialChange(idx)}
                handleSave={handleSave}
              />
            </Box>
          ))}
          <Button
            variant="contained"
            fullWidth
            disabled={Boolean(!canSave)}
            onClick={handleSave}
          >
            Apply ({getSaveShortcut()})
          </Button>
        </Box>
      )}
    </>
  );
}
