import React from 'react';
import { useState, useEffect } from 'react';
import "./Dashboard.css";
import AreaChartComponent from "../Components/AreaChart";
import MacroNutrientPieChart from "../Components/MacronutrientPieChart";
import StackedBarChartComponent from "../Components/MacroStackedBarChart";
import DailyCaloricIntakeChart from '../Components/DailyCaloricIntakeChart';
import ProgressBar from '../Components/CaloricIntakeProgressBar';
import { getMealJournal, MealJournalDisplay } from '../Components/MealJournalService';
import { useAuth } from '../Contexts/AuthContext';

const Dashboard = () => {
  const { authUser, isLoggedIn } = useAuth();
  const [mealJournal, setMealJournal] = useState(getMealJournal());

  return (
    <div className="dashboard">

      <div className="box box1">
        <MacroNutrientPieChart />
      </div>
      <div className="box box2">
        <DailyCaloricIntakeChart />
      </div>
      <div className="box box3">
        <ProgressBar />
      </div>
      <div className="box box4">
        <MealJournalDisplay mealJournal={mealJournal} />
      </div>
    </div>
  );
};

export default Dashboard;