import CustomDivider from "@/ui/divider";

// TODO color
export default function CheckoutExpress() {
  return (
    <>
      <div className="space-y-3">
        <h2 className="text-xl font-medium">Express Checkout</h2>
        <div className="flex flex-col lg:flex-row items-center gap-2">
          <button className="bg-green-500 hover:bg-green-400 flex items-center justify-center h-12 text-[#242424] w-full font-semibold tracking-wide rounded-md">
            Pay with link
          </button>
          <button className="flex items-center justify-center h-12 bg-yellow-400 hover:bg-yellow-300 text-[#242424] w-full pt-2 rounded-md">
            <img
              className="h-6 w-auto"
              src="https://m.media-amazon.com/storefront/images/G/01/AmazonPay/Maxo/amazonpay-logo-rgb_drk_1.svg"
              alt=""
            />
          </button>
        </div>
      </div>
      <CustomDivider text={"or"} />
    </>
  );
}
