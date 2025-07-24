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
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                {/* Top Left - Pinned Contacts */}
                <div className="lg:col-span-1">
                    <Card className="h-full">
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

                {/* Top Center - Quick Stats */}
                <div className="lg:col-span-2">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Quick Stats
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8 flex-1 flex flex-col justify-center">
                            <div className="flex justify-between items-center">
                                <span className="text-lg text-muted-foreground">Total Connections</span>
                                <span className="text-4xl font-bold">127</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-lg text-muted-foreground">New This Month</span>
                                <span className="text-2xl font-semibold text-green-600">+12</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-lg text-muted-foreground">Network Score</span>
                                <span className="text-2xl font-semibold text-blue-600">8.5/10</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Top Right - Top Connections Carousel */}
                <div className="lg:col-span-1">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Top Connections
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <Carousel
                                plugins={[plugin.current]}
                                className="w-full h-full"
                                onMouseEnter={plugin.current.stop}
                                onMouseLeave={plugin.current.reset}
                                opts={{
                                    align: "center",
                                    loop: true,
                                }}
                            >
                                <CarouselContent className="h-full">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <CarouselItem key={i} className="basis-full h-full">
                                            <div className="p-4 h-full flex items-center">
                                                <div className="bg-background border-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 w-full">
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                                                            <span className="text-lg font-semibold">U{i}</span>
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-lg">User {i}</p>
                                                            <p className="text-sm text-muted-foreground">Company {i}</p>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <p className="text-sm text-muted-foreground">Last contact: 2 days ago</p>
                                                        <p className="text-sm text-muted-foreground">Connection strength: {8 + i}/10</p>
                                                    </div>
                                                </div>
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

            {/* Network Analytics - Full Width */}
            <div className="mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Visualize Your Network
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80 flex items-center justify-center bg-muted/20 rounded-lg">
                            <p className="text-muted-foreground">Charts and visualizations coming soon...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

        </div>
    )
}

export default Dashboard;
