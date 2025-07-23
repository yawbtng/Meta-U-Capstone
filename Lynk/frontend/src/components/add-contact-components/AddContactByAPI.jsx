import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserPlus } from 'lucide-react';
import { searchContactsViaClado } from '@/backend/services/clado-client.js';

const DEFAULT_QUERY = 'Software Engineers in San Francisco';

export default function AddContactByAPI() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searching, setSearching] = useState(false);

  // Fetch initial recommendations on mount
  useEffect(() => {
    async function fetchInitial() {
      setLoading(true);
      setError(null);
      try {
        const data = await searchContactsViaClado(DEFAULT_QUERY, 10);
        setResults(data.results || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch recommendations.');
      } finally {
        setLoading(false);
      }
    }
    fetchInitial();
  }, []);

  // Handle search
  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setError(null);
    try {
      const data = await searchContactsViaClado(query, 10);
      setResults(data.results || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch search results.');
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-2 items-center">
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search for people (e.g. Product Managers in Dallas Texas)"
          className="max-w-md"
        />
        <Button type="submit" disabled={searching || loading}>
          {searching ? 'Searching...' : 'Search'}
        </Button>
      </form>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading recommendations...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">{error}</div>
      ) : results.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No results found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {results.map((item, idx) => (
            <Card key={item.profile?.id || idx} className="hover:shadow-lg transition-all duration-200 relative h-[360px] cursor-pointer my-2">
              <CardHeader className="pb-0 pt-8 ">
                <div className="flex flex-col items-center text-center space-y-2">
                  {/* Avatar */}
                  {item.profile?.profile_picture_url ? (
                    <img
                      src={item.profile.profile_picture_url}
                      alt={item.profile.name}
                      className="w-24 h-24 rounded-full object-cover mx-auto"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold mx-auto">
                      {item.profile?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                  )}
                  {/* Name */}
                  <h3 className="font-semibold text-xl">{item.profile?.name}</h3>
                  {/* Title/Company */}
                  <p className="text-base text-muted-foreground text-center">
                    {item.profile?.headline || item.profile?.title || 'No headline'}
                  </p>
                  {/* Location */}
                  {item.profile?.location && (
                    <Badge className="text-xs px-2 bg-blue-100 text-blue-800">{item.profile.location}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="bottom-1 left-0 right-0 px-6 absolute">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base" disabled>
                  <UserPlus className="w-5 h-5 mr-2 " />
                  Add (Coming Soon)
                </Button>
                {item.profile?.linkedin_url && (
                  <a
                    href={item.profile.linkedin_url}
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
          ))}
        </div>
      )}
    </div>
  );
}
