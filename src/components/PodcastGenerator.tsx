'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScriptDisplay } from './ScriptDisplay';
import { VideoPlayer } from './VideoPlayer';
import { ProgressTracker } from './ProgressTracker';
import { PodcastScript, VideoGenerationResponse, GenerationProgress, ScriptGenerationRequest } from '@/types/podcast';

type GenerationStep = 'input' | 'generating-script' | 'script-ready' | 'generating-videos' | 'completed' | 'error';

interface PodcastGeneratorProps {
  className?: string;
}

export function PodcastGenerator({ className }: PodcastGeneratorProps) {
  // State management
  const [step, setStep] = useState<GenerationStep>('input');
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState<'educational' | 'conversational' | 'news' | 'entertainment'>('educational');
  const [duration, setDuration] = useState<'short' | 'medium' | 'long'>('medium');
  const [script, setScript] = useState<PodcastScript | null>(null);
  const [videos, setVideos] = useState<VideoGenerationResponse[]>([]);
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, setSessionId] = useState<string>('');

  // Reset state
  const resetState = useCallback(() => {
    setStep('input');
    setScript(null);
    setVideos([]);
    setProgress(null);
    setError(null);
    setSessionId('');
  }, []);

  // Generate script
  const generateScript = useCallback(async () => {
    if (!topic.trim()) {
      setError('Please enter a podcast topic');
      return;
    }

    setError(null);
    setStep('generating-script');

    try {
      const request: ScriptGenerationRequest = {
        topic: topic.trim(),
        style,
        duration
      };

      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate script');
      }

      setScript(data.data);
      setStep('script-ready');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Script generation failed: ${errorMessage}`);
      setStep('error');
    }
  }, [topic, style, duration]);

  // Generate videos
  const generateVideos = useCallback(async () => {
    if (!script) {
      setError('No script available for video generation');
      return;
    }

    setError(null);
    setStep('generating-videos');

    try {
      // Generate unique session ID
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);

      // Start video generation
      const response = await fetch('/api/generate-videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scenes: script.scenes,
          sessionId: newSessionId
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to start video generation');
      }

      // Initialize progress tracking
      setProgress({
        scriptGenerated: true,
        videosInProgress: script.scenes.length,
        videosCompleted: 0,
        videosFailed: 0,
        totalVideos: script.scenes.length,
        overallProgress: 0
      });

      // Start polling for status updates
      startStatusPolling(newSessionId);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Video generation failed: ${errorMessage}`);
      setStep('error');
    }
  }, [script]);

  // Poll for video generation status
  const startStatusPolling = useCallback((pollingSessionId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/check-status?sessionId=${pollingSessionId}`);
        const data = await response.json();

        if (data.success) {
          setVideos(data.data.videos);
          setProgress(data.data.progress);

          // Check if all videos are complete or failed
          const allDone = data.data.videos.every((v: VideoGenerationResponse) => 
            v.status === 'completed' || v.status === 'failed'
          );

          if (allDone) {
            clearInterval(pollInterval);
            const hasSuccessfulVideos = data.data.videos.some((v: VideoGenerationResponse) => 
              v.status === 'completed'
            );
            
            if (hasSuccessfulVideos) {
              setStep('completed');
            } else {
              setError('All video generations failed');
              setStep('error');
            }
          }
        }
      } catch (err) {
        console.error('Status polling error:', err);
        // Continue polling on error
      }
    }, 3000); // Poll every 3 seconds

    // Cleanup polling after 15 minutes (safety measure)
    setTimeout(() => clearInterval(pollInterval), 15 * 60 * 1000);
  }, []);

  // Handle script editing
  const handleScriptEdit = useCallback((editedScript: PodcastScript) => {
    setScript(editedScript);
  }, []);

  return (
    <div className={`max-w-6xl mx-auto p-6 space-y-8 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AI Podcast Video Generator
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Transform your podcast topics into engaging video episodes with AI-generated scripts and cinematic visuals
        </p>
        
        {/* Status badges */}
        <div className="flex justify-center space-x-2">
          <Badge variant={step === 'input' || step === 'generating-script' ? 'default' : 'secondary'}>
            Script Generation
          </Badge>
          <Badge variant={step === 'generating-videos' ? 'default' : step === 'completed' ? 'default' : 'secondary'}>
            Video Creation
          </Badge>
          <Badge variant={step === 'completed' ? 'default' : 'secondary'}>
            Ready to Watch
          </Badge>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Step 1: Input Form */}
      {step === 'input' && (
        <Card>
          <CardHeader>
            <CardTitle>Create Your Podcast Episode</CardTitle>
            <CardDescription>
              Enter your topic and preferences to generate an AI-powered podcast video
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="topic" className="text-sm font-medium">
                Podcast Topic *
              </label>
              <Textarea
                id="topic"
                placeholder="e.g., The future of artificial intelligence in healthcare, Climate change solutions for urban cities, The psychology of productivity..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="style" className="text-sm font-medium">
                  Style
                </label>
                <Select value={style} onValueChange={(value: any) => setStyle(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="conversational">Conversational</SelectItem>
                    <SelectItem value="news">News Format</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="duration" className="text-sm font-medium">
                  Target Duration
                </label>
                <Select value={duration} onValueChange={(value: any) => setDuration(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short (2-3 min)</SelectItem>
                    <SelectItem value="medium">Medium (5-7 min)</SelectItem>
                    <SelectItem value="long">Long (10-15 min)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={generateScript} 
              disabled={!topic.trim()}
              className="w-full"
              size="lg"
            >
              Generate Podcast Script
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Script Generation Progress */}
      {step === 'generating-script' && (
        <Card>
          <CardContent className="pt-8">
            <div className="text-center space-y-4">
              <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full mx-auto"></div>
              <p className="text-lg font-medium">Generating your podcast script...</p>
              <p className="text-muted-foreground">AI is creating 5 engaging scenes with natural transitions</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Script Review */}
      {step === 'script-ready' && script && (
        <div className="space-y-6">
          <ScriptDisplay 
            script={script} 
            onEdit={handleScriptEdit}
            editable={true}
          />
          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={resetState}>
              Start Over
            </Button>
            <Button onClick={generateVideos} size="lg">
              Generate Videos
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Video Generation Progress */}
      {step === 'generating-videos' && progress && (
        <div className="space-y-6">
          {script && (
            <ScriptDisplay 
              script={script} 
              onEdit={() => {}} 
              editable={false}
            />
          )}
          <ProgressTracker progress={progress} videos={videos} />
        </div>
      )}

      {/* Step 5: Completed - Video Player */}
      {step === 'completed' && videos.length > 0 && (
        <div className="space-y-6">
          <VideoPlayer 
            videos={videos.filter(v => v.status === 'completed')} 
            script={script}
          />
          <div className="flex justify-center">
            <Button variant="outline" onClick={resetState}>
              Create Another Episode
            </Button>
          </div>
        </div>
      )}

      {/* Error State */}
      {step === 'error' && (
        <Card>
          <CardContent className="pt-8">
            <div className="text-center space-y-4">
              <div className="text-red-500 text-xl">⚠️</div>
              <p className="text-lg font-medium text-red-600">Generation Failed</p>
              <p className="text-muted-foreground">Something went wrong during the generation process</p>
              <Button onClick={resetState} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}