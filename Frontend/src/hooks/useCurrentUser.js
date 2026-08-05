import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getMe } from "../api/endpoints/auth";
import { useAuthStore } from "../store/authStore";

export function useCurrentUser() {
  const setUser = useAuthStore((s) => s.setUser);

  const query = useQuery({
    queryKey: ["me"],
    queryFn: () => getMe().then((r) => r.data),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (query.data) setUser(query.data);
  }, [query.data, setUser]);

  return query;
}