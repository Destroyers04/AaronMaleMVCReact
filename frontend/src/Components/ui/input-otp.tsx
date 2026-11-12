import { useContext, type ComponentProps } from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function InputOTP({
    className,
    containerClassName,
    ...props
}: ComponentProps<typeof OTPInput> & { containerClassName?: string }) {
    return (
        <OTPInput
            data-slot="input-otp"
            containerClassName={cn("flex items-center gap-2 has-disabled:opacity-50", containerClassName)}
            className={cn("disabled:cursor-not-allowed", className)}
            {...props}
        />
    );
}

function InputOTPGroup({ className, ...props }: ComponentProps<"div">) {
    return <div data-slot="input-otp-group" className={cn("flex items-center", className)} {...props} />;
}

function InputOTPSlot({
    index,
    className,
    ...props
}: ComponentProps<"div"> & { index: number }) {
    const inputOTPContext = useContext(OTPInputContext);
    const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

    return (
        <div
            data-slot="input-otp-slot"
            data-active={isActive}
            className={cn(
                "relative flex h-12 w-10 items-center justify-center border-y border-r border-input bg-card font-title text-xl font-bold shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md sm:size-14 sm:text-2xl",
                "data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-[3px] data-[active=true]:ring-ring/50",
                "aria-invalid:border-destructive aria-invalid:text-destructive",
                className
            )}
            {...props}
        >
            {char}
            {hasFakeCaret && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="h-6 w-px animate-caret-blink bg-foreground" />
                </div>
            )}
        </div>
    );
}

function InputOTPSeparator(props: ComponentProps<"div">) {
    return (
        <div data-slot="input-otp-separator" role="separator" {...props}>
            <MinusIcon className="text-muted-foreground" />
        </div>
    );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
