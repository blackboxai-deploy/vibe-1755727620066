import { VideoGenerationResponse } from '@/types/podcast';

export class VideoUtils {
  
  /**
   * Check if a video URL is valid and accessible
   */
  static async validateVideoUrl(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok && (response.headers.get('content-type')?.includes('video') ?? false);
    } catch (error) {
      console.error('Video validation failed:', error);
      return false;
    }
  }

  /**
   * Get video duration from URL
   */
  static getVideoDuration(videoElement: HTMLVideoElement): Promise<number> {
    return new Promise((resolve, reject) => {
      if (videoElement.duration && !isNaN(videoElement.duration)) {
        resolve(videoElement.duration);
        return;
      }

      const handleLoadedMetadata = () => {
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        videoElement.removeEventListener('error', handleError);
        resolve(videoElement.duration);
      };

      const handleError = () => {
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        videoElement.removeEventListener('error', handleError);
        reject(new Error('Failed to load video metadata'));
      };

      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.addEventListener('error', handleError);
    });
  }

  /**
   * Create a playlist manager for seamless video playback
   */
  static createVideoPlaylist(videos: VideoGenerationResponse[]): VideoPlaylistManager {
    return new VideoPlaylistManager(videos.filter(v => v.status === 'completed' && v.videoUrl));
  }

  /**
   * Preload video for smooth playback
   */
  static preloadVideo(url: string): Promise<HTMLVideoElement> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.crossOrigin = 'anonymous';
      
      video.addEventListener('loadedmetadata', () => resolve(video));
      video.addEventListener('error', () => reject(new Error(`Failed to load video: ${url}`)));
      
      video.src = url;
    });
  }

  /**
   * Generate thumbnail from video
   */
  static generateThumbnail(videoElement: HTMLVideoElement, time: number = 0): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        reject(new Error('Canvas context not available'));
        return;
      }

      videoElement.currentTime = time;
      
      videoElement.addEventListener('seeked', () => {
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        context.drawImage(videoElement, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      }, { once: true });
    });
  }
}

/**
 * Video Playlist Manager for seamless playback of multiple videos
 */
export class VideoPlaylistManager {
  private videos: VideoGenerationResponse[];
  private currentIndex: number = 0;
  private videoElement: HTMLVideoElement | null = null;
  private onSceneChange?: (sceneIndex: number) => void;
  private onPlaylistEnd?: () => void;

  constructor(videos: VideoGenerationResponse[]) {
    this.videos = videos.sort((a, b) => a.sceneId - b.sceneId);
  }

  /**
   * Initialize playlist with video element
   */
  async initialize(videoElement: HTMLVideoElement): Promise<void> {
    this.videoElement = videoElement;
    this.setupEventListeners();
    
    if (this.videos.length > 0) {
      await this.loadVideo(0);
    }
  }

  /**
   * Setup event listeners for automatic scene transitions
   */
  private setupEventListeners(): void {
    if (!this.videoElement) return;

    this.videoElement.addEventListener('ended', () => {
      this.playNext();
    });

    this.videoElement.addEventListener('loadedmetadata', () => {
      if (this.onSceneChange) {
        this.onSceneChange(this.currentIndex);
      }
    });
  }

  /**
   * Load specific video by index
   */
  async loadVideo(index: number): Promise<void> {
    if (!this.videoElement || index < 0 || index >= this.videos.length) {
      return;
    }

    this.currentIndex = index;
    const video = this.videos[index];
    
    if (video.videoUrl) {
      this.videoElement.src = video.videoUrl;
      await this.videoElement.load();
    }
  }

  /**
   * Play current video
   */
  async play(): Promise<void> {
    if (this.videoElement) {
      await this.videoElement.play();
    }
  }

  /**
   * Pause current video
   */
  pause(): void {
    if (this.videoElement) {
      this.videoElement.pause();
    }
  }

  /**
   * Play next video in sequence
   */
  async playNext(): Promise<void> {
    if (this.currentIndex < this.videos.length - 1) {
      await this.loadVideo(this.currentIndex + 1);
      await this.play();
    } else {
      // Playlist ended
      if (this.onPlaylistEnd) {
        this.onPlaylistEnd();
      }
    }
  }

  /**
   * Play previous video
   */
  async playPrevious(): Promise<void> {
    if (this.currentIndex > 0) {
      await this.loadVideo(this.currentIndex - 1);
      await this.play();
    }
  }

  /**
   * Jump to specific scene
   */
  async jumpToScene(sceneIndex: number): Promise<void> {
    await this.loadVideo(sceneIndex);
    await this.play();
  }

  /**
   * Get current scene info
   */
  getCurrentScene(): { index: number; video: VideoGenerationResponse } | null {
    if (this.currentIndex >= 0 && this.currentIndex < this.videos.length) {
      return {
        index: this.currentIndex,
        video: this.videos[this.currentIndex]
      };
    }
    return null;
  }

  /**
   * Get total duration of all videos
   */
  async getTotalDuration(): Promise<number> {
    let totalDuration = 0;
    
    for (const video of this.videos) {
      if (video.videoUrl) {
        try {
          const videoEl = await VideoUtils.preloadVideo(video.videoUrl);
          const duration = await VideoUtils.getVideoDuration(videoEl);
          totalDuration += duration;
        } catch (error) {
          console.warn(`Failed to get duration for scene ${video.sceneId}:`, error);
        }
      }
    }
    
    return totalDuration;
  }

  /**
   * Set scene change callback
   */
  onSceneChangeCallback(callback: (sceneIndex: number) => void): void {
    this.onSceneChange = callback;
  }

  /**
   * Set playlist end callback
   */
  onPlaylistEndCallback(callback: () => void): void {
    this.onPlaylistEnd = callback;
  }

  /**
   * Get playlist info
   */
  getPlaylistInfo(): { currentIndex: number; totalScenes: number; scenes: VideoGenerationResponse[] } {
    return {
      currentIndex: this.currentIndex,
      totalScenes: this.videos.length,
      scenes: this.videos
    };
  }
}