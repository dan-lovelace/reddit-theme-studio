// WARNING: import MESSAGE_ACTIONS using absolute path because
// webextension-polyfill will throw an error otherwise
import { MESSAGE_ACTIONS } from "@rju/core/src/message";
import { TMessageEvent } from "@rju/types";
import Handlebars from "handlebars";

import "./helpers";

window.addEventListener("message", (event) => {
  const {
    data: { context, template },
    origin,
    source,
  } = event;
  const compiled = Handlebars.compile(template)(context);
  const messageEvent: TMessageEvent = {
    action: MESSAGE_ACTIONS.UPDATE_TEMPLATE,
    value: compiled,
  };

  source?.postMessage(messageEvent, { targetOrigin: origin });
});
