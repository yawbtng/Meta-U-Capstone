import React, { useRef } from "react";
import { UserAuth } from "../context/AuthContext";
import Autoplay from "embla-carousel-autoplay";
import PinnedContacts from "../components/dashboard-components/PinnedContacts";
import QuickStats from "../components/dashboard-components/QuickStats";
import TopConnectionsCarousel from "../components/dashboard-components/TopConnectionsCarousel";
import NetworkAnalytics from "../components/dashboard-components/NetworkAnalytics";

const Dashboard = () => {
    const { session } = UserAuth();
    const plugin = useRef(
        Autoplay({ delay: 3000, stopOnInteraction: false })
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
                <PinnedContacts />
                {/* Top Center - Quick Stats */}
                <QuickStats />
                {/* Top Right - Top Connections Carousel */}
                <TopConnectionsCarousel plugin={plugin} />
            </div>

            {/* Network Analytics - Full Width */}
            <div className="mb-8">
                <NetworkAnalytics />
            </div>
        </div>
    )
}

export default Dashboard;
