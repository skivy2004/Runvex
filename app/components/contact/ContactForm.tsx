// Bestand: app/components/contact/ContactForm.tsx
'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useFormState } from '@/hooks/useFormState'; // Import de nieuwe hook
import { Button } from '@/components/ui/button';

interface ContactFormData {
    naam: string;
    email: string;
    bericht: string;
}

// Dummy API Call
const handleContactSubmitApi = async (data: ContactFormData) => {
    console.log("Submitting contact form data:", data);
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    
    // Simuleer succes
    return { success: true, message: "We nemen zo snel mogelijk contact met u op." };
};


export const ContactForm: React.FC = () => {
    const { register, handleSubmit: useFormSubmit, formState: { errors } } = useForm<ContactFormData>();

    const initialFormData: ContactFormData = { naam: "", email: "", bericht: "" };
    const { state, handleSubmit: useFormStateSubmit } = useFormState<ContactFormData>(initialFormData);
    
    const onSubmitHandler = useFormStateSubmit(handleContactSubmitApi);

    const onSubmit = (data: ContactFormData) => {
        useFormSubmit(async (formData) => {
            const success = await onSubmitHandler(formData);
            // Bij succes: Reset form en toon succesmelding
        })(data);
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(useFormClient); }} className="space-y-6">
            {state.error && <div className="p-3 bg-red-900/50 text-red-300 rounded-md">{state.error}</div>}
            {state.successMessage && <div className="p-3 bg-green-900/50 text-green-300 rounded-md">{state.successMessage}</div>}

            {/* Naam Field */}
            <div>
                <label htmlFor="naam" className="block text-sm font-medium text--text-3">Naam</label>
                <input id="naam" {...register("naam", { required: "Naam is verplicht." })} className={`mt-1 block w-full border ${errors.naam ? 'border-red-500' : 'border--border'}`} />
                {errors.naam && <p className="text-xs text-red-400 mt-1">{errors.naam.message}</p>}
            </div>
            
            {/* Email Field */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text--text-3">E-mailadres</label>
                <input id="email" type="email" {...register("email", { required: "Email is verplicht.", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Geldig e-mailadres vereist." } })} className={`mt-1 block w-full border ${errors.email ? 'border-red-500' : 'border--border'}`} />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
            </div>

            {/* Bericht Field */}
            <div>
                <label htmlFor="bericht" className="block text-sm font-medium text--text-3">Bericht</label>
                <textarea id="bericht" rows={4} {...register("bericht", { required: "Bericht is verplicht." })} className={`mt-1 block w-full border ${errors.bericht ? 'border-red-500' : 'border--border'}`} />
                {errors.bericht && <p className="text-xs text-red-400 mt-1">{errors.bericht.message}</p>}
            </div>
            
            <Button type="submit" disabled={state.isLoading} className="w-full">
                {state.isLoading ? 'Verzendgegevens...' : "Verzend Boodschap"}
            </Button>
        </form>
    );
};