import { StepType } from "@/types/common"

export default function CheckoutStepHeader({ title, subtitle, Icon, currentStep, children }: Props) {
    return (
        <div className="bg-card border border-card-border rounded-2xl overflow-hidden shadow-lg">
            <button
                className="w-full flex items-center justify-between p-6 hover:bg-card-hover transition-colors"
            >
                <div className="flex items-center gap-4">
                    <Icon
                        className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0"
                        aria-hidden="true"
                    />
                    <div className="text-left">
                        <h2 className="text-xl font-bold">{title}</h2>
                        <p className="text-sm text-text-tertiary">{subtitle}</p>
                    </div>
                </div>
                <svg
                    className={`w-6 h-6 transition-transform ${currentStep === 'shipping' ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {children}
        </div>
    )
}

type Props = {
    title: string
    subtitle: string
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    currentStep: StepType
    children?: React.ReactNode
}
