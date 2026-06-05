import { a as createServerFn, T as TSS_SERVER_FUNCTION } from "./server-DAhxmYZq.mjs";
import { R as Resend } from "../_libs/resend.mjs";
import { l as logger } from "./index.mjs";
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
import "../_libs/postal-mime.mjs";
import "../_libs/standardwebhooks.mjs";
import "../_libs/stablelib__base64.mjs";
import "../_libs/fast-sha256.mjs";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const resendApiKey = process.env.RESEND_API_KEY || "";
const resend = new Resend(resendApiKey);
const ReservationInfoSchema = objectType({
  full_name: stringType().min(1),
  email: stringType().email(),
  delivery_area: stringType(),
  address: stringType(),
  selected_vegetables: arrayType(stringType())
});
const sendReservationConfirmationEmail_createServerFn_handler = createServerRpc({
  id: "a1fa375f149012194411533ff6115d1cc74f48f6a2e6e8606691b0e0ad71d333",
  name: "sendReservationConfirmationEmail",
  filename: "src/lib/api/email.functions.ts"
}, (opts) => sendReservationConfirmationEmail.__executeServer(opts));
const sendReservationConfirmationEmail = createServerFn({
  method: "POST"
}).inputValidator(ReservationInfoSchema).handler(sendReservationConfirmationEmail_createServerFn_handler, async ({
  data: reservation
}) => {
  try {
    if (!resendApiKey) {
      logger.warn("[sendReservationConfirmationEmail] No Resend API key configured");
      return {
        ok: false,
        message: "Email provider not configured",
        id: null
      };
    }
    const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { color: #2d5016; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
              .content { color: #333; line-height: 1.6; }
              .details { background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0; }
              .details-row { margin: 10px 0; }
              .label { color: #666; font-weight: 600; }
              .footer { color: #999; font-size: 12px; margin-top: 30px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">Harvest Reservation Received</div>
              
              <div class="content">
                <p>Hello ${reservation.full_name},</p>
                
                <p>Thank you for reserving your harvest with Gurnam Farms! Your reservation has been received successfully.</p>
                
                <p>Our team will contact you within 24 hours to confirm the details and discuss any special requirements.</p>
                
                <p>You can track your harvest progress from your dashboard anytime.</p>
                
                <div class="details">
                  <div class="details-row">
                    <span class="label">Delivery Area:</span> ${reservation.delivery_area}
                  </div>
                  <div class="details-row">
                    <span class="label">Delivery Address:</span> ${reservation.address}
                  </div>
                  <div class="details-row">
                    <span class="label">Selected Vegetables:</span> ${reservation.selected_vegetables.join(", ")}
                  </div>
                </div>
                
                <p>If you have any questions or need to make changes to your reservation, please reply to this email or contact us through the website.</p>
                
                <p>
                  Warm regards,<br/>
                  <strong>Gurnam Farms Team</strong>
                </p>
              </div>
              
              <div class="footer">
                <p>This is an automated email. Please do not reply with sensitive information.</p>
              </div>
            </div>
          </body>
        </html>
      `;
    const result = await resend.emails.send({
      from: "Gurnam Farms <reservations@gurnam-farms.com>",
      to: reservation.email,
      subject: "Harvest Reservation Received - Gurnam Farms",
      html: htmlContent
    });
    if (result.error) {
      logger.error("[sendReservationConfirmationEmail] Resend API error", {
        error: result.error.message,
        email: reservation.email.replace(/@.+/, "@***")
      });
      return {
        ok: false,
        message: "Failed to send email",
        id: null
      };
    }
    logger.info("[sendReservationConfirmationEmail] Email sent successfully", {
      id: result.data?.id,
      email: reservation.email.replace(/@.+/, "@***")
    });
    return {
      ok: true,
      message: "Email sent successfully",
      id: result.data?.id || null
    };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    logger.error("[sendReservationConfirmationEmail] Exception", {
      error
    });
    return {
      ok: false,
      message: "Email service error",
      id: null
    };
  }
});
const email_functions = {
  sendReservationConfirmationEmail
};
export {
  email_functions as default,
  sendReservationConfirmationEmail_createServerFn_handler
};
