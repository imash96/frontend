import { Clock } from "lucide-react";
import PaymentContainer from "./payment-container";

export default function PayLaterContainer() {
  return (
    <PaymentContainer>
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Icon */}
        <Clock className="w-12 h-12 text-accent" />

        {/* Title */}
        <h3 className="text-lg font-semibold">Pay Later</h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground max-w-sm">
          Place your order now and complete your payment later using your
          preferred method. We’ll send you payment instructions after your order
          is confirmed.
        </p>
      </div>
    </PaymentContainer>
  );
}
