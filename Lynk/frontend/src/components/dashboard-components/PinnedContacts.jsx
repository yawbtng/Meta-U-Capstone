import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Star, PinOff } from "lucide-react";
import LoadingSpinner from "../ui/loading-spinner";
import { pinContact } from "../../../../backend/supabase/contacts.js";
import { UserAuth } from "../../context/AuthContext";

const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const PinnedContacts = ({ contacts = [], loading, onUnpin, onContactClick }) => {
    const { session } = UserAuth();
    const [unpinningId, setUnpinningId] = useState(null);
    const isMounted = useRef(true);
    // Local state for instant UI feedback
    const [localPinned, setLocalPinned] = useState([]);

    useEffect(() => {
        isMounted.current = true;
        setLocalPinned(contacts.filter(c => c.pinned));
        return () => {
            isMounted.current = false;
        };
    }, [contacts]);

    const handleUnpin = async (contact) => {
        if (!session?.user?.id) return;
        setUnpinningId(() => contact.id);
        // Instantly remove from local pinned list for UI feedback
        setLocalPinned((prev) => prev.filter(c => c.id !== contact.id));
        const result = await pinContact(session.user.id, contact.id, false);
        if (isMounted.current) setUnpinningId(() => null);
        if (result.success && onUnpin && isMounted.current) {
            setTimeout(() => {
                if (isMounted.current) onUnpin(contact.id);
            }, 0);
        }
    };

    const handleContactClick = (contact, event) => {
        // Prevent click if clicking on the unpin button
        if (event.target.closest('button')) {
            return;
        }
        if (onContactClick) {
            onContactClick(contact);
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
                <CardContent className="overflow-y-auto max-h-96 scrollbar-hide">
                    {loading ? (
                        <div className="flex justify-center items-center h-32">
                            <LoadingSpinner size={24} text="Loading pinned..." />
                        </div>
                    ) : localPinned.length === 0 ? (
                        <div className="text-center text-muted-foreground py-6">No pinned contacts yet.</div>
                    ) : (
                        <div className="space-y-1">
                            {localPinned.map((contact) => (
                                <div
                                    key={contact.id}
                                    className="flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer hover:bg-blue-50"
                                    onClick={(e) => handleContactClick(contact, e)}
                                >
                                    {contact.avatar_url ? (
                                        <img
                                            src={contact.avatar_url}
                                            alt={contact.name}
                                            className="w-12 h-12 rounded-full object-cover border border-gray-200"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-lg font-bold text-primary">
                                            {getInitials(contact.name)}
                                        </div>
                                    )}
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