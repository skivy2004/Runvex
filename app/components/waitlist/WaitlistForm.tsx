// Bestand: app/components/waitlist/WaitlistForm.tsx
'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useFormState } from '@/hooks/useFormState'; // Import de nieuwe hook
import { Button } from '@/components/ui/button';

interface WaitlistFormData {
    email: string;
    naam: string;
}

// Dummy API Call
const handleWaitlistSubmitApi = async (data: WaitlistFormData) => {
    console.log("Submitting waitlist data:", data);
    await new Promise(resolve => setTimeout(resolve, 800)); 
    
    // Simuleer succes
    return { success: true, message: "Bedankt! We houden u op de hoogte." };
};


export const WaitlistForm: React.FC = () => {
    const { register, handleSubmit: useFormSubmit, formState: { errors } } = useForm<WaitlistFormData>();

    const initialFormData: WaitlistFormData = { email: "", naam: "" };
    const { state, handleSubmit: useFormStateSubmit } = useFormState<WaitlistFormData>(initialFormData);
    
    const onSubmitHandler = useFormStateSubmit(handleWaitlistSubmitApi);

    const onSubmit = (data: WaitlistFormData) => {
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
            
            <Button type="submit" disabled={state.isLoading} className="w-full">
                {state.isLoading ? 'Registreren...' : "Aanmelden"}
            </Button>
        </form>
    );
};