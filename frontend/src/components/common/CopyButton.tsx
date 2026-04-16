import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleCopy} aria-label="Copy to clipboard">
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
    </Button>
  );
}
