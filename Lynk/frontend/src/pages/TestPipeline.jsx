import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { processAllUserEmbeddings, processAllConnectionEmbeddings } from '../../../backend/services/batch-embedding-pipeline.js';

export default function TestPipeline() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    const runPipeline = async () => {
        setIsProcessing(true);
        setError(null);
        setResults(null);

        try {
            console.log('Starting embedding pipeline...');
            
            // Process user embeddings
            console.log('Processing user embeddings...');
            await processAllUserEmbeddings();
            
            // Process connection embeddings
            console.log('Processing connection embeddings...');
            await processAllConnectionEmbeddings();
            
            setResults({
                success: true,
                message: 'Pipeline completed successfully! Check console for details.',
                timestamp: new Date().toISOString()
            });
            
        } catch (err) {
            console.error('Pipeline failed:', err);
            setError(err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Test Embedding Pipeline</h1>
                <p className="text-muted-foreground">
                    This page tests the embedding pipeline that processes existing Supabase data 
                    and stores vector embeddings in Qdrant using Together AI.
                </p>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Pipeline Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button 
                        onClick={runPipeline}
                        disabled={isProcessing}
                        className="w-full"
                    >
                        {isProcessing ? 'Processing...' : 'Run Embedding Pipeline'}
                    </Button>
                    
                    {isProcessing && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                            <p className="text-blue-800">
                                Processing embeddings... This may take a few minutes.
                                Check the browser console for detailed progress.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {results && (
                <Card className="mb-6 border-green-200 bg-green-50">
                    <CardHeader>
                        <CardTitle className="text-green-800">Success</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-green-700">{results.message}</p>
                        <p className="text-sm text-green-600 mt-2">
                            Completed at: {new Date(results.timestamp).toLocaleString()}
                        </p>
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
                    <CardTitle>What This Does</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p>1. Fetches all users and connections from Supabase</p>
                    <p>2. Generates embeddings using Together AI (BAAI/bge-base-en-v1.5)</p>
                    <p>3. Stores vectors in Qdrant with metadata</p>
                    <p>4. Enables similarity search for recommendations</p>
                </CardContent>
            </Card>
        </div>
    );
} 