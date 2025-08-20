'use client';

import { PodcastGenerator } from '@/components/PodcastGenerator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center px-6 py-12">
        <div className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              AI Podcast Video Generator
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transform any topic into a professional podcast video with AI-generated scripts and cinematic visuals. 
              Create engaging 5-scene episodes that captivate your audience.
            </p>
          </div>
          
          <div className="flex justify-center flex-wrap gap-3">
            <Badge variant="secondary" className="px-4 py-2">
              ✨ AI Script Writing
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              🎬 Video Generation
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              🔄 Scene Transitions
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              📱 Ready to Share
            </Badge>
          </div>
        </div>
      </section>

      {/* Main Application */}
      <section>
        <PodcastGenerator />
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold">Powerful AI Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create professional podcast videos with artificial intelligence
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🧠</span>
              </div>
              <CardTitle>Intelligent Script Generation</CardTitle>
              <CardDescription>
                Claude Sonnet 4 creates engaging 5-scene podcast scripts with natural transitions and compelling narratives
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎥</span>
              </div>
              <CardTitle>Cinematic Video Creation</CardTitle>
              <CardDescription>
                Veo-3 generates high-quality videos for each scene with professional cinematography and visual storytelling
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔄</span>
              </div>
              <CardTitle>Seamless Playback</CardTitle>
              <CardDescription>
                Watch all scenes flow together as one continuous episode with smooth transitions and scene navigation
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <CardTitle>Fast Processing</CardTitle>
              <CardDescription>
                Parallel video generation processes multiple scenes simultaneously for faster episode creation
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <CardTitle>Customizable Styles</CardTitle>
              <CardDescription>
                Choose from educational, conversational, news, or entertainment formats to match your content style
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <CardTitle>Export & Share</CardTitle>
              <CardDescription>
                Download individual scenes or the complete episode, ready for sharing on any platform
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-4xl mx-auto px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <p className="text-lg text-muted-foreground">
            From idea to video in four simple steps
          </p>
        </div>
        
        <div className="space-y-8">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
              1
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Enter Your Topic</h3>
              <p className="text-muted-foreground">
                Describe your podcast topic in detail. Choose your preferred style and target duration for the best results.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
              2
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">AI Generates Script</h3>
              <p className="text-muted-foreground">
                Claude Sonnet 4 creates a professional 5-scene script with dialogue, scene descriptions, and visual directions.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
              3
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Videos Generate in Parallel</h3>
              <p className="text-muted-foreground">
                Veo-3 creates high-quality videos for all 5 scenes simultaneously, with real-time progress tracking.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
              4
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Watch & Share</h3>
              <p className="text-muted-foreground">
                Enjoy seamless playback of your complete episode with scene navigation and download options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Example Topics Section */}
      <section id="examples" className="max-w-6xl mx-auto px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold">Example Topics</h2>
          <p className="text-lg text-muted-foreground">
            Get inspired by these sample podcast topics
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">The Future of AI in Healthcare</CardTitle>
              <CardDescription>
                Explore how artificial intelligence is revolutionizing medical diagnosis, treatment planning, and patient care
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="outline">Educational</Badge>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Climate Solutions for Smart Cities</CardTitle>
              <CardDescription>
                Discover innovative urban technologies and green infrastructure reducing carbon footprints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="outline">News Format</Badge>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">The Psychology of Remote Work</CardTitle>
              <CardDescription>
                Understanding productivity, mental health, and team dynamics in distributed work environments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="outline">Conversational</Badge>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Cryptocurrency and the Future of Money</CardTitle>
              <CardDescription>
                Examining digital currencies, blockchain technology, and their impact on global finance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="outline">Educational</Badge>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Space Exploration: Mars Missions</CardTitle>
              <CardDescription>
                Latest developments in Mars colonization plans, rover discoveries, and space technology
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="outline">Entertainment</Badge>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Sustainable Fashion Revolution</CardTitle>
              <CardDescription>
                How eco-friendly materials and ethical production are transforming the fashion industry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="outline">Conversational</Badge>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}