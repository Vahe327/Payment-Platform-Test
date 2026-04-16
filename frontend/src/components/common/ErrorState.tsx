import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorState({ message = "Something went wrong", onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted">
      <AlertTriangle className="h-12 w-12 mb-4 text-red-500 opacity-60" />
      <p className="text-sm mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
