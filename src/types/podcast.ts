export interface PodcastScene {
  id: number;
  title: string;
  dialogue: string;
  sceneDescription: string;
  visualDirection: string;
  transitionNote?: string;
  duration?: number;
}

export interface PodcastScript {
  topic: string;
  title: string;
  overview: string;
  scenes: PodcastScene[];
  totalDuration?: number;
}

export interface VideoGenerationRequest {
  sceneId: number;
  prompt: string;
  duration?: number;
}

export interface VideoGenerationResponse {
  sceneId: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  error?: string;
  progress?: number;
}

export interface GenerationProgress {
  scriptGenerated: boolean;
  videosInProgress: number;
  videosCompleted: number;
  videosFailed: number;
  totalVideos: number;
  currentScene?: string;
  overallProgress: number;
}

export interface PodcastEpisode {
  id: string;
  script: PodcastScript;
  videos: VideoGenerationResponse[];
  status: 'script_only' | 'generating' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
}

export interface AIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ScriptGenerationRequest {
  topic: string;
  style?: 'educational' | 'conversational' | 'news' | 'entertainment';
  duration?: 'short' | 'medium' | 'long'; // 2-3 min, 5-7 min, 10-15 min
}