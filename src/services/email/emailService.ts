// Lightweight email abstraction. Implement provider adapters and call `sendReservationConfirmation`.
import { BUSINESS } from "@/lib/config";
import { logger } from "@/lib/logger";

type ReservationInfo = {
  full_name: string;
  email: string;
  delivery_area: string;
  address: string;
  selected_vegetables: string[];
};

async function providerSend(to: string, subject: string, body: string) {
  // Placeholder: detect provider by env and delegate. If not configured, log a warning.
  const provider = import.meta.env.VITE_EMAIL_PROVIDER;
  if (!provider) {
    logger.warn("[emailService] No email provider configured. Skipping send.");
    logger.info("[emailService] Email preview", { to, subject, hasBody: !!body });
    return { ok: false, message: "no-provider" };
  }

  // Implement provider integrations here (SendGrid, SES, etc.)
  logger.info("[emailService] provider_send", { provider, to });
  return { ok: true, message: "stubbed" };
}

export async function sendReservationConfirmation(reservation: ReservationInfo) {
  const subject = "Harvest Reservation Received";
  const body = `Hello ${reservation.full_name},\n\nThank you for reserving your harvest with ${BUSINESS.name}.\n\nYour reservation has been received successfully.\n\nOur team will contact you within 24 hours.\n\nYou can track progress from your dashboard.\n\nDelivery area: ${reservation.delivery_area}\nAddress: ${reservation.address}\n\nThanks,\n${BUSINESS.name}`;

  return providerSend(reservation.email, subject, body);
}

export default { sendReservationConfirmation };
