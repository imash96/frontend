import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { retrieveCustomer } from "@/lib/action/customer";
import { listRegions } from "@/lib/action/regions";
import ProfilePersonal from "@/module/account/components/profile-basic";
import ProfileBilling from "@/module/account/components/profile-billing";
import ProfilePassword from "@/module/account/components/profile-password";
import ProfileHolder from "@/module/account/templates/profile-holder";

export const metadata: Metadata = {
  title: "My Profile | Velle Hide",
  description: "Manage your personal information, password, and billing address.",
};

export default async function Page() {
  const [customer, regions] = await Promise.all([
    retrieveCustomer(),
    listRegions(),
  ]);
  if (!customer || !regions) notFound();

  return (
    <div className="space-y-2">
      <div className="animate-fade-in-up">
        <ProfileHolder
          title="Personal Information"
          desc="Use a permanent address where you can receive mail."
        >
          <ProfilePersonal customer={customer} />
        </ProfileHolder>
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <ProfileHolder
          title="Change password"
          desc="Update your password associated with your account."
        >
          <ProfilePassword />
        </ProfileHolder>
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
        <ProfileHolder
          title="Billing Address"
          desc="Update your billing address associated with your account."
        >
          <ProfileBilling customer={customer} regions={regions} />
        </ProfileHolder>
      </div>
    </div>
  );
}
