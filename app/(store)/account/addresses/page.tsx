import { BookUser } from "lucide-react";
import { notFound } from "next/navigation";
import { retrieveCustomer } from "@/lib/action/customer";
import { listRegions } from "@/lib/action/regions";
import Addresses from "@/module/account/templates/addresses";

export default async function Page() {
  const [customer, regions] = await Promise.all([
    retrieveCustomer(),
    listRegions(),
  ]);
  if (!customer || !regions) notFound();

  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <div className="flex items-center gap-2">
          <BookUser size={20} />
          <h2 className="text-lg lg:text-xl uppercase tracking-wide font-medium">
            Addresses
          </h2>
        </div>
        <p className="text-sm text-foreground-muted max-w-prose">
          View and update your shipping addresses. You can add as many as you
          like. Saving your addresses makes them available during checkout.
        </p>
      </header>
      <Addresses addresses={customer.addresses} regions={regions} />
    </section>
  );
}
