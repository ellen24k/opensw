import { useState, createContext, useEffect } from "react";

export const SelectedOptionIdContext = createContext(null);
export const SelectedOptionIdSetterContext = createContext(null);

function useLocalSelectedOptionId(value) {
    const [selectedOptionId, setSelectedOptionId] = useState(
        () => {
            return localStorage.getItem("selectedOptionId") || value;
        }
    );
    return [selectedOptionId, setSelectedOptionId];
}

export function SelectedOptionIdProvider({ children }) {
    const [selectedOptionId, setSelectedOptionId] = useLocalSelectedOptionId(0);
    useEffect(() => {
        localStorage.setItem("selectedOptionId", selectedOptionId);
    }, [selectedOptionId]);

    return (
        <SelectedOptionIdContext.Provider value={selectedOptionId}>
            <SelectedOptionIdSetterContext.Provider value={setSelectedOptionId}>
                {children}
            </SelectedOptionIdSetterContext.Provider>
        </SelectedOptionIdContext.Provider>
    );
}  