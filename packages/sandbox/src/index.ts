// WARNING: import MESSAGE_ACTIONS using absolute path because
// webextension-polyfill will throw an error otherwise
import { MESSAGE_ACTIONS } from "@rju/core/src/message";
import { TMessageEvent, TSandboxMessageEvent } from "@rju/types";
import Handlebars from "handlebars";

import "./helpers";

window.addEventListener("message", (message) => {
  console.log("iframe message", message);
  const {
    data: { context, event },
    origin,
    source,
  } = message;
  let messageEvent: TMessageEvent<any> = event;

  switch (messageEvent.action) {
    case MESSAGE_ACTIONS.UPDATE_TEMPLATE: {
      const sandboxValue: TSandboxMessageEvent = messageEvent.value;

      for (const partial of sandboxValue.partials) {
        Handlebars.registerPartial(partial.name, partial.template);
      }

      const compiled = Handlebars.compile(sandboxValue.template)(context);

      messageEvent = {
        action: MESSAGE_ACTIONS.UPDATE_TEMPLATE,
        value: compiled,
      };
      break;
    }
  }

  source?.postMessage(messageEvent, { targetOrigin: origin });
});
