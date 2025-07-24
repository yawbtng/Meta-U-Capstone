import React, { useRef } from "react";
import { UserAuth } from "../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Users, TrendingUp, Star, BarChart3 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const Dashboard = () => {
    const { session } = UserAuth();
    const plugin = useRef(
        Autoplay({ delay: 3000, stopOnInteraction: true })
    );

    return (
        <div className="container mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <h2 className="text-xl text-muted-foreground">
                    Welcome back, {session?.user?.user_metadata?.display_name || 'User'}
                </h2>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Top Left - Stats */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Quick Stats
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Total Connections</span>
                                <span className="text-2xl font-bold">127</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">New This Month</span>
                                <span className="text-lg font-semibold text-green-600">+12</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Network Score</span>
                                <span className="text-lg font-semibold text-blue-600">8.5/10</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Top Right - Top Connections Carousel */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Top Connections
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Carousel
                                plugins={[plugin.current]}
                                className="w-full"
                                onMouseEnter={plugin.current.stop}
                                onMouseLeave={plugin.current.reset}
                                opts={{
                                    align: "start",
                                    loop: true,
                                }}
                            >
                                <CarouselContent className="-ml-2">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <CarouselItem key={i} className="pl-2 md:basis-1/2 lg:basis-1/3">
                                            <div className="p-1">
                                                <Card className="border-2">
                                                    <CardContent className="flex flex-col p-4">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                                                                <span className="text-sm font-semibold">U{i}</span>
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="font-medium text-sm">User {i}</p>
                                                                <p className="text-xs text-muted-foreground">Company {i}</p>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-xs text-muted-foreground">Last contact: 2 days ago</p>
                                                            <p className="text-xs text-muted-foreground">Connection strength: {8 + i}/10</p>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                {/* Pinned Contacts */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Star className="h-5 w-5" />
                                Pinned Contacts
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                                            <span className="text-xs font-semibold">P{i}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">Pinned User {i}</p>
                                            <p className="text-xs text-muted-foreground truncate">pinned@example.com</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Graphs/Visualization */}
                <div className="lg:col-span-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Network Analytics
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                                <p className="text-muted-foreground">Charts and visualizations coming soon...</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Quote of the Day - Bottom Center */}
            <div className="flex justify-center">
                <Card className="w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle className="text-center">Quote of the Day</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center">
                            <blockquote className="text-lg italic mb-4">
                                "Loading inspirational quote..."
                            </blockquote>
                            <cite className="text-sm text-muted-foreground">— Loading author</cite>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Dashboard;
