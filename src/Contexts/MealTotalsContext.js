import React, { createContext, useState, useContext, useEffect } from 'react';
import { getMealJournal, calculateMealTotals } from '../Components/MealJournalService'; // Adjust the import path

export const MealTotalsContext = createContext();

export const useMealTotals = () => useContext(MealTotalsContext);

export const MealTotalsProvider = ({ children }) => {
    const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });

    useEffect(() => {
        // Fetch the meal journal and calculate totals when the provider mounts or updates
        const mealJournal = getMealJournal();
        const newTotals = calculateMealTotals(mealJournal);
        setTotals(newTotals);
    }, []);

    return (
        <MealTotalsContext.Provider value={totals}>
            {children}
        </MealTotalsContext.Provider>
    );
};
