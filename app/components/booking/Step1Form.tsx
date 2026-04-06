// Bestand: app/components/booking/Step1Form.tsx
'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useFormState } from '@/hooks/useFormState'; // Import de nieuwe hook
import { Button } from '@/components/ui/button'; // Annahme component

// Definieer het type voor de form data voor Stap 1
interface Step1FormData {
    naam: string;
    email: string;
    telefoon: string;
    bedrijf: string;
    dienst: string;
    bericht: string;
}

// Dummy API Call - Dit moet de echte API call zijn
const handleBookingSubmitApi = async (data: Step1FormData) => {
    console.log("Submitting to N8N endpoint with:", data);
    
    // Simuleer een API call naar /api/booking/create
    // In een echte app zou dit een fetch() zijn naar de route.
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    
    // Simulateer een succesvolle respons
    return { success: true, bookingId: "BOOK-12345" };
};

export const Step1Form: React.FC = () => {
    // 1. Gebruik useFormClient voor de form state
    const { register, handleSubmit: useFormSubmit, formState: { errors } } = useForm<Step1FormData>({
        defaultValues: {
            naam: "",
            email: "",
            telefoon: "",
            bedrijf: "",
            dienst: "",
            bericht: ""
        }
    });

    // 2. INITIALISATIE VAN DE HOOK: Simuleer de initiale/default state
    const initialFormData: Step1FormData = {
        naam: "",
        email: "",
        telefoon: "",
        bedrijf: "",
        dienst: "",
        bericht: ""
    };

    // 3. Implementeer de nieuwe, centrale submit handler
    const { state, handleSubmit: useFormStateSubmit } = useFormState<Step1FormData>(initialFormData);
    
    // Gebruik de gekoppelde, geoptimaliseerde submit handler
    const onSubmitHandler = useFormStateSubmit(handleBookingSubmitApi);

    // Verwerk de form submission
    const onSubmit = (data: Step1FormData) => {
        // Voer de gespecialiseerde handler uit
        useFormSubmit(async (formData) => {
            const success = await onSubmitHandler(formData);
            if (success) {
                // Indien succesvol, update de UI/state (dit kan leiden tot een state update in de parent)
            }
        })(data);
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(useFormClient); }} className="space-y-6">
            {/* Toon fouten en laadstatussen gebaseerd op de centrale state */}
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
            
            {/* Overige velden... (voor de sake van de demo) */}
            <Button type="submit" disabled={state.isLoading} className="w-full">
                {state.isLoading ? 'Verzendgegevens...' : "Volgende Stap"}
            </Button>
        </form>
    );
};