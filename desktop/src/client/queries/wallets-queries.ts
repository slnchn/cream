import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { DesktopWalletResponse } from '../types/wallets';

export const useWallets = (): UseQueryResult<DesktopWalletResponse[]> => {
  return useQuery<DesktopWalletResponse[]>({
    queryKey: ['wallets'],
    queryFn: () => window.electron.ipcRenderer.wallets.list(),
  });
};

export const useWallet = (
  walletId: string,
): UseQueryResult<DesktopWalletResponse | null> => {
  return useQuery<DesktopWalletResponse | null>({
    queryKey: [`wallets-${walletId}`],
    queryFn: async () => {
      const wallets = await window.electron.ipcRenderer.wallets.list();
      return wallets?.find((wallet) => wallet.id === Number(walletId)) || null;
    },
  });
};

interface CreateWalletParams {
  name: string;
  currency: string;
}

export const useCreateWallet = (): UseMutationResult<
  void,
  unknown,
  CreateWalletParams,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, currency }) => {
      return window.electron.ipcRenderer.wallets.create(name, currency);
    },

    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ['wallets'],
      });
    },
  });
};

export const useSoftDeleteWallet = (): UseMutationResult<
  void,
  unknown,
  string,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (walletId) => {
      return window.electron.ipcRenderer.wallets.softDelete(walletId);
    },

    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ['wallets'],
      });
    },
  });
};

export const useHardDeleteWallet = (): UseMutationResult<
  void,
  unknown,
  string,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (walletId) => {
      return window.electron.ipcRenderer.wallets.hardDelete(walletId);
    },

    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ['wallets'],
      });
    },
  });
};

export const useRestoreWallet = (): UseMutationResult<
  void,
  unknown,
  string,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (walletId) => {
      return window.electron.ipcRenderer.wallets.restore(walletId);
    },

    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ['wallets'],
      });
    },
  });
};
