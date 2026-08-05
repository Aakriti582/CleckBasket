import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
} from "../api/endpoints/orders";
import { useAuthStore } from "../store/authStore";

export function useCart() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  const cartQuery = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: ({ productId, quantity }) => addCartItem(productId, quantity),
    onSuccess: (data) => queryClient.setQueryData(["cart"], data),
  });

  const updateMutation = useMutation({
    mutationFn: ({ itemId, quantity }) => updateCartItem(itemId, quantity),
    onSuccess: (data) => queryClient.setQueryData(["cart"], data),
  });

  const removeMutation = useMutation({
    mutationFn: (itemId) => removeCartItem(itemId),
    onSuccess: (data) => queryClient.setQueryData(["cart"], data),
  });

  return {
    cart: cartQuery.data,
    isLoading: cartQuery.isLoading,
    addItem: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    addError: addMutation.error,
    updateItem: updateMutation.mutateAsync,
    removeItem: removeMutation.mutateAsync,
  };
}