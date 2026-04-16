import { useQuery } from "@tanstack/react-query";
import { getMyAccounts } from "@/api/users";

export function useAccounts() {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: getMyAccounts,
  });
}
