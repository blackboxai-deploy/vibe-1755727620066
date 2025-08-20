import { NextRequest, NextResponse } from 'next/server';
import { AIResponse, VideoGenerationResponse, GenerationProgress } from '@/types/podcast';
import { getSessionStatus } from '@/lib/status-manager';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    
    if (!sessionId) {
      return NextResponse.json<AIResponse<null>>({
        success: false,
        error: 'Session ID is required'
      }, { status: 400 });
    }

    const status = getSessionStatus(sessionId);
    
    if (!status) {
      return NextResponse.json<AIResponse<null>>({
        success: false,
        error: 'Session not found'
      }, { status: 404 });
    }

    // Calculate progress
    const progress = calculateProgress(status);
    
    return NextResponse.json<AIResponse<{
      videos: VideoGenerationResponse[];
      progress: GenerationProgress;
    }>>({
      success: true,
      data: {
        videos: status,
        progress
      }
    });

  } catch (error) {
    console.error('Status check error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json<AIResponse<null>>({
      success: false,
      error: `Status check failed: ${errorMessage}`
    }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json({
    message: 'Status check API endpoint',
    methods: ['GET'],
    description: 'Check video generation progress',
    usage: '/api/check-status?sessionId=your-session-id'
  });
}

/**
 * Calculate overall generation progress
 */
function calculateProgress(videos: VideoGenerationResponse[]): GenerationProgress {
  const totalVideos = videos.length;
  const videosCompleted = videos.filter(v => v.status === 'completed').length;
  const videosFailed = videos.filter(v => v.status === 'failed').length;
  const videosInProgress = videos.filter(v => v.status === 'processing').length;
  
  // Find currently processing scene
  const currentProcessingScene = videos.find(v => v.status === 'processing');
  
  // Calculate overall progress percentage
  let overallProgress = 0;
  if (totalVideos > 0) {
    const completedWeight = videosCompleted * 100;
    const processingWeight = videos
      .filter(v => v.status === 'processing')
      .reduce((sum, v) => sum + (v.progress || 0), 0);
    
    overallProgress = Math.round((completedWeight + processingWeight) / totalVideos);
  }
  
  return {
    scriptGenerated: true, // Always true when checking video status
    videosInProgress,
    videosCompleted,
    videosFailed,
    totalVideos,
    currentScene: currentProcessingScene ? `Scene ${currentProcessingScene.sceneId}` : undefined,
    overallProgress: Math.min(overallProgress, 100)
  };
}