import { div as Div } from "motion/react-client"

export default function CheckPaymentContainer({
  children,
}: React.PropsWithChildren) {
  return (
    <Div
      key="extra-info"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="border-t bg-background-muted"
    >
      <div className="p-4 sm:p-6 flex flex-col items-center justify-center gap-3 sm:gap-4 text-center space-y-1 sm:space-y-2">
        {children}
      </div>
    </Div>
  )
}
