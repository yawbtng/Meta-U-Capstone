import React, { useRef, useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import Autoplay from "embla-carousel-autoplay";
import PinnedContacts from "../components/dashboard-components/PinnedContacts";
import QuickStats from "../components/dashboard-components/QuickStats";
import TopConnectionsCarousel from "../components/dashboard-components/TopConnectionsCarousel";
import NetworkAnalytics from "../components/dashboard-components/NetworkAnalytics";
import ViewContactCard from "../components/ViewContactCard";
import { fetchContacts } from "../../../backend/supabase/contacts.js";

const Dashboard = () => {
    const { session } = UserAuth();
    const plugin = useRef(
        Autoplay({ delay: 3000, stopOnInteraction: false })
    );
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedContact, setSelectedContact] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    useEffect(() => {
        if (!session?.user?.id) return;
        setLoading(true);
        fetchContacts(session.user.id).then(result => {
            setContacts(result.success ? result.data : []);
            setLoading(false);
        });
    }, [session?.user?.id]);

    const handleContactClick = (contact) => {
        setSelectedContact(contact);
        setIsViewModalOpen(true);
    };

    const handleViewModalClose = () => {
        setIsViewModalOpen(false);
        setSelectedContact(null);
    };

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
                <PinnedContacts 
                    contacts={contacts} 
                    loading={loading} 
                    onContactClick={handleContactClick}
                />
                {/* Top Center - Quick Stats */}
                <QuickStats contacts={contacts} loading={loading} />
                {/* Top Right - Top Connections Carousel */}
                <TopConnectionsCarousel 
                    contacts={contacts} 
                    loading={loading} 
                    plugin={plugin}
                    onContactClick={handleContactClick}
                />
            </div>

            {/* Network Analytics - Full Width */}
            <div className="mb-8">
                <NetworkAnalytics />
            </div>

            {/* View Contact Modal */}
            <ViewContactCard
                open={isViewModalOpen}
                onOpenChange={handleViewModalClose}
                contact={selectedContact}
            />
        </div>
    )
}

export default Dashboard;
