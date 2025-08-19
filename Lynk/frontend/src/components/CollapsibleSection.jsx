import { ChevronDown, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Collapsible Section Component
export const CollapsibleSection = ({ title, isOpen, onToggle, required = false, children }) => (
    <div className={ isOpen ? "space-y-3" : "space-y-3 border-2 rounded-2xl"}>
        <Button
            type="button"
            variant="ghost"
            onClick={onToggle}
            className="w-full justify-between p-0 h-auto hover:bg-transparent"
        >
            <h3 className="text-lg font-semibold flex items-center gap-2">
                {title}
                {required && <span className="text-destructive">*</span>}
            </h3>
            {isOpen ? (
                <ChevronDown className="h-4 w-4" />
            ) : (
                <ChevronRight className="h-4 w-4" />
            )}
        </Button>

        {isOpen && (
            <Card>
                <CardContent className="space-y-4">
                    {children}
                </CardContent>
            </Card>
        )}
    </div>
);
