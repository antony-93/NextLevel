import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";

type RootProps = {
    children: React.ReactNode;
}

export default function Root({ children }: RootProps) {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Toaster />
                {children}
            </BrowserRouter>
        </QueryClientProvider>
    );
}