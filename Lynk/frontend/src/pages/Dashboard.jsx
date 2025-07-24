import React from "react";
import { UserAuth } from "../context/AuthContext"

const Dashboard = () => {
    const { session } = UserAuth();

    return (
        <div className="container mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <h2 className="text-xl text-muted-foreground">
                    Welcome back, {session?.user?.user_metadata?.display_name || 'User'}
                </h2>
            </div>

            {/* Placeholder for future dashboard content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 border rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Quick Stats</h3>
                    <p className="text-muted-foreground">Dashboard content coming soon...</p>
                </div>
                <div className="p-6 border rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
                    <p className="text-muted-foreground">Activity feed coming soon...</p>
                </div>
                <div className="p-6 border rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Top Connections</h3>
                    <p className="text-muted-foreground">Connection carousel coming soon...</p>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;
