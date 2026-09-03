import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

export const mpPayment = new Payment(client);

// Card-payment rejection reasons Mercado Pago's sandbox actually returns
// for its documented test cards — anything else falls back to a generic
// message rather than surfacing the raw status_detail to the buyer.
const REJECTION_MESSAGES: Record<string, string> = {
  cc_rejected_bad_filled_card_number: "Revisá el número de tarjeta.",
  cc_rejected_bad_filled_date: "Revisá la fecha de vencimiento.",
  cc_rejected_bad_filled_security_code: "Revisá el código de seguridad.",
  cc_rejected_bad_filled_other: "Revisá los datos de la tarjeta.",
  cc_rejected_blacklist: "No pudimos procesar el pago con esta tarjeta.",
  cc_rejected_call_for_authorize: "Tu tarjeta requiere autorización. Contactá a tu banco.",
  cc_rejected_card_disabled: "Tu tarjeta está deshabilitada. Contactá a tu banco.",
  cc_rejected_duplicated_payment: "Ya hiciste un pago por ese monto. Si necesitás pagar de nuevo, contactanos.",
  cc_rejected_high_risk: "No pudimos aprobar el pago por seguridad.",
  cc_rejected_insufficient_amount: "Tu tarjeta no tiene fondos suficientes.",
  cc_rejected_invalid_installments: "Tu tarjeta no acepta esa cantidad de cuotas.",
  cc_rejected_max_attempts: "Llegaste al límite de intentos permitidos.",
  cc_rejected_other_reason: "Tu banco rechazó el pago.",
};

export function paymentRejectionMessage(statusDetail: string | undefined): string {
  if (statusDetail && REJECTION_MESSAGES[statusDetail]) {
    return REJECTION_MESSAGES[statusDetail];
  }
  return "No pudimos procesar el pago. Probá de nuevo o con otra tarjeta.";
}
