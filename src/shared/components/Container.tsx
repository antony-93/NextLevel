import { cn } from "../utils/utils";

type FormContainerProps = {
    className?: string;
    children: React.ReactNode;
}

export function FormContainer({ children, className }: FormContainerProps) {
    return (
        <div className={cn("w-full p-4 md:px-8 lg:px-0 md:max-w-5xl lg:max-w-3xl md:mx-auto h-full flex items-center justify-center", className)}>
            <div className="lg:border lg:border-gray-200 lg:rounded-lg lg:p-6 w-full">
                {children}
            </div>
        </div>
    )
}

type FormContainerButtonProps = {
    children: React.ReactNode;
    className?: string;
}

export function FormContainerButton({ children, className }: FormContainerButtonProps) {
    return (
        <div className={cn("flex flex-row flex-wrap justify-end", className)}>
            {children}
        </div>
    )
}