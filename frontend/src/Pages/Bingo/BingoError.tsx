import { RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";

// Shown when a bingo page can't load its data (usually no connection)
function BingoError() {
    return (
        <div className="flex min-h-[60dvh] items-center justify-center">
            <Card className="w-full max-w-md text-center">
                <CardHeader className="items-center">
                    <WifiOff className="mx-auto size-8 text-muted-foreground" />
                    <CardTitle>Couldn't load the bingo</CardTitle>
                    <CardDescription>Check your connection and try again.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => window.location.reload()}>
                        <RefreshCw /> Try again
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default BingoError;
