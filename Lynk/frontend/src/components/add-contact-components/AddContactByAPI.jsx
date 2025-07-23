import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserPlus } from 'lucide-react';
import { searchContactsViaClado } from '../../../../backend/services/clado-client.js';
import { UserAuth } from '@/context/AuthContext';

export default function AddContactByAPI() {
  const { profile } = UserAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searching, setSearching] = useState(false);
  const [initialTried, setInitialTried] = useState(false);

  // Generate initial query from user profile
  const initialQuery = profile?.role && profile?.location
    ? `${profile.role} in ${profile.location}`
    : '';

  // Fetch initial recommendations on mount (if profile info is available)
  useEffect(() => {
    if (!initialTried && initialQuery) {
      async function fetchInitial() {
        setLoading(true);
        setError(null);
        try {
          const data = await searchContactsViaClado(initialQuery, 4);
          setResults(data.results || []);
        } catch (err) {
          setError(err.message || 'Failed to fetch recommendations.');
        } finally {
          setLoading(false);
          setInitialTried(true);
        }
      }
      fetchInitial();
    }
  }, [initialQuery, initialTried]);

  // Handle search
  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setError(null);
    try {
      const data = await searchContactsViaClado(query, 4);
      setResults(data.results || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch search results.');
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center w-full">
        <form onSubmit={handleSearch} className="flex gap-2 items-center">
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search for people (e.g. Product Managers in Dallas Texas)"
            className="max-w-2xl w-[420px]"
          />
          <Button type="submit" disabled={searching || loading}>
            {searching ? 'Searching...' : 'Search'}
          </Button>
        </form>
      </div>
      {/* Personalized context message */}
      <div className="flex justify-center w-full">
        <div className="text-muted-foreground text-center text-sm max-w-xl mt-2">
          {profile?.role && profile?.location &&
            'Recommending people who work in similar roles and locations.'}
        </div>
      </div>

      {!profile?.role || !profile?.location ? (
        <div className="text-center py-12 text-muted-foreground">
          Please update your profile with your role and location to see personalized recommendations.
        </div>
      ) : loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading recommendations...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">{error}</div>
      ) : results.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No results found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {results.map((item, idx) => {
            const profile = item.profile || {};
            const experience = Array.isArray(item.experience) && item.experience.length > 0 ? item.experience[0] : null;
            const education = Array.isArray(item.education) && item.education.length > 0 ? item.education[0] : null;
            
            return (
              <Card key={profile.id || idx} className="hover:shadow-lg transition-all duration-200 relative h-auto min-h-[420px] flex flex-col justify-between my-2">
                <CardHeader className="pb-0 pt-8 ">
                  <div className="flex flex-col items-center text-center space-y-2">
                    {/* Avatar */}
                    {profile.profile_picture_permalink ? (
                      <img
                        src={profile.profile_picture_permalink}
                        alt={profile.name + ' LinkedIn profile picture'}
                        className="w-24 h-24 rounded-full object-cover mx-auto border border-gray-200 shadow-sm"
                        onError={e => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || '')}&background=random`; }}
                      />
                    ) : (
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || '')}&background=random`}
                        alt={profile.name + ' initials avatar'}
                        className="w-24 h-24 rounded-full object-cover mx-auto border border-gray-200 shadow-sm"
                      />
                    )}
                    {/* Name */}
                    <h3 className="font-semibold text-xl mt-2">{profile.name}</h3>
                    {/* Headline/Title */}
                    <p className="text-base text-muted-foreground text-center">
                      {profile.headline || profile.title || 'No headline'}
                    </p>
                    {/* Location */}
                    {profile.location && (
                      <Badge className="text-xs px-2 bg-blue-100 text-blue-800 mt-1">{profile.location}</Badge>
                    )}
                    {/* Description */}
                    {profile.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{profile.description}</p>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-4 flex flex-col gap-2">
                  {/* Experience */}
                  {experience && (
                    <div className="flex items-center gap-2 justify-center mt-2">
                      {experience.company_logo && (
                        <img src={experience.company_logo} alt={experience.company_name + ' logo'} className="w-6 h-6 rounded object-contain" />
                      )}
                      <span className="text-sm font-medium text-gray-700">
                        {experience.title}{experience.company_name ? ` @ ${experience.company_name}` : ''}
                      </span>
                    </div>
                  )}
                  {/* Education */}
                  {education && (
                    <div className="flex items-center gap-2 justify-center mt-1">
                      {education.school_logo && (
                        <img src={education.school_logo} alt={education.school_name + ' logo'} className="w-6 h-6 rounded object-contain" />
                      )}
                      <span className="text-xs text-gray-600">
                        {education.degree}{education.school_name ? `, ${education.school_name}` : ''}
                      </span>
                    </div>
                  )}
                  {/* Add button and LinkedIn */}
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base mt-4" disabled>
                    <UserPlus className="w-5 h-5 mr-2 " />
                    Add (Coming Soon)
                  </Button>
                  {profile.linkedin_url && (
                    <a
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-2 text-blue-500 underline text-sm text-center"
                    >
                      View LinkedIn
                    </a>
                  )}
                  <div className="mt-2 text-xs text-muted-foreground text-center">Source: Clado</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
