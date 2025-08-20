import { VideoGenerationResponse } from '@/types/podcast';

// Shared status storage for video generation
// In production, this would be stored in Redis or database
export const videoGenerationStatus = new Map<string, VideoGenerationResponse[]>();

/**
 * Update status for a specific scene in a session
 */
export function updateSceneStatus(sessionId: string, sceneId: number, updates: Partial<VideoGenerationResponse>): void {
  const status = videoGenerationStatus.get(sessionId);
  if (!status) return;

  const sceneIndex = status.findIndex(s => s.sceneId === sceneId);
  if (sceneIndex === -1) return;

  status[sceneIndex] = { ...status[sceneIndex], ...updates };
  videoGenerationStatus.set(sessionId, status);
}

/**
 * Get status for a session
 */
export function getSessionStatus(sessionId: string): VideoGenerationResponse[] | undefined {
  return videoGenerationStatus.get(sessionId);
}

/**
 * Initialize status for a new session
 */
export function initializeSessionStatus(sessionId: string, initialStatus: VideoGenerationResponse[]): void {
  videoGenerationStatus.set(sessionId, initialStatus);
}