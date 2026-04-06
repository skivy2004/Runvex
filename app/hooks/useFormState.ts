'use client';
import { useState, useCallback } from 'react';
import { useFormClient } from 'react-hook-form';

/**
 * Type voor de globale form state
 * @template T - Het type van de form data
 */
export interface FormState<T> {
    isLoading: boolean;
    error: string | null;
    successMessage: string | null;
    submitData: T;
}

/**
 * Custom hook voor gestandaardiseerd form state management.
 * Biedt consistente handling voor loading, fouten en succesmeldingen.
 * @param initialData Initial state van de data (voor reset of initiële waarden)
 * @returns Een object met de form state en een geüpdate submit handler.
 */
export function useFormState<T>(initialData: T): {
    state: FormState<T>;
    handleSubmit: (data: T) => Promise<any> | Promise<boolean>;
} {
    const [state, setState] = useState<FormState<T>>({
        isLoading: false,
        error: null,
        successMessage: null,
        submitData: initialData,
    });

    /**
     * De gecombineerde submit handler die de loading-state beheert.
     * @param onSubmitCallback De asynchrone functie die de API call doet.
     */
    const handleSubmit: (onSubmitCallback: (data: T) => Promise<any>) => async (data: T) => {
        return async (data: T) => {
            setState(prev => ({ ...prev, isLoading: true, error: null, successMessage: null }));
            try {
                const result = await onSubmitCallback(data);
                
                // Stel succesmelding in, of retouneer het resultaat indien anders nodig
                setState(prev => ({ ...prev, isLoading: false, successMessage: "Succesvol verstuurd!", error: null }));
                return true; // Signaleert succes naar de component
            } catch (e) {
                console.error("Form submission error:", e);
                const errorMessage = e instanceof Error ? e.message : "Er is een onbekende fout opgetreden.";
                setState(prev => ({ ...prev, isLoading: false, error: errorMessage, successMessage: null }));
                return false; // Signaleert falen naar de component
            }
        };
    };

    return { state, handleSubmit };
}