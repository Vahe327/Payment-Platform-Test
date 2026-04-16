import { CopyButton } from "@/components/common/CopyButton";
import { formatBalance, formatDate, formatDateAbsolute, truncateHash } from "@/lib/format";
import { CURRENCY } from "@/lib/constants";
import type { Payment } from "@/types/api";

export function PaymentRow({ payment }: { payment: Payment }) {
  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-surface/50 transition-colors">
      <div className="flex items-center gap-2 min-w-0">
        <code className="text-xs font-mono text-muted truncate" title={payment.transaction_id}>
          {truncateHash(payment.transaction_id)}
        </code>
        <CopyButton text={payment.transaction_id} />
      </div>
      <div className="flex items-center gap-4">
        <span className="font-mono text-sm font-medium text-foreground">
          +{formatBalance(payment.amount)} {CURRENCY}
        </span>
        <span className="text-xs text-muted" title={formatDateAbsolute(payment.created_at)}>
          {formatDate(payment.created_at)}
        </span>
      </div>
    </div>
  );
}
