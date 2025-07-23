import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserPlus } from 'lucide-react';
import { searchContactsViaClado, getCachedCladoResults, setCachedCladoResults, getCladoQueryCount, incrementCladoQueryCount, CLADO_DAILY_LIMIT } from '../../../../backend/services/clado-client.js';
import { UserAuth } from '@/context/AuthContext';

export default function AddContactByAPI() {
  const { profile, session } = UserAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searching, setSearching] = useState(false);
  const [initialTried, setInitialTried] = useState(false);
  const [queriesLeft, setQueriesLeft] = useState(CLADO_DAILY_LIMIT);

  // Generate initial query from user profile
  const initialQuery = profile?.role && profile?.location
    ? `${profile.role} in ${profile.location}`
    : '';

  // Fetch initial query count on mount or user change
  useEffect(() => {
    async function fetchLimit() {
      if (session?.user?.id) {
        try {
          const count = await getCladoQueryCount(session.user.id);
          setQueriesLeft(Math.max(0, CLADO_DAILY_LIMIT - (count || 0)));
        } catch {
          setQueriesLeft(CLADO_DAILY_LIMIT);
        }
      }
    }
    fetchLimit();
  }, [session?.user?.id]);

  useEffect(() => {
    if (!initialTried && initialQuery && session?.user?.id) {
      async function fetchInitial() {
        setLoading(true);
        setError(null);
        try {
          const cached = getCachedCladoResults(initialQuery);
          if (cached) {
            setResults(cached.results || []);
            // Only check count, do not increment
            const count = await getCladoQueryCount(session.user.id);
            setQueriesLeft(Math.max(0, CLADO_DAILY_LIMIT - (count || 0)));
          } else {
            // Only increment if making a real API call
            const count = await incrementCladoQueryCount(session.user.id);
            setQueriesLeft(Math.max(0, CLADO_DAILY_LIMIT - (count || 0)));
            if (count > CLADO_DAILY_LIMIT) {
              setError('You have reached your daily Clado search limit.');
              setLoading(false);
              setInitialTried(true);
              return;
            }
            const data = await searchContactsViaClado(initialQuery, 4);
            setResults(data.results || []);
            setCachedCladoResults(initialQuery, data);
          }
        } catch (err) {
          setError(err.message || 'Failed to fetch recommendations.');
        } finally {
          setLoading(false);
          setInitialTried(true);
        }
      }
      fetchInitial();
    }
  }, [initialQuery, initialTried, session?.user?.id]);

  // Handle search
  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    if (!session?.user?.id) {
      setError('You must be signed in to search.');
      return;
    }
    setSearching(true);
    setError(null);
    try {
      const cached = getCachedCladoResults(query);
      if (cached) {
        setResults(cached.results || []);
        // Only check count, do not increment
        const count = await getCladoQueryCount(session.user.id);
        setQueriesLeft(Math.max(0, CLADO_DAILY_LIMIT - (count || 0)));
      } else {
        // Only increment if making a real API call
        const count = await incrementCladoQueryCount(session.user.id);
        setQueriesLeft(Math.max(0, CLADO_DAILY_LIMIT - (count || 0)));
        if (count > CLADO_DAILY_LIMIT) {
          setError('You have reached your daily Clado search limit.');
          setSearching(false);
          return;
        }
        const data = await searchContactsViaClado(query, 4);
        setResults(data.results || []);
        setCachedCladoResults(query, data);
      }
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
          <Button type="submit" disabled={searching || loading || queriesLeft <= 0}>
            {searching ? 'Searching...' : 'Search'}
          </Button>
        </form>
      </div>
      {/* Personalized context message and rate limit */}
      <div className="flex flex-col items-center w-full">
        <div className="flex flex-col items-center w-full max-w-xl">
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 mt-2 shadow-sm">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
            <span className="text-blue-800 font-medium">
              {profile?.role && profile?.location && 'Recommending people who work in similar roles and locations.'}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
              <svg className="inline w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l2 2" /></svg>
              {`Clado API queries left today: ${queriesLeft} / ${CLADO_DAILY_LIMIT}`}
            </span>
          </div>
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
