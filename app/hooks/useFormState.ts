'use client'
import { useState } from 'react'

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
 */
export function useFormState<T>(initialData: T) {
    const [state, setState] = useState<FormState<T>>({
        isLoading: false,
        error: null,
        successMessage: null,
        submitData: initialData,
    });

    const handleSubmit = (onSubmitCallback: (data: T) => Promise<unknown>) => {
        return async (data: T) => {
            setState(prev => ({ ...prev, isLoading: true, error: null, successMessage: null }));
            try {
                await onSubmitCallback(data);
                setState(prev => ({ ...prev, isLoading: false, successMessage: "Succesvol verstuurd!", error: null }));
                return true;
            } catch (e) {
                console.error("Form submission error:", e);
                const errorMessage = e instanceof Error ? e.message : "Er is een onbekende fout opgetreden.";
                setState(prev => ({ ...prev, isLoading: false, error: errorMessage, successMessage: null }));
                return false;
            }
        };
    };

    return { state, handleSubmit };
}