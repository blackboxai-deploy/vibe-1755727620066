'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { VideoGenerationResponse, PodcastScript } from '@/types/podcast';
import { VideoPlaylistManager } from '@/lib/video-utils';

interface VideoPlayerProps {
  videos: VideoGenerationResponse[];
  script?: PodcastScript | null;
}

export function VideoPlayer({ videos, script }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playlistManagerRef = useRef<VideoPlaylistManager | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [playlistReady, setPlaylistReady] = useState(false);

  // Initialize playlist manager
  useEffect(() => {
    if (videos.length > 0 && videoRef.current) {
      const completedVideos = videos.filter(v => v.status === 'completed' && v.videoUrl);
      
      if (completedVideos.length > 0) {
        playlistManagerRef.current = new VideoPlaylistManager(completedVideos);
        
        // Set up callbacks
        playlistManagerRef.current.onSceneChangeCallback((sceneIndex) => {
          setCurrentScene(sceneIndex);
        });
        
        playlistManagerRef.current.onPlaylistEndCallback(() => {
          setIsPlaying(false);
          setCurrentScene(0);
        });
        
        // Initialize with video element
        playlistManagerRef.current.initialize(videoRef.current).then(() => {
          setPlaylistReady(true);
          setIsLoading(false);
        });
      }
    }
  }, [videos]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(video.duration);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  // Control functions
  const handlePlayPause = useCallback(async () => {
    if (!playlistManagerRef.current) return;

    if (isPlaying) {
      playlistManagerRef.current.pause();
    } else {
      await playlistManagerRef.current.play();
    }
  }, [isPlaying]);

  const handlePrevious = useCallback(async () => {
    if (playlistManagerRef.current) {
      await playlistManagerRef.current.playPrevious();
    }
  }, []);

  const handleNext = useCallback(async () => {
    if (playlistManagerRef.current) {
      await playlistManagerRef.current.playNext();
    }
  }, []);

  const jumpToScene = useCallback(async (sceneIndex: number) => {
    if (playlistManagerRef.current) {
      await playlistManagerRef.current.jumpToScene(sceneIndex);
    }
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const completedVideos = videos.filter(v => v.status === 'completed');
  const currentScriptScene = script?.scenes[currentScene];

  return (
    <div className="space-y-6">
      {/* Main Video Player */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Podcast Video Episode</span>
            <Badge variant="secondary">
              Scene {currentScene + 1} of {completedVideos.length}
            </Badge>
          </CardTitle>
          {script && (
            <CardDescription>{script.title}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Video Element */}
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              controls={false}
              playsInline
            >
              Your browser does not support the video tag.
            </video>
            
            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-white text-center space-y-2">
                  <div className="animate-spin h-8 w-8 border-b-2 border-white rounded-full mx-auto"></div>
                  <p>Loading video...</p>
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrevious}
              disabled={!playlistReady || currentScene === 0}
            >
              Previous
            </Button>
            
            <Button 
              onClick={handlePlayPause}
              disabled={!playlistReady}
              size="lg"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleNext}
              disabled={!playlistReady || currentScene === completedVideos.length - 1}
            >
              Next
            </Button>
          </div>

          {/* Current Scene Info */}
          {currentScriptScene && (
            <Card className="bg-muted">
              <CardContent className="pt-4">
                <h4 className="font-medium mb-2">Current Scene: {currentScriptScene.title}</h4>
                <p className="text-sm text-muted-foreground italic">
                  {currentScriptScene.dialogue}
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Scene Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>Scene Navigation</CardTitle>
          <CardDescription>Jump to any scene in your podcast episode</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {completedVideos.map((video, index) => {
              const sceneData = script?.scenes.find(s => s.id === video.sceneId);
              const isActive = index === currentScene;
              
              return (
                <Button
                  key={video.sceneId}
                  variant={isActive ? "default" : "outline"}
                  className="h-auto p-4 text-left justify-start"
                  onClick={() => jumpToScene(index)}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Scene {video.sceneId}</span>
                      {isActive && (
                        <Badge variant="secondary" className="text-xs">Playing</Badge>
                      )}
                    </div>
                    {sceneData && (
                      <div className="text-sm opacity-80">
                        {sceneData.title}
                      </div>
                    )}
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Download Options */}
      <Card>
        <CardHeader>
          <CardTitle>Download Videos</CardTitle>
          <CardDescription>Save individual scenes or the complete episode</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Individual Downloads */}
            <div className="space-y-3">
              <h4 className="font-medium">Individual Scenes</h4>
              {completedVideos.map((video) => {
                const sceneData = script?.scenes.find(s => s.id === video.sceneId);
                return (
                  <div key={video.sceneId} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm">
                      Scene {video.sceneId}{sceneData ? `: ${sceneData.title}` : ''}
                    </span>
                    <Button variant="outline" size="sm">
                      <a href={video.videoUrl || '#'} download={`scene-${video.sceneId}.mp4`}>
                        Download
                      </a>
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Episode Info */}
            <div className="space-y-3">
              <h4 className="font-medium">Episode Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Scenes:</span>
                  <span>{completedVideos.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge variant="default">Ready</Badge>
                </div>
                {script && (
                  <>
                    <div className="flex justify-between">
                      <span>Topic:</span>
                      <span className="text-right">{script.topic}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Title:</span>
                      <span className="text-right">{script.title}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}