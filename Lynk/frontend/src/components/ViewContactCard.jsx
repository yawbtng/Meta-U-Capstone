import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import AvatarDemo from "./avatar-01";
import { Linkedin, Twitter, Instagram, Mail, Phone, Building2, User, School, MapPin, Star, Tag, Briefcase, Globe, Heart } from "lucide-react";

export default function ViewContactCard({ open, onOpenChange, contact }) {
  if (!contact) return null;

  const socials = contact.socials || {};
  const colorMap = {
    personal: "bg-purple-100 text-purple-800",
    professional: "bg-green-100 text-green-800",
    social: "bg-blue-100 text-blue-800",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-8 rounded-2xl shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-6 mb-4">
            <AvatarDemo initials={contact.name ? contact.name[0] : "?"} url={contact.avatar_url} className="w-24 h-24 shadow-lg border-2 border-gray-200" />
            <div>
              <DialogTitle className="text-3xl font-bold flex items-center gap-2">
                <User className="w-6 h-6 text-gray-500" />
                {contact.name}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1 text-lg">
                {contact.role && <><Briefcase className="w-5 h-5 text-gray-400" />{contact.role}</>}
                {contact.company && <><Building2 className="w-5 h-5 text-gray-400 ml-2" />{contact.company}</>}
              </DialogDescription>
              <div className="flex gap-2 mt-3">
                {contact.relationship_type?.map((type, i) => (
                  <Badge key={i} className={colorMap[type.toLowerCase()] + " text-base px-3 py-1"}>
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-2 text-lg">
          {contact.email && (
            <div className="flex items-center gap-2"><Mail className="w-5 h-5 text-gray-500" />{contact.email}</div>
          )}
          {contact.phone_number && (
            <div className="flex items-center gap-2"><Phone className="w-5 h-5 text-gray-500" />{contact.phone_number}</div>
          )}
          {contact.industry && (
            <div className="flex items-center gap-2"><Globe className="w-5 h-5 text-gray-500" />{contact.industry}</div>
          )}
          {contact.school && (
            <div className="flex items-center gap-2"><School className="w-5 h-5 text-gray-500" />{contact.school}</div>
          )}
          {contact.location && (
            <div className="flex items-center gap-2"><MapPin className="w-5 h-5 text-gray-500" />{contact.location}</div>
          )}
          {contact.interests?.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap"><Heart className="w-5 h-5 text-pink-400" />{contact.interests.join(", ")}</div>
          )}
          {contact.tags?.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap"><Tag className="w-5 h-5 text-gray-400" />{contact.tags.join(", ")}</div>
          )}
        </div>
        <div className="flex gap-6 mt-6 items-center">
          {socials.linkedin && (
            <a href={`https://${socials.linkedin}`} target="_blank" rel="noopener noreferrer" title="LinkedIn">
              <Linkedin className="w-7 h-7 text-blue-700 hover:scale-110 transition-transform" />
            </a>
          )}
          {socials.twitter && (
            <a href={`https://twitter.com/${socials.twitter}`} target="_blank" rel="noopener noreferrer" title="Twitter">
              <Twitter className="w-7 h-7 text-sky-500 hover:scale-110 transition-transform" />
            </a>
          )}
          {socials.instagram && (
            <a href={`https://instagram.com/${socials.instagram}`} target="_blank" rel="noopener noreferrer" title="Instagram">
              <Instagram className="w-7 h-7 text-pink-500 hover:scale-110 transition-transform" />
            </a>
          )}
        </div>
        <DialogFooter>
          {/* Footer actions go here */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 