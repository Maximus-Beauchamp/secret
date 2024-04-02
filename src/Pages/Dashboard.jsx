import React, { useState, useEffect } from 'react';
import "./Dashboard.css";
import AreaChartComponent from "../Components/AreaChart";
import MacroNutrientPieChart from "../Components/MacronutrientPieChart";
import StackedBarChartComponent from "../Components/MacroStackedBarChart";
import DailyCaloricIntakeChart from '../Components/DailyCaloricIntakeChart';
import ProgressBar from '../Components/CaloricIntakeProgressBar';
import { getMealJournal, MealJournalDisplay } from '../Components/MealJournalService'; 


const Dashboard = () => {
  const [mealJournal, setMealJournal] = useState([]);

  useEffect(() => {
      setMealJournal(getMealJournal());
  }, []);

  return (
      <div className="dashboard">
          <div className="left-container">
              <div className="box box1">
                <MacroNutrientPieChart />
              </div>
              <div className="box box2">
                <StackedBarChartComponent />
              </div>
          </div>
          <div className="box box3">
            <ProgressBar />
            <MealJournalDisplay mealJournal={mealJournal} />
          </div>
          <div className="right-container">
              <div className="box box4">
                <DailyCaloricIntakeChart />
              </div>
              <div className="box box5">
                <AreaChartComponent />
              </div>
          </div>
      </div>
  );
};

export default Dashboard;