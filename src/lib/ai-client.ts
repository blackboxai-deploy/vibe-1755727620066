import { PodcastScript, ScriptGenerationRequest } from '@/types/podcast';

// Custom endpoint configuration (no API keys required)
const CUSTOM_ENDPOINT = 'https://oi-server.onrender.com/chat/completions';
const CUSTOM_HEADERS = {
  'customerId': 'cus_S16jfiBUH2cc7P',
  'Content-Type': 'application/json',
  'Authorization': 'Bearer xxx',
};

export class AIClient {
  
  /**
   * Generate podcast script using Claude Sonnet 4
   */
  static async generateScript(request: ScriptGenerationRequest): Promise<PodcastScript> {
    const systemPrompt = `You are an expert podcast script writer. Create engaging, natural-flowing podcast scripts with excellent scene transitions.

REQUIREMENTS:
- Create exactly 5 scenes that flow naturally together
- Each scene should be 30-60 seconds when spoken
- Include natural transitions between scenes
- Provide visual directions for video generation
- Make dialogue conversational and engaging
- Topic focus: Educational and entertaining content

OUTPUT FORMAT (JSON only):
{
  "topic": "user_topic",
  "title": "catchy_episode_title",
  "overview": "2-3 sentence overview",
  "scenes": [
    {
      "id": 1,
      "title": "scene_title",
      "dialogue": "natural spoken dialogue",
      "sceneDescription": "setting and context",
      "visualDirection": "detailed visual description for video AI",
      "transitionNote": "how this connects to next scene"
    }
  ]
}

VISUAL DIRECTION GUIDELINES:
- Describe scenes cinematically for AI video generation
- Include lighting, setting, camera angles, mood
- Be specific about visual elements and atmosphere
- Consider transitions between scenes`;

    const userPrompt = `Create a 5-scene podcast script about: ${request.topic}

Style: ${request.style || 'educational'}
Duration: ${request.duration || 'medium'}

Make it engaging, informative, and visually compelling for video generation.`;

    const response = await fetch(CUSTOM_ENDPOINT, {
      method: 'POST',
      headers: CUSTOM_HEADERS,
      body: JSON.stringify({
        model: 'openrouter/anthropic/claude-sonnet-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000
      }),
    });

    if (!response.ok) {
      throw new Error(`Script generation failed: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No script content received from AI');
    }

    try {
      // Extract JSON from response (handle potential markdown formatting)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : content;
      const script = JSON.parse(jsonStr);
      
      // Validate required fields
      if (!script.scenes || script.scenes.length !== 5) {
        throw new Error('Script must contain exactly 5 scenes');
      }

      return script as PodcastScript;
    } catch (error) {
      console.error('Failed to parse script JSON:', error);
      throw new Error('Invalid script format received from AI');
    }
  }

  /**
   * Generate video for a single scene using Veo-3
   */
  static async generateVideo(prompt: string, duration: number = 10): Promise<string> {
    const enhancedPrompt = `Create a high-quality video for a podcast scene: ${prompt}. 
    
Style: Professional, cinematic, engaging for podcast audience. 
Duration: ${duration} seconds.
Quality: High resolution, smooth transitions, appropriate lighting.
Mood: Match the content tone - educational yet entertaining.`;

    const response = await fetch(CUSTOM_ENDPOINT, {
      method: 'POST',
      headers: CUSTOM_HEADERS,
      body: JSON.stringify({
        model: 'replicate/google/veo-3',
        messages: [
          { role: 'user', content: enhancedPrompt }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error(`Video generation failed: ${response.statusText}`);
    }

    const data = await response.json();
    const videoUrl = data.choices?.[0]?.message?.content;

    if (!videoUrl) {
      throw new Error('No video URL received from AI');
    }

    return videoUrl;
  }

  /**
   * Test AI connection and model availability
   */
  static async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(CUSTOM_ENDPOINT, {
        method: 'POST',
        headers: CUSTOM_HEADERS,
        body: JSON.stringify({
          model: 'openrouter/anthropic/claude-sonnet-4',
          messages: [
            { role: 'user', content: 'Test connection. Respond with "OK".' }
          ],
          max_tokens: 10
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('AI connection test failed:', error);
      return false;
    }
  }
}