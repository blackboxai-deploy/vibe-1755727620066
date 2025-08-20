import { NextRequest, NextResponse } from 'next/server';
import { AIClient } from '@/lib/ai-client';
import { VideoGenerationResponse, AIResponse, PodcastScene } from '@/types/podcast';
import { initializeSessionStatus, updateSceneStatus } from '@/lib/status-manager';

export async function POST(request: NextRequest) {
  try {
    const body: { scenes: PodcastScene[], sessionId: string } = await request.json();
    
    // Validate request
    if (!body.scenes || body.scenes.length === 0) {
      return NextResponse.json<AIResponse<null>>({
        success: false,
        error: 'Scenes are required'
      }, { status: 400 });
    }

    if (!body.sessionId) {
      return NextResponse.json<AIResponse<null>>({
        success: false,
        error: 'Session ID is required'
      }, { status: 400 });
    }

    const { scenes, sessionId } = body;
    
    // Initialize status tracking
    const initialStatus: VideoGenerationResponse[] = scenes.map(scene => ({
      sceneId: scene.id,
      status: 'pending',
      progress: 0
    }));
    
    initializeSessionStatus(sessionId, initialStatus);

    // Start video generation for all scenes in parallel
    console.log(`Starting video generation for ${scenes.length} scenes`);
    
    const generationPromises = scenes.map(async (scene) => {
      try {
        // Update status to processing
        updateSceneStatus(sessionId, scene.id, { status: 'processing', progress: 25 });
        
        // Create video prompt from scene data
        const videoPrompt = createVideoPrompt(scene);
        console.log(`Generating video for scene ${scene.id}: ${scene.title}`);
        
        // Update progress
        updateSceneStatus(sessionId, scene.id, { progress: 50 });
        
        // Generate video using AI
        const videoUrl = await AIClient.generateVideo(videoPrompt, 30);
        
        // Update status to completed
        updateSceneStatus(sessionId, scene.id, { 
          status: 'completed', 
          videoUrl, 
          progress: 100 
        });
        
        console.log(`Video completed for scene ${scene.id}`);
        
      } catch (error) {
        console.error(`Video generation failed for scene ${scene.id}:`, error);
        updateSceneStatus(sessionId, scene.id, { 
          status: 'failed', 
          error: error instanceof Error ? error.message : 'Unknown error',
          progress: 0 
        });
      }
    });

    // Don't wait for completion, return immediately with session ID
    Promise.all(generationPromises).then(() => {
      console.log(`All video generation tasks completed for session ${sessionId}`);
    });

    return NextResponse.json<AIResponse<{ sessionId: string, totalScenes: number }>>({
      success: true,
      data: {
        sessionId,
        totalScenes: scenes.length
      }
    });

  } catch (error) {
    console.error('Video generation setup error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json<AIResponse<null>>({
      success: false,
      error: `Video generation setup failed: ${errorMessage}`
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Video generation API endpoint',
    methods: ['POST'],
    description: 'Generate videos for podcast scenes using AI'
  });
}

/**
 * Create optimized video prompt from scene data
 */
function createVideoPrompt(scene: PodcastScene): string {
  return `
Scene Title: ${scene.title}

Visual Setting: ${scene.sceneDescription}

Visual Direction: ${scene.visualDirection}

Dialogue Context: ${scene.dialogue}

${scene.transitionNote ? `Transition: ${scene.transitionNote}` : ''}

Style Requirements:
- High-quality cinematic video
- Professional podcast production value
- Engaging visual storytelling
- Smooth camera movements
- Appropriate lighting and mood
- Duration: 30 seconds
- Seamless for video stitching

Create a compelling visual representation that matches the dialogue and enhances the podcast narrative.
`.trim();
}

