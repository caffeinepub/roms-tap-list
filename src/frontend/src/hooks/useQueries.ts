import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Beer } from '../backend';

export function useGetAllBeers() {
  const { actor, isFetching } = useActor();

  return useQuery<Beer[]>({
    queryKey: ['beers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBeers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddBeer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      style: string;
      abv: number;
      ibu: bigint;
      description: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addBeer(data.name, data.style, data.abv, data.ibu, data.description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beers'] });
    },
  });
}

export function useUpdateBeer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      style: string;
      abv: number;
      ibu: bigint;
      description: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateBeer(data.id, data.name, data.style, data.abv, data.ibu, data.description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beers'] });
    },
  });
}

export function useToggleOnTap() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.toggleOnTap(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beers'] });
    },
  });
}

export function useRemoveBeer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.removeBeer(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beers'] });
    },
  });
}
