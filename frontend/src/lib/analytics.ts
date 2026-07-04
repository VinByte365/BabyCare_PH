/**
 * BabyGuide PH — Analytics Module
 *
 * Anonymized event logging system.
 * Events are queued locally in AsyncStorage and flushed to the
 * backend API when the network is available.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './api';

const ANALYTICS_QUEUE_KEY = '@babyguide_analytics_queue';

export type EventName =
  | 'symptom_checker_started'
  | 'symptom_checker_completed'
  | 'symptom_checker_emergency'
  | 'disease_viewed'
  | 'care_guide_viewed'
  | 'care_guide_bookmarked'
  | 'emergency_alert_viewed'
  | 'emergency_guide_viewed'
  | 'emergency_call_placed'
  | 'community_feed_viewed'
  | 'community_post_viewed'
  | 'community_post_created'
  | 'community_comment_added'
  | 'library_search'
  | 'profile_updated'
  | 'app_opened';

export interface AnalyticsEvent {
  name: EventName;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

let sessionStartTime: string | null = null;

function getSessionDuration(): number {
  if (!sessionStartTime) return 0;
  return Date.now() - new Date(sessionStartTime).getTime();
}

export async function startAnalyticsSession(): Promise<void> {
  sessionStartTime = new Date().toISOString();
}

export async function logEvent(
  name: EventName,
  metadata?: Record<string, unknown>,
): Promise<void> {
  const event: AnalyticsEvent = {
    name,
    timestamp: new Date().toISOString(),
    metadata: {
      ...metadata,
      sessionDurationMs: getSessionDuration(),
    },
  };

  try {
    const stored = await AsyncStorage.getItem(ANALYTICS_QUEUE_KEY);
    const queue: AnalyticsEvent[] = stored ? JSON.parse(stored) : [];
    queue.push(event);
    await AsyncStorage.setItem(ANALYTICS_QUEUE_KEY, JSON.stringify(queue));
  } catch {
    // Silently fail — analytics should never block app usage
  }

  // Attempt flush in background
  flushAnalytics();
}

export async function flushAnalytics(): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(ANALYTICS_QUEUE_KEY);
    if (!stored) return;
    const queue: AnalyticsEvent[] = JSON.parse(stored);
    if (queue.length === 0) return;

    // Try to send to backend; if it fails, keep the queue
    try {
      await api.post('/analytics/events', { events: queue });
      // Clear queue on success
      await AsyncStorage.setItem(ANALYTICS_QUEUE_KEY, JSON.stringify([]));
    } catch {
      // Network unavailable — keep queue for later
    }
  } catch {
    // Silently fail
  }
}

export async function getQueuedEventCount(): Promise<number> {
  try {
    const stored = await AsyncStorage.getItem(ANALYTICS_QUEUE_KEY);
    if (!stored) return 0;
    const queue: AnalyticsEvent[] = JSON.parse(stored);
    return queue.length;
  } catch {
    return 0;
  }
}
