import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BarChart3 } from "lucide-react";

const NetworkAnalytics = () => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Visualize Your Network
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="h-125 flex items-center justify-center bg-muted/20 rounded-lg">
                <p className="text-muted-foreground">Charts and visualizations coming soon...</p>
            </div>
        </CardContent>
    </Card>
);

export default NetworkAnalytics; 