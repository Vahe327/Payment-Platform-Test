import { useQuery } from "@tanstack/react-query";
import { getMyPayments } from "@/api/users";

export function usePayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: getMyPayments,
  });
}
