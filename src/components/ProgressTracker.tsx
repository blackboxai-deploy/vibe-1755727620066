'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { GenerationProgress, VideoGenerationResponse } from '@/types/podcast';

interface ProgressTrackerProps {
  progress: GenerationProgress;
  videos: VideoGenerationResponse[];
}

export function ProgressTracker({ progress, videos }: ProgressTrackerProps) {
  const getStatusColor = (status: VideoGenerationResponse['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'processing': return 'bg-blue-500 animate-pulse';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusText = (status: VideoGenerationResponse['status']) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'processing': return 'Processing...';
      case 'failed': return 'Failed';
      default: return 'Pending';
    }
  };

  const getStatusVariant = (status: VideoGenerationResponse['status']) => {
    switch (status) {
      case 'completed': return 'default' as const;
      case 'processing': return 'secondary' as const;
      case 'failed': return 'destructive' as const;
      default: return 'outline' as const;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Video Generation Progress</span>
            <Badge variant="secondary">{progress.overallProgress}% Complete</Badge>
          </CardTitle>
          <CardDescription>
            {progress.currentScene ? `Currently processing: ${progress.currentScene}` : 'Processing videos...'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress.overallProgress} className="w-full" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{progress.totalVideos}</div>
              <div className="text-sm text-muted-foreground">Total Videos</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">{progress.videosCompleted}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{progress.videosInProgress}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-red-600">{progress.videosFailed}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Video Status */}
      <Card>
        <CardHeader>
          <CardTitle>Scene Generation Status</CardTitle>
          <CardDescription>Individual video generation progress for each scene</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {videos
              .sort((a, b) => a.sceneId - b.sceneId)
              .map((video) => (
                <div key={video.sceneId} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(video.status)}`}></div>
                    </div>
                    <div>
                      <div className="font-medium">Scene {video.sceneId}</div>
                      <div className="text-sm text-muted-foreground">
                        {video.error ? video.error : getStatusText(video.status)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {/* Progress for individual scene */}
                    {video.status === 'processing' && video.progress !== undefined && (
                      <div className="flex items-center space-x-2">
                        <Progress value={video.progress} className="w-24" />
                        <span className="text-sm text-muted-foreground">{video.progress}%</span>
                      </div>
                    )}
                    
                    <Badge variant={getStatusVariant(video.status)}>
                      {getStatusText(video.status)}
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Generation Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Video generation typically takes 2-5 minutes per scene
            </p>
            <p className="text-xs text-muted-foreground">
              You can watch completed videos while others are still processing
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}