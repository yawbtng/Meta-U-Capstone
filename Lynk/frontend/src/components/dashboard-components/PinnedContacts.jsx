import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Star, PinOff } from "lucide-react";
import LoadingSpinner from "../ui/loading-spinner";
import { pinContact } from "../../../../backend/supabase/contacts.js";
import { UserAuth } from "../../context/AuthContext";

const PinnedContacts = ({ contacts = [], loading, onUnpin }) => {
    const { session } = UserAuth();
    const [unpinningId, setUnpinningId] = useState(null);
    const pinnedContacts = contacts.filter(c => c.pinned);

    const handleUnpin = async (contact) => {
        if (!session?.user?.id) return;
        setUnpinningId(contact.id);
        const result = await pinContact(session.user.id, contact.id, false);
        setUnpinningId(null);
        if (result.success && onUnpin) {
            onUnpin(contact.id);
        }
    };

    return (
        <div className="lg:col-span-1">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5" />
                        Pinned Contacts
                    </CardTitle>
                </CardHeader>
                <CardContent className="overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center items-center h-32">
                            <LoadingSpinner size={24} text="Loading pinned..." />
                        </div>
                    ) : pinnedContacts.length === 0 ? (
                        <div className="text-center text-muted-foreground py-6">No pinned contacts yet.</div>
                    ) : (
                        <div className="space-y-3">
                            {pinnedContacts.map((contact) => (
                                <div key={contact.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                                        <span className="text-xs font-semibold">{contact.name?.[0] || '?'}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{contact.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{contact.email}</p>
                                    </div>
                                    <button
                                        className="ml-2 p-1 text-yellow-600 hover:text-yellow-800"
                                        title="Unpin"
                                        disabled={unpinningId === contact.id}
                                        onClick={() => handleUnpin(contact)}
                                    >
                                        <PinOff className="h-5 w-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default PinnedContacts; 