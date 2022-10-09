export function saveListener(event: KeyboardEvent, handleSave: () => void) {
  const triggerDown = navigator.platform.match("Mac")
    ? event.metaKey
    : event.ctrlKey;

  if (event.key.toLowerCase() === "s" && triggerDown) {
    event.preventDefault();
    handleSave();
  }
}

export * from "./StyleInput";
export * from "./TemplateInput";
