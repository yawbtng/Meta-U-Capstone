import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { processAllUserEmbeddings, processAllConnectionEmbeddings } from '../../../backend/services/batch-embedding-pipeline.js';
import { searchSimilarVectors, getRecommendationsAPI } from '../../../backend/services/supabase-vector.js';
import { generateUserEmbedding } from '../../../backend/services/embedding-service.js';
import { fetchAllUsers } from '../../../backend/services/data-fetch.js';

export default function TestPipeline() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState(null);
    const [searchResults, setSearchResults] = useState(null);
    const [error, setError] = useState(null);

    const runPipeline = async () => {
        setIsProcessing(true);
        setError(null);
        setResults(null);

        try {
            console.log('Starting Supabase embedding pipeline...');
            
            console.log('Processing user embeddings...');
            await processAllUserEmbeddings();
            
            console.log('Processing connection embeddings...');
            await processAllConnectionEmbeddings();
            
            setResults({
                success: true,
                message: 'Supabase LangChain pipeline completed successfully! Check console for details.',
                timestamp: new Date().toISOString()
            });
            
        } catch (err) {
            console.error('Pipeline failed:', err);
            setError(err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const testVectorSearch = async () => {
        setIsSearching(true);
        setError(null);
        setSearchResults(null);

        try {
            console.log('Testing vector similarity search...');
            
            const users = await fetchAllUsers();
            if (!users.length) {
                throw new Error('No users found. Run the pipeline first.');
            }

            const testUser = users[0];
            console.log('Testing with user:', testUser.name);

            const embeddingResult = await generateUserEmbedding(testUser);
            if (!embeddingResult.success) {
                throw new Error(`Failed to generate test embedding: ${embeddingResult.error}`);
            }

            console.log('Generated test query vector, searching for similar people...');
            const peopleResults = await getRecommendationsAPI({
                userVector: embeddingResult.embedding,
                userId: testUser.id,
                type: 'people',
                limit: 5
            });

            console.log('Searching for similar connections...');
            const connectionResults = await getRecommendationsAPI({
                userVector: embeddingResult.embedding,
                userId: testUser.id,
                type: 'connections',
                limit: 5
            });

            setSearchResults({
                success: true,
                testUser: testUser,
                profileText: embeddingResult.profileText,
                people: peopleResults,
                connections: connectionResults,
                timestamp: new Date().toISOString()
            });

            console.log('Search test completed successfully!');
            
        } catch (err) {
            console.error('Search test failed:', err);
            setError(err.message);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Test Supabase Embedding Pipeline</h1>
                <p className="text-muted-foreground">
                    This page tests the embedding pipeline and vector similarity search using 
                    LangChain's SupabaseVectorStore with Together AI.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle>1. Data Processing</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button 
                            onClick={runPipeline}
                            disabled={isProcessing || isSearching}
                            className="w-full"
                        >
                            {isProcessing ? 'Processing...' : 'Run Embedding Pipeline'}
                        </Button>
                        
                        {isProcessing && (
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                <p className="text-blue-800 text-sm">
                                    Processing embeddings... Check console for progress.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>2. Vector Search</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button 
                            onClick={testVectorSearch}
                            disabled={isProcessing || isSearching}
                            className="w-full"
                            variant="outline"
                        >
                            {isSearching ? 'Searching...' : 'Test Vector Search'}
                        </Button>
                        
                        {isSearching && (
                            <div className="mt-4 p-4 bg-green-50 rounded-lg">
                                <p className="text-green-800 text-sm">
                                    Testing similarity search... Check console for details.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {results && (
                <Card className="mb-6 border-green-200 bg-green-50">
                    <CardHeader>
                        <CardTitle className="text-green-800">Pipeline Success</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-green-700">{results.message}</p>
                        <p className="text-sm text-green-600 mt-2">
                            Completed at: {new Date(results.timestamp).toLocaleString()}
                        </p>
                    </CardContent>
                </Card>
            )}

            {searchResults && (
                <Card className="mb-6 border-blue-200 bg-blue-50">
                    <CardHeader>
                        <CardTitle className="text-blue-800">Search Test Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <p className="font-medium">Test Query User: {searchResults.testUser.name}</p>
                                <p className="text-sm text-blue-600">Profile: {searchResults.profileText}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-medium text-blue-800">Similar People ({searchResults.people.data?.length || 0})</h4>
                                    {searchResults.people.success ? (
                                        <ul className="text-sm space-y-1">
                                            {searchResults.people.data.slice(0, 3).map((person, idx) => (
                                                <li key={idx} className="text-blue-700">
                                                    {person.payload.name} - {person.similarity}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-red-600">No results</p>
                                    )}
                                </div>
                                
                                <div>
                                    <h4 className="font-medium text-blue-800">Similar Connections ({searchResults.connections.data?.length || 0})</h4>
                                    {searchResults.connections.success ? (
                                        <ul className="text-sm space-y-1">
                                            {searchResults.connections.data.slice(0, 3).map((conn, idx) => (
                                                <li key={idx} className="text-blue-700">
                                                    {conn.payload.name} - {conn.similarity}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-red-600">No results</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {error && (
                <Card className="mb-6 border-red-200 bg-red-50">
                    <CardHeader>
                        <CardTitle className="text-red-800">Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-red-700">{error}</p>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>How It Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p><strong>1. Data Processing:</strong> Fetches users & connections → Generates embeddings → Stores in Supabase</p>
                    <p><strong>2. Vector Search:</strong> Takes a user profile → Generates query vector → Finds similar people & connections</p>
                    <p><strong>3. Recommendations:</strong> Uses cosine similarity to rank matches by relevance</p>
                    <p><strong>4. Results:</strong> Returns top matches with similarity percentages</p>
                </CardContent>
            </Card>
        </div>
    );
} 