/**
 * BabyGuide PH — Offline Action Queue
 *
 * Generic AsyncStorage-backed queue for actions that need to be
 * retried when the network becomes available (community posts, comments).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const OFFLINE_QUEUE_KEY = '@babyguide_offline_queue';

export interface QueuedAction {
  id: string;
  type: 'create_post' | 'add_comment';
  payload: Record<string, unknown>;
  timestamp: string;
}

export async function enqueueAction(action: Omit<QueuedAction, 'id' | 'timestamp'>): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
    const queue: QueuedAction[] = stored ? JSON.parse(stored) : [];
    queue.push({
      ...action,
      id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      timestamp: new Date().toISOString(),
    });
    await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  } catch {
    // Silently fail — offline queue should never block the app
  }
}

export async function dequeueAll(): Promise<QueuedAction[]> {
  try {
    const stored = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
    if (!stored) return [];
    const queue: QueuedAction[] = JSON.parse(stored);
    await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify([]));
    return queue;
  } catch {
    return [];
  }
}

export async function getQueueLength(): Promise<number> {
  try {
    const stored = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
    if (!stored) return 0;
    const queue: QueuedAction[] = JSON.parse(stored);
    return queue.length;
  } catch {
    return 0;
  }
}

export async function clearQueue(): Promise<void> {
  try {
    await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify([]));
  } catch {
    // Silently fail
  }
}
