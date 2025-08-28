import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { useIsMobile } from "../hooks/use-mobile";

type RootProps = {
    children: React.ReactNode;
}

export default function Root({ children }: RootProps) {
    const queryClient = new QueryClient();

    const isMobile = useIsMobile();

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Toaster 
                    position={isMobile ? "top-center" : "bottom-right"}
                />

                {children}
            </BrowserRouter>
        </QueryClientProvider>
    );
}