import { notFound } from "next/navigation";
import { retrieveCustomer } from "@/lib/action/customer";
import { listRegions } from "@/lib/action/regions";
import ProfilePersonal from "@/module/account/components/profile-basic";
import ProfileBilling from "@/module/account/components/profile-billing";
import ProfilePassword from "@/module/account/components/profile-password";
import ProfileHolder from "@/module/account/templates/profile-holder";

export default async function Page() {
  const [customer, regions] = await Promise.all([
    retrieveCustomer(),
    listRegions(),
  ]);
  if (!customer || !regions) notFound();

  return (
    <>
      <ProfileHolder
        title="Personal Information"
        desc="Use a permanent address where you can receive mail."
      >
        <ProfilePersonal customer={customer} />
      </ProfileHolder>

      <ProfileHolder
        title="Change password"
        desc="Update your password associated with your account."
      >
        <ProfilePassword />
      </ProfileHolder>

      <ProfileHolder
        title="Billing Address"
        desc="Update your billing address associated with your account."
      >
        <ProfileBilling customer={customer} regions={regions} />
      </ProfileHolder>
    </>
  );
}
