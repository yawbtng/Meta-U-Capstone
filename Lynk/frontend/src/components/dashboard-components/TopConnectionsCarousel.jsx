import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Users } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

const TopConnectionsCarousel = ({ plugin }) => (
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
);

export default TopConnectionsCarousel; 