import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
  } from "@/components/ui/dialog";
  import { Badge } from "@/components/ui/badge";
  import AvatarDemo from "./avatar-01";
  import {
    Linkedin,
    Twitter,
    Instagram,
    Mail,
    Phone,
    Building2,
    User,
    School,
    MapPin,
    Tag,
    Briefcase,
    Globe,
    Heart,
  } from "lucide-react";
  
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
        <DialogContent className="max-w-7xl w-[90vw] p-10 md:p-12 rounded-3xl shadow-2xl bg-white border border-gray-100">
          <DialogHeader>
            <div className="flex flex-col md:flex-row gap-10">
              <AvatarDemo
                initials={contact.name ? contact.name[0] : "?"}
                url={contact.avatar_url}
                className="w-32 h-32 border-4 border-gray-200 shadow-lg"
              />
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-4xl font-extrabold flex items-center gap-3 break-words">
                  <User className="w-7 h-7 text-gray-500" />
                  {contact.name}
                </DialogTitle>
                <DialogDescription className="text-xl text-gray-700 mt-2 space-y-2">
                  {contact.role && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-gray-400" />
                      {contact.role}
                    </div>
                  )}
                  {contact.company && (
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-gray-400" />
                      {contact.company}
                    </div>
                  )}
                </DialogDescription>
                <div className="flex flex-wrap gap-3 mt-4">
                  {contact.relationship_type?.map((type, i) => (
                    <Badge
                      key={i}
                      className={
                        `${colorMap[type.toLowerCase()] || ""} text-sm px-4 py-1.5 font-semibold shadow-sm`
                      }
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </DialogHeader>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6 mt-10 text-lg">
            {contact.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <span className="break-all">{contact.email}</span>
              </div>
            )}
            {contact.phone_number && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-500" />
                {contact.phone_number}
              </div>
            )}
            {contact.industry && (
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-500" />
                {contact.industry}
              </div>
            )}
            {contact.school && (
              <div className="flex items-center gap-3">
                <School className="w-5 h-5 text-gray-500" />
                {contact.school}
              </div>
            )}
            {contact.location && (
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                {contact.location}
              </div>
            )}
            {contact.interests?.length > 0 && (
              <div className="flex items-center gap-3 flex-wrap">
                <Heart className="w-5 h-5 text-pink-500" />
                {contact.interests.join(", ")}
              </div>
            )}
            {contact.tags?.length > 0 && (
              <div className="flex items-center gap-3 flex-wrap">
                <Tag className="w-5 h-5 text-gray-400" />
                {contact.tags.join(", ")}
              </div>
            )}
          </div>
  
          <div className="flex gap-6 mt-10 justify-center md:justify-start">
            {socials.linkedin && (
              <a
                href={`https://${socials.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
              >
                <Linkedin className="w-8 h-8 text-blue-700 hover:scale-110 transition-transform" />
              </a>
            )}
            {socials.twitter && (
              <a
                href={`https://twitter.com/${socials.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Twitter"
              >
                <Twitter className="w-8 h-8 text-sky-500 hover:scale-110 transition-transform" />
              </a>
            )}
            {socials.instagram && (
              <a
                href={`https://instagram.com/${socials.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
              >
                <Instagram className="w-8 h-8 text-pink-500 hover:scale-110 transition-transform" />
              </a>
            )}
          </div>
  
          <DialogFooter className="mt-10 flex justify-end">
            {/* Optional buttons can go here */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  