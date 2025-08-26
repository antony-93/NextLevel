import { DateField as DateFieldRac, DateInput } from "@/shared/components/datefield-rac"
import { Label } from "./ui/label";

type DateFieldProps = React.ComponentProps<typeof DateFieldRac> & {
    label: string;
    required?: boolean;
    error?: string;
}

export default function DateField({ label, required, error, ...props }: DateFieldProps) {
    return (
        <DateFieldRac {...props} className="*:not-first:mt-2">
            {
                label &&
                <Label>
                    {label}
                    {required && <span className="text-destructive">*</span>}
                </Label>}

            <DateInput 
                aria-invalid={!!error}
                className={error ? "border-destructive ring-destructive/20 ring-2" : ""}
            />

            {
                error &&
                <p
                    className="text-destructive pb-2 ml-0.5 text-sm"
                    role="alert"
                    aria-live="polite"
                >
                    {error}
                </p>
            }
        </DateFieldRac>
    )
}
