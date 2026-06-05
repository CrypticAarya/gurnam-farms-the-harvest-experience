import { a as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./server-DAhxmYZq.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, a as arrayType, s as stringType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const ReservationInfoSchema = objectType({
  full_name: stringType().min(1),
  email: stringType().email(),
  delivery_area: stringType(),
  address: stringType(),
  selected_vegetables: arrayType(stringType())
});
const sendReservationConfirmationEmail = createServerFn({
  method: "POST"
}).inputValidator(ReservationInfoSchema).handler(createSsrRpc("a1fa375f149012194411533ff6115d1cc74f48f6a2e6e8606691b0e0ad71d333"));
const email_functions = {
  sendReservationConfirmationEmail
};
export {
  email_functions as default,
  sendReservationConfirmationEmail
};
