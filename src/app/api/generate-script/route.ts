import { NextRequest, NextResponse } from 'next/server';
import { AIClient } from '@/lib/ai-client';
import { ScriptGenerationRequest, AIResponse, PodcastScript } from '@/types/podcast';

export async function POST(request: NextRequest) {
  try {
    const body: ScriptGenerationRequest = await request.json();
    
    // Validate request
    if (!body.topic || body.topic.trim().length === 0) {
      return NextResponse.json<AIResponse<null>>({
        success: false,
        error: 'Topic is required and cannot be empty'
      }, { status: 400 });
    }

    if (body.topic.length > 500) {
      return NextResponse.json<AIResponse<null>>({
        success: false,
        error: 'Topic must be less than 500 characters'
      }, { status: 400 });
    }

    // Generate script using AI
    console.log('Generating script for topic:', body.topic);
    const script = await AIClient.generateScript(body);
    
    // Validate generated script
    if (!script.scenes || script.scenes.length !== 5) {
      throw new Error('Generated script does not contain 5 scenes');
    }

    // Add IDs to scenes if missing
    script.scenes.forEach((scene, index) => {
      if (!scene.id) {
        scene.id = index + 1;
      }
    });

    console.log('Script generated successfully:', script.title);

    return NextResponse.json<AIResponse<PodcastScript>>({
      success: true,
      data: script
    });

  } catch (error) {
    console.error('Script generation error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json<AIResponse<null>>({
      success: false,
      error: `Script generation failed: ${errorMessage}`
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Script generation API endpoint',
    methods: ['POST'],
    description: 'Generate podcast scripts using AI'
  });
}