import { useEffect, useRef, useState } from "react";

import { Box, Button, InputLabel } from "@mui/material";
import { browser, STORAGE_KEYS } from "@rju/core";
import { TView } from "@rju/types";

import CodeEditor from "../CodeEditor";

const { CURRENT_TEMPLATE, SELECTED_VIEW } = STORAGE_KEYS;

const initialState = {
  template: "",
  partials: [
    {
      label: "Comments Partial",
      name: "comments",
      template: "",
    },
  ],
};

type TComments = {
  template: string;
  partials: {
    label: string;
    name: string;
    template: string;
  }[];
};

export default function Comments() {
  const [templateValues, setTemplateValues] = useState<TComments>(initialState);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [viewValue, setViewValue] = useState<TView>("subreddit");
  const canSave =
    templateValues.template ||
    templateValues.partials.some((partial) => partial.template);

  // configure a ref for templateValues so the latest values can be accessed
  // within save listener
  const templateValuesRef = useRef<TComments>();
  templateValuesRef.current = templateValues;

  useEffect(() => {
    async function init() {
      let newViewValue: TView = "subreddit";
      const view: Record<string, TView> = await browser.storage.sync.get(
        SELECTED_VIEW
      );
      if (Object.prototype.hasOwnProperty.call(view, SELECTED_VIEW)) {
        newViewValue = view[SELECTED_VIEW];
        setViewValue(newViewValue);
      }

      const viewTemplate = CURRENT_TEMPLATE[newViewValue];
      const code = await browser.storage.sync.get(viewTemplate);
      if (Object.prototype.hasOwnProperty.call(code, viewTemplate)) {
        setTemplateValues(code[viewTemplate]);
      }

      setInitialized(true);
      document.addEventListener("keydown", saveListener);
    }

    init();

    return () => {
      document.removeEventListener("keydown", saveListener);
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
    // content window listens for and acts upon storage changes so there's no
    // need to send a message
    browser.storage.sync.set({
      [CURRENT_TEMPLATE[viewValue]]: templateValuesRef.current,
    });
  };

  const saveListener = (event: KeyboardEvent) => {
    const triggerDown = navigator.platform.match("Mac")
      ? event.metaKey
      : event.ctrlKey;

    if (event.key.toLowerCase() === "s" && triggerDown) {
      event.preventDefault();
      handleSave();
    }
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
            Apply
          </Button>
        </Box>
      )}
    </>
  );
}
