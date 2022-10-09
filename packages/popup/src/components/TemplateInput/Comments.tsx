import ViewInput, { TViewInputValue } from "./ViewInput";

const initialState: TViewInputValue = {
  template: "",
  partials: [
    {
      label: "Comments partial",
      name: "comments",
      template: "",
    },
  ],
};

export default function Comments() {
  return <ViewInput initialState={initialState} view="comments" />;
}
