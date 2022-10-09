import { useEffect, useState } from "react";

import { Box, Button, InputLabel } from "@mui/material";
import { browser, STORAGE_KEYS } from "@rju/core";
import { TView } from "@rju/types";

import CodeEditor from "../CodeEditor";

const { CURRENT_TEMPLATE, SELECTED_VIEW } = STORAGE_KEYS;

const initialState = {
  template: "",
  partials: [],
};

type Subreddit = {
  template: string;
  partials: {
    label: string;
    name: string;
    template: string;
  }[];
};

export default function Subreddit() {
  const [templateValues, setTemplateValues] = useState<Subreddit>(initialState);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [viewValue, setViewValue] = useState<TView>("subreddit");
  const canSave =
    templateValues.template ||
    templateValues.partials.some((partial) => partial.template);

  useEffect(() => {
    async function init() {
      let newViewValue: TView = "subreddit";
      const view: Record<string, TView> = await browser.storage.sync.get(
        SELECTED_VIEW
      );
      if (Object.prototype.hasOwnProperty.call(view, SELECTED_VIEW)) {
        newViewValue = view[SELECTED_VIEW];
        setViewValue(newViewValue);
      } else {
        newViewValue = "subreddit";
      }

      const viewTemplate = CURRENT_TEMPLATE[newViewValue];
      console.log("view", view);
      console.log("viewTemplate", viewTemplate);
      const code = await browser.storage.sync.get(viewTemplate);
      console.log("code", code);
      if (Object.prototype.hasOwnProperty.call(code, viewTemplate)) {
        setTemplateValues(code[viewTemplate]);
      }

      setInitialized(true);
    }

    init();
  }, []);

  const handleTemplateChange = (id: string) => (newValue: string) => {
    setTemplateValues({
      ...templateValues,
      [id]: newValue,
    });
  };

  const handlePartialChange = (idx: number) => (newValue: string) => {
    const newValues = { ...templateValues };

    newValues.partials[idx].template = newValue;

    setTemplateValues(newValues);
  };

  const handleSave = () => {
    // content window listens for and acts upon storage changes so there's no
    // need to send a message
    browser.storage.sync.set({
      [CURRENT_TEMPLATE[viewValue]]: templateValues,
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
            handleChange={handleTemplateChange("template")}
            handleSave={handleSave}
          />
          {templateValues.partials.map(({ label, name, template }, idx) => (
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
            Apply
          </Button>
        </Box>
      )}
    </>
  );
}
