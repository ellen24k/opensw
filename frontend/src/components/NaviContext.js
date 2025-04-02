import { useState, createContext } from "react";

export const SelectedOptionIdContext = createContext(null);
export const SelectedOptionIdSetterContext = createContext(null);

export function SelectedOptionIdProvider({ children }) {
    const [selectedOptionId, setSelectedOptionId] = useState(0);

    return (
        <SelectedOptionIdContext.Provider value={selectedOptionId}>
            <SelectedOptionIdSetterContext.Provider value={setSelectedOptionId}>
                {children}
            </SelectedOptionIdSetterContext.Provider>
        </SelectedOptionIdContext.Provider>
    );
}  