
type ContainerProps = {
    children: React.ReactNode;
}

export default function Container({ children }: ContainerProps) {
    return <div className="flex items-center justify-between
    w-full max-w-[1246px] mx-auto my-auto px-[15px]">
        {children}
    </div>
}