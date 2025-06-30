import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar22 } from '../components/ui/date-picker';

export default function AddContact() {
    // Form state
    const [formData, setFormData] = useState({
        // Required fields
        name: '',

        // Basic contact info
        email: '',
        phone_number: '',

        // Professional info
        company: '',
        role: '',
        industry: '',

        // Background
        school: '',
        where_met: '',
        last_contact_at: '',

        // Relationship & categorization
        relationship_type: [],
        tags: [],

        // Social media (as individual fields that will be combined into jsonb)
        linkedin: '',
        twitter: '',
        instagram: '',

        // Additional info
        notes: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Collapsible sections state
    const [openSections, setOpenSections] = useState({
        basic: true,        // Basic info starts open w/ required fields
        professional: false,
        background: false,
        relationship: false,
        social: false
    });

    // Toggle section open/closed
    const toggleSection = (section) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Handle input changes
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    // Handle relationship type changes (multiple selection)
    const handleRelationshipTypeChange = (type) => {
        setFormData(prev => ({
            ...prev,
            relationship_type: prev.relationship_type.includes(type)
                ? prev.relationship_type.filter(t => t !== type)
                : [...prev.relationship_type, type]
        }));
    };

    // Handle tags input (comma-separated)
    const handleTagsChange = (value) => {
        const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
        setFormData(prev => ({
            ...prev,
            tags
        }));
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        // Required field validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        // https://mailtrap.io/blog/javascript-email-validation/
        // Email validation (if provided)
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Phone validation (if provided) - matches the database constraint
        // https://stackoverflow.com/questions/4338267/validate-phone-number-with-javascript
        if (formData.phone_number && !/^\+?[1-9]\d{1,14}$/.test(formData.phone_number)) {
            newErrors.phone_number = 'Please enter a valid phone number (e.g., 1234567890)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare data for submission
            const submissionData = {
                ...formData,
                // Combine social media into jsonb object
                socials: {
                    ...(formData.linkedin && { linkedin: formData.linkedin }),
                    ...(formData.twitter && { twitter: formData.twitter }),
                    ...(formData.instagram && { instagram: formData.instagram })
                }
            };

            // Remove individual social media fields
            delete submissionData.linkedin;
            delete submissionData.twitter;
            delete submissionData.instagram;

            // TODO: Submit to Supabase
            console.log('Submitting contact:', submissionData);

            // Reset form on success
            setFormData({
                name: '', email: '', phone_number: '', company: '', role: '',
                industry: '', school: '', where_met: '', last_contact_at: '',
                relationship_type: [], tags: [], linkedin: '', twitter: '',
                instagram: '', notes: ''
            });

            // TODO: Show success message and redirect
            alert('Contact added successfully!');

        } catch (error) {
            console.error('Error adding contact:', error);
            // TODO: Show error message
        } finally {
            setIsSubmitting(false);
        }
    };

    // Check if form is valid for submit button
    const isFormValid = formData.name.trim() !== '';

    // Collapsible Section Component
    const CollapsibleSection = ({ title, isOpen, onToggle, required = false, children }) => (
        <div className="space-y-3">
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
                    <CardContent className="space-y-4 pt-6">
                        {children}
                    </CardContent>
                </Card>
            )}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Add New Contact</h1>
                <p className="text-muted-foreground mt-2">
                    Add a new contact to your network. Only name is required - add as much or as little detail as you'd like.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <CollapsibleSection
                    title="Basic Information"
                    isOpen={openSections.basic}
                    onToggle={() => toggleSection('basic')}
                    required={true}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Full name"
                                className={errors.name ? 'border-destructive' : ''}
                            />
                            {errors.name && (
                                <p className="text-destructive text-sm mt-1">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="email@example.com"
                                className={errors.email ? 'border-destructive' : ''}
                            />
                            {errors.email && (
                                <p className="text-destructive text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={formData.phone_number}
                                onChange={(e) => handleInputChange('phone_number', e.target.value)}
                                placeholder="1234567890"
                                className={errors.phone_number ? 'border-destructive' : ''}
                            />
                            {errors.phone_number && (
                                <p className="text-destructive text-sm mt-1">{errors.phone_number}</p>
                            )}
                        </div>
                    </div>
                </CollapsibleSection>

                {/* Professional Information */}
                <CollapsibleSection
                    title="Professional Information"
                    isOpen={openSections.professional}
                    onToggle={() => toggleSection('professional')}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="company">Company</Label>
                            <Input
                                id="company"
                                value={formData.company}
                                onChange={(e) => handleInputChange('company', e.target.value)}
                                placeholder="Company name"
                            />
                        </div>

                        <div>
                            <Label htmlFor="role">Role/Position</Label>
                            <Input
                                id="role"
                                value={formData.role}
                                onChange={(e) => handleInputChange('role', e.target.value)}
                                placeholder="Job title"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="industry">Industry</Label>
                            <Input
                                id="industry"
                                value={formData.industry}
                                onChange={(e) => handleInputChange('industry', e.target.value)}
                                placeholder="e.g., Technology, Healthcare, Finance"
                            />
                        </div>
                    </div>
                </CollapsibleSection>

                {/* Background & Context */}
                <CollapsibleSection
                    title="Background & Context"
                    isOpen={openSections.background}
                    onToggle={() => toggleSection('background')}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="school">School/University</Label>
                            <Input
                                id="school"
                                value={formData.school}
                                onChange={(e) => handleInputChange('school', e.target.value)}
                                placeholder="Educational institution"
                            />
                        </div>

                        <div>
                            <Label htmlFor="last_contact">Last Contact Date</Label>
                            <Calendar22 className="outline-2 outline-solid outline-black"
                                selectedDate={formData.last_contact_at ? new Date(formData.last_contact_at) : undefined}
                                onDateChange={(date) => handleInputChange('last_contact_at', date ? date.toISOString().split('T')[0] : '')}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="where_met">Where We Met</Label>
                            <Input
                                id="where_met"
                                value={formData.where_met}
                                onChange={(e) => handleInputChange('where_met', e.target.value)}
                                placeholder="e.g., Conference, LinkedIn, Mutual friend"
                            />
                        </div>
                    </div>
                </CollapsibleSection>

                {/* Relationship & Tags */}
                <CollapsibleSection
                    title="Relationship & Categories"
                    isOpen={openSections.relationship}
                    onToggle={() => toggleSection('relationship')}
                >
                    <div className="space-y-4">
                        <div>
                            <Label className="text-base font-medium">Relationship Type</Label>
                            <div className="flex flex-wrap gap-10 mt-3">
                                {['professional', 'personal', 'social'].map((type) => (
                                    <div key={type} className="flex items-center space-x-2">
                                        <Checkbox
                                            className="outline-2 outline-solid outline-black *:checked:outline-destructive"
                                            id={`relationship-${type}`}
                                            checked={formData.relationship_type.includes(type)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    // add to relationship_type array
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        relationship_type: [...prev.relationship_type, type]
                                                    }));
                                                } else {
                                                    setFormData(prev => ({
                                                        // remove from relationship_type array
                                                        ...prev,
                                                        relationship_type: prev.relationship_type.filter(t => t !== type)
                                                    }));
                                                }
                                            }}
                                        />
                                        <Label
                                            htmlFor={`relationship-${type}`}
                                            className="text-md font-normal capitalize cursor-pointer"
                                        >
                                            {type}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="tags">Tags</Label>
                            <Input
                                id="tags"
                                value={formData.tags.join(', ')}
                                onChange={(e) => handleTagsChange(e.target.value)}
                                placeholder="e.g., mentor, client, friend (separate with commas)"
                            />
                        </div>
                    </div>
                </CollapsibleSection>

                {/* Social Media & Notes */}
                <CollapsibleSection
                    title="Social Media & Additional Notes"
                    isOpen={openSections.social}
                    onToggle={() => toggleSection('social')}
                >
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="linkedin">LinkedIn</Label>
                                <Input
                                    id="linkedin"
                                    value={formData.linkedin}
                                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                                    placeholder="LinkedIn profile URL"
                                />
                            </div>

                            <div>
                                <Label htmlFor="twitter">Twitter</Label>
                                <Input
                                    id="twitter"
                                    value={formData.twitter}
                                    onChange={(e) => handleInputChange('twitter', e.target.value)}
                                    placeholder="@username"
                                />
                            </div>

                            <div>
                                <Label htmlFor="instagram">Instagram</Label>
                                <Input
                                    id="instagram"
                                    value={formData.instagram}
                                    onChange={(e) => handleInputChange('instagram', e.target.value)}
                                    placeholder="@username"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                value={formData.notes}
                                onChange={(e) => handleInputChange('notes', e.target.value)}
                                placeholder="Any additional notes about this contact..."
                                rows={4}
                            />
                        </div>
                    </div>
                </CollapsibleSection>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => window.history.back()}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={!isFormValid || isSubmitting}
                    >
                        {isSubmitting ? 'Adding Contact...' : 'Add Contact'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
