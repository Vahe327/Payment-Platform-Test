import { formatDistanceToNow, format } from "date-fns";

export function formatBalance(balance: string): string {
  const num = parseFloat(balance);
  return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatDate(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
}

export function formatDateAbsolute(dateStr: string): string {
  return format(new Date(dateStr), "yyyy-MM-dd HH:mm:ss");
}

export function truncateHash(hash: string, chars: number = 8): string {
  if (hash.length <= chars * 2) return hash;
  return `${hash.slice(0, chars)}...${hash.slice(-chars)}`;
}
