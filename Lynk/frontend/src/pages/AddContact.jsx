import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddContactManual from '../components/add-contact-components/AddContactManual';
import AddContactRecommendation from '../components/add-contact-components/AddContactRecommendation';

export default function AddContact() {
    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Add New Contact</h1>
                <p className="text-muted-foreground">
                    Add a new contact to your network. Choose your preferred method below.
                </p>
            </div>

            <Tabs defaultValue="manual" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="api">External Search</TabsTrigger>
                    <TabsTrigger value="manual">Add Manually</TabsTrigger>
                    <TabsTrigger value="recommendations">People You May Know</TabsTrigger>
                </TabsList>
                
                <TabsContent value="api" className="mt-6">
                    <div className="text-center py-12 text-muted-foreground">
                        <p>API integration coming soon...</p>
                        <p className="text-sm mt-2">This feature will allow you to import contacts from external platforms.</p>
                    </div>
                </TabsContent>
                
                <TabsContent value="manual" className="mt-6">
                    <AddContactManual />
                </TabsContent>
                
                <TabsContent value="recommendations" className="mt-6">
                    <AddContactRecommendation />
                </TabsContent>
            </Tabs>
        </div>
    );
}