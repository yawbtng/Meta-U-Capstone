import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TrendingUp } from "lucide-react";

const QuickStats = () => (
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
);

export default QuickStats; 