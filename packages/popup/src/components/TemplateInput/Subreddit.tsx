import { TViewInputValue } from "@rts/types";

import ViewInput from "./ViewInput";

const initialState: TViewInputValue = {
  template: "",
  partials: [],
};

export default function Subreddit() {
  return <ViewInput initialState={initialState} view="subreddit" />;
}
