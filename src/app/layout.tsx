import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Podcast Video Generator',
  description: 'Transform your podcast topics into engaging video episodes with AI-generated scripts and cinematic visuals',
  keywords: 'podcast, AI, video generation, script writing, content creation',
  authors: [{ name: 'AI Podcast Studio' }],
  creator: 'AI Podcast Video Generator',
  publisher: 'AI Podcast Studio',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ai-podcast-generator.com',
    title: 'AI Podcast Video Generator',
    description: 'Transform your podcast topics into engaging video episodes with AI-generated scripts and cinematic visuals',
    siteName: 'AI Podcast Video Generator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Podcast Video Generator',
    description: 'Transform your podcast topics into engaging video episodes with AI-generated scripts and cinematic visuals',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          {/* Navigation Header */}
          <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
            <div className="max-w-6xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">AI</span>
                  </div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Podcast Video Generator
                  </h1>
                </div>
                <nav className="hidden md:flex items-center space-x-6">
                  <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Features
                  </a>
                  <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    How It Works
                  </a>
                  <a href="#examples" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Examples
                  </a>
                </nav>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="py-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 mt-16">
            <div className="max-w-6xl mx-auto px-6 py-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded"></div>
                    <span className="font-semibold">AI Podcast Studio</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Transform your ideas into engaging podcast videos with the power of AI.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold">Features</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>AI Script Generation</li>
                    <li>Video Creation</li>
                    <li>Scene Transitions</li>
                    <li>Export Options</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold">Use Cases</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Educational Content</li>
                    <li>Business Presentations</li>
                    <li>Marketing Videos</li>
                    <li>Social Media Content</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold">AI Models</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Claude Sonnet 4</li>
                    <li>Veo-3 Video Generation</li>
                    <li>Advanced Processing</li>
                    <li>High Quality Output</li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
                <p>&copy; 2024 AI Podcast Video Generator. Powered by advanced AI models.</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}