import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/Components/ui/input-otp";
import { cn } from "@/lib/utils";
import { CODE_LENGTH, login } from "@/bingo/store";

function BingoLogin() {
    const navigate = useNavigate();
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [shaking, setShaking] = useState(false);
    const [loading, setLoading] = useState(false);

    const fail = (message: string) => {
        setError(message);
        setShaking(true);
        setTimeout(() => setShaking(false), 400);
    };

    const submit = async (value: string) => {
        if (value.length < CODE_LENGTH || loading) return;
        setLoading(true);
        try {
            const result = await login(value);
            if (!result) return fail("That code doesn't exist. Check the code you got from Aaron.");
            navigate(result.hasBoard ? "/worlds2026bingo/card" : "/worlds2026bingo/setup");
        } catch {
            fail("Couldn't reach the server. Check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    const onChange = (value: string) => {
        setCode(value);
        setError("");
    };

    return (
        <div className="flex min-h-[75dvh] flex-col items-center justify-center gap-8">
            <div className="text-center">
                <img src="/bingo/LOL_Worlds_logo.svg" alt="League of Legends Worlds logo" className="mx-auto mb-4 h-20 w-auto sm:h-24" />
                <h1 className="font-title text-4xl font-bold tracking-wide sm:text-5xl">
                    Worlds <span className="text-primary">Bingo</span>
                </h1>
                <p className="mt-2 text-muted-foreground">Build your card, watch the games, shout BINGO.</p>
            </div>

            <Card className={cn("w-full max-w-md", shaking && "animate-shake")}>
                <CardHeader className="text-center">
                    <CardTitle>Enter your code</CardTitle>
                    <CardDescription>The 6 digit code you got from Aaron</CardDescription>
                </CardHeader>
                <form
                    className="flex flex-col gap-6"
                    onSubmit={(e) => {
                        e.preventDefault();
                        submit(code);
                    }}
                >
                    <CardContent className="flex flex-col items-center gap-3 px-4 sm:px-6">
                        <InputOTP
                            maxLength={CODE_LENGTH}
                            pattern={REGEXP_ONLY_DIGITS}
                            value={code}
                            onChange={onChange}
                            onComplete={submit}
                            autoFocus
                        >
                            <InputOTPGroup>
                                {[0, 1, 2].map((i) => (
                                    <InputOTPSlot key={i} index={i} aria-invalid={!!error} />
                                ))}
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                                {[3, 4, 5].map((i) => (
                                    <InputOTPSlot key={i} index={i} aria-invalid={!!error} />
                                ))}
                            </InputOTPGroup>
                        </InputOTP>
                        {error && <p className="text-center text-sm font-medium text-destructive">{error}</p>}
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" size="lg" className="w-full" disabled={code.length < CODE_LENGTH || loading}>
                            {loading ? <Loader2 className="animate-spin" /> : <>Continue <ArrowRight /></>}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

export default BingoLogin;
