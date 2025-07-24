import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Star } from "lucide-react";

const PinnedContacts = () => (
    <div className="lg:col-span-1">
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Pinned Contacts
                </CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto">
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
);

export default PinnedContacts; 