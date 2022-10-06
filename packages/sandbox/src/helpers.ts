import Handlebars from "handlebars";
import { truncate } from "lodash";

Handlebars.registerHelper("ifeq", (a, b, options) => {
  return a === b ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper("ifnoteq", (a, b, options) => {
  return a !== b ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper("ifnotend", (a, b, options) => {
  return a < b - 1 ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper("truncate", (a) => {
  return truncate(a);
});
