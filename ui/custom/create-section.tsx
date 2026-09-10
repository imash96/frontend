type ContainerProps<T extends React.ElementType> = {
    as?: T
    sectionName?: string
    width?: 7 | 8
    className?: string | undefined
} & React.ComponentPropsWithoutRef<T>

export default function Container<T extends React.ElementType = "div">({ as, children, sectionName, className = "", ...props }: ContainerProps<T>) {
    const Component = as || 'div'
    // const w = width == 8 ? "max-w-8xl" : "max-w-7xl"
    return (
        sectionName ? <section aria-label={sectionName}>
            <Component className={`mx-auto max-w-7xl px-4 md:px-10 lg:px-14 ${className ?? ""}`} {...props}>
                {children}
            </Component>
        </section> : <Component className={`mx-auto max-w-7xl px-4 md:px-10 lg:px-14 ${className ?? ""}`} {...props}>
            {children}
        </Component>

    )
}