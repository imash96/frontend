// "use client"

// import { PaymentElement } from "@stripe/react-stripe-js"
// import type { StripePaymentElementOptions } from "@stripe/stripe-js"
// import { useState } from "react"
// import PaymentContainer from "./payment-container"

// export default function StripeContainer() {
//     const [cardComplete, setCardComplete] = useState(false)

//     return (
//         <PaymentContainer>
//             <PaymentElement
//                 options={options}
//                 onChange={(event) => {
//                     setCardComplete(event.complete)
//                 }}
//                 className="w-full"
//             />
//             {!cardComplete && (
//                 <p className="text-sm text-foreground-muted">
//                     Please complete your payment details
//                 </p>
//             )}
//         </PaymentContainer>
//     )
// }

// const options: StripePaymentElementOptions = {
//     layout: { type: "accordion" },
//     business: { name: "Velle Hide" },
// }
