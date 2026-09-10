import InteractiveLink from "@/module/common/templates/interactive-link";

// TODO: rework
export default function AccountFooter() {
  return (
    <div className="py-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">Got questions?</h3>
        <span className="text-base">
          You can find frequently asked questions and answers on our customer
          service page.
        </span>
      </div>
      <div className="float-right mt-4">
        <InteractiveLink href="/contact-us">Customer Service</InteractiveLink>
      </div>
    </div>
  );
}
