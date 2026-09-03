export type OrderStatusKey = "confirmado" | "preparando" | "enviado" | "entregado";

type Stage = { status: OrderStatusKey; label: string; afterMs: number };

// No real fulfillment backend exists, so the delivery stage is derived from
// elapsed time since the order was placed rather than stored — it's a
// presentational simulation, not a fact tracked anywhere.
const STAGES: Stage[] = [
  { status: "confirmado", label: "Confirmado", afterMs: 0 },
  { status: "preparando", label: "Preparando", afterMs: 2 * 60 * 1000 },
  { status: "enviado", label: "Enviado", afterMs: 10 * 60 * 1000 },
  { status: "entregado", label: "Entregado", afterMs: 20 * 60 * 1000 },
];

export function getOrderStatus(createdAt: Date | string): { status: OrderStatusKey; label: string } {
  const elapsedMs = Date.now() - new Date(createdAt).getTime();

  let current = STAGES[0];
  for (const stage of STAGES) {
    if (elapsedMs >= stage.afterMs) current = stage;
  }

  return { status: current.status, label: current.label };
}

export const ORDER_STAGES = STAGES.map(({ status, label }) => ({ status, label }));
