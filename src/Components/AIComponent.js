import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';  // Check path case sensitivity if on UNIX/Linux system
import { MakeOpenAIRequest } from './AI';  // Ensure correct import path

const AIRecommendationComponent = () => {
  const { authUser } = useAuth();
  const [recommendation, setRecommendation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (authUser && authUser.username) {  // Ensure authUser.username is not undefined
        setIsLoading(true);
        try {
          const profileResponse = await axios.get(`http://localhost:8081/profile-info?username=${encodeURIComponent(authUser.username)}`);
          const { bmr, currentCalories, fitnessGoal } = profileResponse.data.metrics;
          const prompt = `Given a BMR of ${bmr}, current intake of ${currentCalories} calories, and a fitness goal of '${fitnessGoal}', suggest a meal plan:`;
          const aiRecommendation = await MakeOpenAIRequest(prompt);
          setRecommendation(aiRecommendation);
        } catch (error) {
          console.error("Error fetching data or AI recommendation:", error);
          setRecommendation("Failed to fetch recommendation. Check console for details.");
        }
        setIsLoading(false);
      }
    };

    fetchData();
  }, [authUser]);

  return (
    <div>
      {isLoading ? <p>Loading...</p> : (
        <div>
          <h2>AI Dietary Recommendation</h2>
          <p>{recommendation || "No recommendation available. Please ensure you are logged in and profile is complete."}</p>
        </div>
      )}
    </div>
  );
};

export default AIRecommendationComponent;
