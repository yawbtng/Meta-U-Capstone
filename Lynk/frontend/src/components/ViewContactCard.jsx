import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import AvatarDemo from "./avatar-01"
import { Mail, Phone, Building2, School, MapPin, Tag, Briefcase, Globe, Heart, User, CalendarDays, Users, Star, MessageCircle, BookOpen, Info, Linkedin, Twitter, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ViewContactCard({ open, onOpenChange, contact }) {
  if (!contact) return null

  const colorMap = {
    personal: "bg-purple-100 text-purple-800",
    professional: "bg-green-100 text-green-800",
    social: "bg-blue-100 text-blue-800",
  }
  const socials = contact.socials || {}

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-screen-xl !w-[80vw] !max-h-[60vh] scrollbar-hide p-0 rounded-2xl shadow-2xl bg-white border-0 overflow-y-auto">
        <DialogDescription className="sr-only">
          View detailed information about {contact.name}
        </DialogDescription>
        <div className="p-6 flex flex-col gap-6">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start pb-3 border-b border-gray-100">
            <AvatarDemo
              initials={contact.name ? contact.name.split(" ").map((n) => n[0]).join("") : "?"}
              url={contact.avatar_url}
              className="w-30 h-30 border-4 border-gray-200 shadow-lg"
            />
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              <DialogTitle className="text-4xl font-bold flex items-center gap-2">
                <User className="w-10 h-10 text-gray-400" />
                {contact.name}
              </DialogTitle>
              {/* How can I help them button */}
              <div className="mt-4 flex justify-left">
                <Button
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-6 py-2 rounded-xl text-base font-semibold shadow-md hover:from-blue-600 hover:to-pink-600 transition-all"
                  type="button"
                >
                  How can I help {contact.name}?
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6 flex flex-col gap-4 shadow-sm">
              <h3 className="text-xl font-semibold flex items-center gap-2 mb-1"><Info className="w-6 h-6 text-blue-500" />Contact Information</h3>
              {contact.email && <div className="flex items-center gap-2 text-gray-800 text-lg"><Mail className="w-6 h-6 text-gray-400" />{contact.email}</div>}
              {contact.phone_number && <div className="flex items-center gap-2 text-gray-800 text-lg"><Phone className="w-6 h-6 text-gray-400" />{contact.phone_number}</div>}
            </div>

            {/* Professional Information */}
            <div className="bg-gray-50 rounded-xl p-6 flex flex-col gap-4 shadow-sm">
              <h3 className="text-xl font-semibold flex items-center gap-2 mb-1"><Briefcase className="w-6 h-6 text-green-600" />Professional Information</h3>
              {contact.company && <div className="flex items-center gap-2 text-gray-800 text-lg"><Building2 className="w-6 h-6 text-gray-400" />{contact.company}</div>}
              {contact.role && <div className="flex items-center gap-2 text-gray-800 text-lg"><Briefcase className="w-6 h-6 text-gray-400" />{contact.role}</div>}
              {contact.industry && <div className="flex items-center gap-2 text-gray-800 text-lg"><Globe className="w-6 h-6 text-gray-400" />{contact.industry}</div>}
            </div>
          </div>

          {/* Background & Context */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6 flex flex-col gap-4 shadow-sm">
              <h3 className="text-xl font-semibold flex items-center gap-2 mb-1"><School className="w-6 h-6 text-indigo-600" />Background & Context</h3>
              {contact.school && <div className="flex items-center gap-2 text-gray-800 text-lg"><School className="w-6 h-6 text-gray-400" />{contact.school}</div>}
              {contact.where_met && <div className="flex items-center gap-2 text-gray-800 text-lg"><BookOpen className="w-6 h-6 text-gray-400" />Where met: {contact.where_met}</div>}
              {contact.location && <div className="flex items-center gap-2 text-gray-800 text-lg"><MapPin className="w-6 h-6 text-gray-400" />{contact.location}</div>}
            </div>
            <div className="bg-gray-50 rounded-xl p-6 flex flex-col gap-4 shadow-sm">
              <h3 className="text-xl font-semibold flex items-center gap-2 mb-1"><CalendarDays className="w-6 h-6 text-blue-600" />Last Contact & Notes</h3>
              {contact.last_contact_at && <div className="flex items-center gap-2 text-gray-800 text-lg"><CalendarDays className="w-6 h-6 text-gray-400" />Last Contact: {new Date(contact.last_contact_at).toLocaleDateString()}</div>}
              {contact.notes && <div className="flex items-center gap-2 text-gray-800 text-lg"><MessageCircle className="w-6 h-6 text-gray-400" />Notes: {contact.notes}</div>}
            </div>
          </div>

          {/* Relationship & Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6 flex flex-col gap-4 shadow-sm">
              <h3 className="text-xl font-semibold flex items-center gap-2 mb-1"><Star className="w-6 h-6 text-yellow-500" />Relationship & Categories</h3>
              {typeof contact.interactions_count === 'number' && <div className="flex items-center gap-2 text-gray-800 text-lg"><Users className="w-6 h-6 text-gray-400" />Interactions: {contact.interactions_count}</div>}
              {typeof contact.connection_score === 'number' && <div className="flex items-center gap-2 text-gray-800 text-lg"><Star className="w-6 h-6 text-yellow-400" />Score: {contact.connection_score}</div>}
              {contact.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {contact.tags.map((tag, i) => (
                    <Badge key={i} className="bg-gray-200 text-gray-800 text-base px-4 py-2 font-semibold rounded-full">{tag}</Badge>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {contact.relationship_type?.map((type, i) => (
                  <Badge key={i} className={colorMap[type.toLowerCase()] + " text-base px-4 py-2 font-semibold"}>{type}</Badge>
                ))}
              </div>
            </div>
            {/* Interests Section */}
            {contact.interests?.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-6 flex flex-col gap-4 shadow-sm">
                <h3 className="text-xl font-semibold flex items-center gap-2 mb-1"><Heart className="w-6 h-6 text-pink-500" />Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {contact.interests.map((interest, i) => (
                    <Badge key={i} className="bg-pink-100 text-pink-800 px-4 py-2 text-base font-semibold">{interest}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Social Media Section */}
          {(socials.linkedin || socials.twitter || socials.instagram) && (
            <div className="rounded-2xl p-6 bg-gradient-to-r from-blue-50 to-purple-50 shadow-sm">
              <h3 className="text-xl font-semibold flex items-center gap-2 mb-4 text-gray-900">
                <Globe className="w-6 h-6 text-blue-500" /> Social Media
              </h3>
              <div className="flex gap-4">
                {socials.linkedin && (
                  <a
                    href={`https://${socials.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-xl flex items-center justify-center bg-[#0077b5] hover:bg-[#005983] transition-all shadow-lg"
                  >
                    <Linkedin className="w-7 h-7 text-white" />
                  </a>
                )}
                {socials.twitter && (
                  <a
                    href={`https://twitter.com/${socials.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-xl flex items-center justify-center bg-[#1da1f2] hover:bg-[#0d8ddb] transition-all shadow-lg"
                  >
                    <Twitter className="w-7 h-7 text-white" />
                  </a>
                )}
                {socials.instagram && (
                  <a
                    href={`https://instagram.com/${socials.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-tr from-pink-500 via-purple-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 transition-all shadow-lg"
                  >
                    <Instagram className="w-7 h-7 text-white" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Meta Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-500 text-base mt-4">
            {contact.created_at && <div className="flex items-center gap-2"><CalendarDays className="w-5 h-5" />Created: {new Date(contact.created_at).toLocaleDateString()}</div>}
            {contact.updated_at && <div className="flex items-center gap-2"><CalendarDays className="w-5 h-5" />Updated: {new Date(contact.updated_at).toLocaleDateString()}</div>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
  