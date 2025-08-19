import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar22 } from '../ui/date-picker';
import { CollapsibleSection } from '../CollapsibleSection';
import { UserAuth } from '../../context/AuthContext';
import { createContact } from '../../../backend/index.js';
import { uploadContactAvatar } from '../../../backend/supabase/storage.js';
import { useNavigate } from 'react-router';
import { ComboboxDemo } from '../Combobox';
import { industries } from '../../lib/industries';
import AvatarDemo from '../avatar-01';
import { getInitials } from '../contacts-table-components/columns';
import { Upload, Link } from 'lucide-react';
import { toast } from 'sonner';

export default function AddContactManual() {
    //  current user who is adding the contact
    const { session } = UserAuth();
    const uid = session?.user.id;
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

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

        // Avatar - NEW
        avatar_url: '',
        avatar_file: null,

        // Additional info
        notes: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarMethod, setAvatarMethod] = useState('upload'); // 'upload' or 'url'

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
            [field]: field === 'tags' ? value.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        // Required field validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        // Email validation (if provided)
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Phone validation (if provided) - matches the database constraint
        if (formData.phone_number && !/^\+?[1-9]\d{1,14}$/.test(formData.phone_number)) {
            newErrors.phone_number = 'Please enter a valid phone number (e.g., 1234567890)';
        }

        // Last contact date validation
        if (formData.last_contact_at) {
            const lastContactDate = new Date(formData.last_contact_at);
            const currentDate = new Date();
            if (lastContactDate > currentDate) {
                newErrors.last_contact_at = 'Last contact date cannot be in the future';
            }
        }

        // linkedIn URL validation
        if (formData.linkedin) {
            const linkedInPattern = /^https?:\/\/(www\.)?linkedin\.com\/.*$/i;
            if (!linkedInPattern.test(formData.linkedin)) {
                newErrors.linkedin = "Not a valid LinkedIn URL";
            }
        }

        // Tags validation
        if (formData.tags.length > 0) {
            const invalidTags = formData.tags.filter(tag => tag.includes(' '));
            if (invalidTags.length > 0) {
                newErrors.tags = 'Tags must be comma-separated without spaces';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle avatar file selection
    const handleAvatarFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, avatar_file: file, avatar_url: '' }));
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => setAvatarPreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    // Handle avatar URL change
    const handleAvatarUrlChange = (url) => {
        setFormData(prev => ({ ...prev, avatar_url: url, avatar_file: null }));
        setAvatarPreview(url);
    };

    // Clear avatar
    const clearAvatar = () => {
        setFormData(prev => ({ ...prev, avatar_file: null, avatar_url: '' }));
        setAvatarPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            let avatarUrl = formData.avatar_url;

            // Upload avatar file if one was selected
            if (formData.avatar_file) {
                const uploadResult = await uploadContactAvatar(uid, formData.avatar_file);
                if (!uploadResult.success) {
                    throw new Error('Failed to upload avatar: ' + uploadResult.error);
                }
                avatarUrl = uploadResult.publicUrl;
            }

            // Prepare data for submission
            const submissionData = {
                ...formData,
                avatar_url: avatarUrl,
                socials: {
                    ...(formData.linkedin && { linkedin: formData.linkedin }),
                    ...(formData.twitter && { twitter: formData.twitter }),
                    ...(formData.instagram && { instagram: formData.instagram })
                },
            };

            // Remove individual social media fields
            delete submissionData.linkedin;
            delete submissionData.twitter;
            delete submissionData.instagram;
            delete submissionData.avatar_file;

            const result = await createContact(submissionData, uid);

            if (!result.success) {
                toast.error(`Error adding contact: ${result.error}`);
                return;
            } else {
                // Reset form
                setFormData({
                    name: '', email: '', phone_number: '', company: '', role: '',
                    industry: '', school: '', where_met: '', last_contact_at: '',
                    relationship_type: [], tags: [], linkedin: '', twitter: '',
                    instagram: '', notes: '', avatar_url: '', avatar_file: null
                });
                clearAvatar();
                toast.success('Contact added successfully!');
                navigate("/all-contacts");
            }

        } catch (error) {
            toast.error(`Unexpected error adding contact: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Check if form is valid for submit button
    const isFormValid = formData.name.trim() !== '';

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold">Add Contact Manually</h2>
                <p className="text-muted-foreground mt-2">
                    Fill out the form below to add a new contact. Only name is required - add as much or as little detail as you'd like.
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
                        {/* Avatar Section */}
                        <div className="md:col-span-2">
                            <Label className="my-2">Profile Picture</Label>
                            <div className="flex items-center gap-4">
                                {/* Avatar Preview */}
                                <div className="w-20 h-20">
                                    <AvatarDemo 
                                        url={avatarPreview} 
                                        initials={formData.name ? getInitials(formData.name) : '?'} 
                                        className="w-20 h-20 text-xl"
                                    />
                                </div>
                                
                                {/* Avatar Method Toggle */}
                                <div className="flex-1 space-y-3">
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant={avatarMethod === 'upload' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setAvatarMethod('upload')}
                                        >
                                            <Upload className="w-4 h-4 mr-2" />
                                            Upload
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={avatarMethod === 'url' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setAvatarMethod('url')}
                                        >
                                            <Link className="w-4 h-4 mr-2" />
                                            URL
                                        </Button>
                                        {(avatarPreview || formData.avatar_url || formData.avatar_file) && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={clearAvatar}
                                            >
                                                Clear
                                            </Button>
                                        )}
                                    </div>

                                    {avatarMethod === 'upload' ? (
                                        <Input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarFileChange}
                                            className="w-full"
                                        />
                                    ) : (
                                        <Input
                                            placeholder="Paste image URL here..."
                                            value={formData.avatar_url}
                                            onChange={(e) => handleAvatarUrlChange(e.target.value)}
                                            className="w-full"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <Label className="my-2" htmlFor="name">Name *</Label>
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
                            <Label className="my-2" htmlFor="email">Email</Label>
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
                            <Label className="my-2" htmlFor="phone">Phone Number</Label>
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
                            <Label className="my-2" htmlFor="company">Company</Label>
                            <Input
                                id="company"
                                value={formData.company}
                                onChange={(e) => handleInputChange('company', e.target.value)}
                                placeholder="Company name"
                            />
                        </div>

                        <div>
                            <Label className="my-2" htmlFor="role">Role/Position</Label>
                            <Input
                                id="role"
                                value={formData.role}
                                onChange={(e) => handleInputChange('role', e.target.value)}
                                placeholder="Job title"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <Label className="my-2" htmlFor="industry">Industry</Label>
                            <ComboboxDemo id="industry" value={formData.industry}
                            className="flex outline-gray-400" inputs={industries}></ComboboxDemo>
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
                            <Label className="my-2" htmlFor="school">School/University</Label>
                            <Input
                                id="school"
                                value={formData.school}
                                onChange={(e) => handleInputChange('school', e.target.value)}
                                placeholder="Educational institution"
                            />
                        </div>

                        <div>
                            <Label className="my-2" htmlFor="last_contact">Last Contact Date</Label>
                            <Calendar22 className="outline-2 outline-solid outline-black"
                                selectedDate={formData.last_contact_at ? new Date(formData.last_contact_at) : undefined}
                                onDateChange={(date) => handleInputChange('last_contact_at', date ? date.toISOString().split('T')[0] : '')}
                            />
                            {errors.last_contact_at && (<p className="text-destructive text-sm mt-1">{errors.last_contact_at}</p>)}
                        </div>

                        <div className="md:col-span-2">
                            <Label className="my-2" htmlFor="where_met">Where We Met</Label>
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
                            <Label className="my-2 text-base font-medium">Relationship Type</Label>
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
                                            className="my-2 text-md font-normal capitalize cursor-pointer"
                                        >
                                            {type}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <Label className="my-2" htmlFor="tags">Tags</Label>
                            <Input
                                id="tags"
                                value={formData.tags}
                                onChange={(e) => handleInputChange("tags", e.target.value)}
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
                                <Label className="my-2" htmlFor="linkedin">LinkedIn</Label>
                                <Input
                                    id="linkedin"
                                    value={formData.linkedin}
                                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                                    placeholder="LinkedIn profile URL"
                                />
                                {errors.linkedin && (
                                <p className="text-destructive text-sm mt-1">{errors.linkedin}</p>
                            )}
                            </div>

                            <div>
                                <Label className="my-2" htmlFor="twitter">Twitter</Label>
                                <Input
                                    id="twitter"
                                    value={formData.twitter}
                                    onChange={(e) => handleInputChange('twitter', e.target.value)}
                                    placeholder="@username"
                                />
                            </div>

                            <div>
                                <Label className="my-2" htmlFor="instagram">Instagram</Label>
                                <Input
                                    id="instagram"
                                    value={formData.instagram}
                                    onChange={(e) => handleInputChange('instagram', e.target.value)}
                                    placeholder="@username"
                                />
                            </div>
                        </div>

                        <div>
                            <Label className="my-2" htmlFor="notes">Notes</Label>
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