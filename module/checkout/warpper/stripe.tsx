// // import { Elements } from "@stripe/react-stripe-js"
// // import { loadStripe } from "@stripe/stripe-js"

// const stripeKey = process.env.NEXT_PUBLIC_STRIPE_KEY
// const stripePromise = stripeKey ? loadStripe(stripeKey) : null

// export default function StripeWrapper({ clientSecret, children }: Props) {

//     return (
//         <Elements
//             stripe={stripePromise}
//             options={{
//                 clientSecret,
//                 appearance: {
//                     theme: "flat",
//                     "labels": "floating",
//                     variables: {
//                         borderRadius: "8px",
//                         fontFamily: "Inter, system-ui, sans-serif",
//                     },
//                 },
//             }}
//         >
//             {children}
//         </Elements>
//     )
// }

// type Props = {
//     clientSecret: string
//     children: React.ReactNode
// }