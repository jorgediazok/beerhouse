import { Check } from "lucide-react";
import { ORDER_STAGES, type OrderStatusKey } from "@/lib/orderStatus";

export function OrderStatusStepper({ current }: { current: OrderStatusKey }) {
  const currentIndex = ORDER_STAGES.findIndex((stage) => stage.status === current);

  return (
    <div className="flex items-start" role="list" aria-label="Estado del pedido">
      {ORDER_STAGES.map((stage, i) => {
        const done = i <= currentIndex;
        const isCurrent = i === currentIndex;
        const isLast = i === ORDER_STAGES.length - 1;

        return (
          <div
            key={stage.status}
            role="listitem"
            aria-current={isCurrent ? "step" : undefined}
            className={`flex items-start ${isLast ? "" : "flex-1"}`}
          >
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  done ? "bg-orange text-dark" : "bg-dark/10 text-dark/30"
                }`}
              >
                {i < currentIndex ? <Check size={12} aria-hidden="true" /> : i + 1}
              </span>
              <span className={`text-center text-[11px] font-medium ${done ? "text-dark" : "text-dark/35"}`}>
                {stage.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={`mx-1.5 mt-3 h-0.5 flex-1 rounded ${i < currentIndex ? "bg-orange" : "bg-dark/10"}`}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
