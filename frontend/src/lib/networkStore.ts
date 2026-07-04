/**
 * BabyGuide PH — Network State Store
 *
 * Tracks online/offline connectivity via @react-native-community/netinfo.
 */

import { create } from 'zustand';
import NetInfo from '@react-native-community/netinfo';

interface NetworkState {
  isConnected: boolean;
  wasPreviouslyConnected: boolean;
  initialize: () => () => void;
}

export const useNetworkStore = create<NetworkState>((set, get) => ({
  isConnected: true,
  wasPreviouslyConnected: true,

  initialize: () => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected = state.isConnected ?? true;
      const prev = get().isConnected;
      set({ isConnected: connected, wasPreviouslyConnected: prev });
    });
    return unsubscribe;
  },
}));
