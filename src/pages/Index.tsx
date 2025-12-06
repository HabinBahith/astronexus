import { Link } from "react-router-dom";
import { ArrowRight, Compass, Rocket, Satellite, Newspaper, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLayout } from "./PageLayout";

const Index = () => {
  return (
    <PageLayout>
      <section className="relative w-full overflow-hidden rounded-2xl glass-panel border border-primary/20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background/40 to-background pointer-events-none" />
        <div className="relative p-6 md:p-12 flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-glow-cyan">
              Welcome to ASTRO<span className="text-primary">NEXUS</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Transforming complex space data into easy-to-understand, simple visual UI experiences. 
              Our mission is to make space exploration accessible to everyone by presenting intricate 
              astronomical information, satellite tracking, space news, and planetary data through 
              intuitive interfaces and interactive visualizations. Explore the cosmos with clarity and ease.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="glass-panel border border-border/50 hover:border-primary/50 transition-all">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Satellite className="w-5 h-5 text-primary" />
              </div>
              <CardTitle>ISS Tracker</CardTitle>
            </div>
            <CardDescription>Track the International Space Station in real-time</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/tracker">
                View Tracker
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-panel border border-border/50 hover:border-primary/50 transition-all">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Newspaper className="w-5 h-5 text-primary" />
              </div>
              <CardTitle>Space News</CardTitle>
            </div>
            <CardDescription>Stay updated with space news and weather conditions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/weather">
                View News
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-panel border border-border/50 hover:border-primary/50 transition-all">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <CardTitle>Gallery</CardTitle>
            </div>
            <CardDescription>Explore stunning images from NASA, ESA, and JWST. Search and filter to discover the universe.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/gallery">
                Explore Images
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-panel border border-border/50 hover:border-primary/50 transition-all">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-primary" />
              </div>
              <CardTitle>Missions</CardTitle>
            </div>
            <CardDescription>Discover upcoming and past space missions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/missions">
                View Missions
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-panel border border-border/50 hover:border-primary/50 transition-all">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Compass className="w-5 h-5 text-primary" />
              </div>
              <CardTitle>AI Explainer</CardTitle>
            </div>
            <CardDescription>Get answers to your space-related questions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/ai">
                Ask AI
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>


     
<Card className="glass-panel border border-border/50 hover:border-primary/50 transition-all">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Compass className="w-5 h-5 text-primary" />
              </div>
              <CardTitle>Telescope</CardTitle>
            </div>
            <CardDescription>Explore the vast Universe!</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/telescope">
                Explore Telescope
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
 </section>
    </PageLayout>
  );};
export default Index;
