import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Resend } from "resend";
import { logger } from "../logger";

const resendApiKey = process.env.RESEND_API_KEY || "";
const resend = new Resend(resendApiKey);

const ReservationInfoSchema = z.object({
  full_name: z.string().min(1),
  email: z.string().email(),
  delivery_area: z.string(),
  address: z.string(),
  selected_vegetables: z.array(z.string()),
});

type ReservationInfo = z.infer<typeof ReservationInfoSchema>;

/**
 * Server function to send reservation confirmation email via Resend
 * This runs server-side only - never exposed to client
 * @param reservation - Reservation details to include in email
 * @returns Success/failure status
 */
export const sendReservationConfirmationEmail = createServerFn({ method: "POST" })
  .inputValidator(ReservationInfoSchema)
  .handler(async ({ data: reservation }) => {
    try {
      // Check if API key is configured
      if (!resendApiKey) {
        logger.warn("[sendReservationConfirmationEmail] No Resend API key configured");
        return { ok: false, message: "Email provider not configured", id: null };
      }

      // Create email HTML content
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

      // Send email via Resend
      const result = await resend.emails.send({
        from: "Gurnam Farms <reservations@gurnam-farms.com>",
        to: reservation.email,
        subject: "Harvest Reservation Received - Gurnam Farms",
        html: htmlContent,
      });

      if (result.error) {
        logger.error("[sendReservationConfirmationEmail] Resend API error", {
          error: result.error.message,
          email: reservation.email.replace(/@.+/, "@***"),
        });
        return { ok: false, message: "Failed to send email", id: null };
      }

      logger.info("[sendReservationConfirmationEmail] Email sent successfully", {
        id: result.data?.id,
        email: reservation.email.replace(/@.+/, "@***"),
      });

      return { ok: true, message: "Email sent successfully", id: result.data?.id || null };
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      logger.error("[sendReservationConfirmationEmail] Exception", { error });
      return { ok: false, message: "Email service error", id: null };
    }
  });

export default { sendReservationConfirmationEmail };
