import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Contact, Share, Check } from "lucide-react";
import Link from "next/link";
import Home from "./home";
import ProfileLoader from "@/components/profileLoader";
import Header from "@/components/Header";

export const revalidate = 60;


export default async function Page() {
  const session = await auth();

  return (
    <>
      {session?.user ? (
        <ProfileLoader>
          <Header />
          <Home />
        </ProfileLoader>
      ) : (
        <div className="w-full px-6 py-12 lg:px-20 lg:py-16">
          <div className="flex flex-col items-center justify-center gap-6 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Welcome to SocialWave
            </h1>
            <p className="max-w-2xl text-muted-foreground text-base sm:text-lg md:text-xl">
              Connect with friends, share moments, and discover stories from around the world.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/auth/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card className="flex flex-col items-center gap-4 p-8 text-center shadow-md bg-background">
              <Contact className="h-10 w-10 text-primary" />
              <h3 className="text-xl font-semibold">Connect</h3>
              <p className="text-sm text-muted-foreground">
                Find and follow friends, family, and interesting personalities.
              </p>
            </Card>

            <Card className="flex flex-col items-center gap-4 p-8 text-center shadow-md bg-background">
              <Share className="h-10 w-10 text-primary" />
              <h3 className="text-xl font-semibold">Share</h3>
              <p className="text-sm text-muted-foreground">
                Post updates, photos, and thoughts to your profile.
              </p>
            </Card>

            <Card className="flex flex-col items-center gap-4 p-8 text-center shadow-md bg-background">
              <Check className="h-10 w-10 text-primary" />
              <h3 className="text-xl font-semibold">Engage</h3>
              <p className="text-sm text-muted-foreground">
                Like, comment, and interact with content that matters to you.
              </p>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
