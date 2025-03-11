import React, { useState, useEffect } from 'react';
import ApiService from '../services/ApiService';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const TopExerciseLineChart = () => {
  const [topExerciseId, setTopExerciseId] = useState(null);
  const [topExerciseName, setTopExerciseName] = useState('');
  const [topExerciseType, setTopExerciseType] = useState('');
  const [exerciseData, setExerciseData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopExercise = async () => {
      try {
        const user = await ApiService.getLoggedInUser();
        const response = await ApiService.getWorkoutHistoryWithNames(user.user.id);

        if (response.statusCode === 200) {
          const workouts = response.workoutList;
          const exerciseMap = {};

          workouts.forEach(workout => {
            workout.exercises.forEach(exercise => {
              const exerciseName = exercise.exerciseDetailsName;
              exerciseMap[exerciseName] = (exerciseMap[exerciseName] || 0) + 1;
            });
          });

          const sortedExercises = Object.entries(exerciseMap).sort((a, b) => b[1] - a[1]);
          const topExercise = sortedExercises[0];

          if (topExercise) {
            const topExerciseName = topExercise[0];
            setTopExerciseName(topExerciseName);

            const topExerciseDetails = workouts.flatMap(workout => workout.exercises)
              .find(exercise => exercise.exerciseDetailsName === topExerciseName);

            setTopExerciseId(topExerciseDetails.exerciseDetailsId);
            setTopExerciseType(topExerciseDetails.type);

            const exerciseResponse = await ApiService.getWorkoutsByUserAndExercise(user.user.id, topExerciseDetails.exerciseDetailsId);
            setExerciseData(exerciseResponse.workoutList);
          } else {
            setError("No exercises found.");
          }
        } else {
          setError(response.message);
        }
      } catch (error) {
        setError("Error fetching exercise data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopExercise();
  }, []);

  useEffect(() => {
    if (exerciseData && topExerciseId) {
      const labels = exerciseData.map(workout => workout.date.split('T')[0]);
      const setsData = exerciseData.map(workout => workout.exercises[0].sets.length || 0);
      const repsData = exerciseData.map(workout => workout.exercises[0].sets.reduce((total, set) => total + (set.reps || 0), 0));
      const weightsData = exerciseData.map(workout => Math.max(...workout.exercises[0].sets.map(set => set.weight || 0), 0));
      const durationData = exerciseData.map(workout => workout.exercises[0].sets.reduce((total, set) => total + (new Date(`1970-01-01T${set.duration}Z`).getTime() / 1000 || 0), 0));

      const datasets = [
        {
          label: 'Sets',
          data: setsData,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 1,
          fill: true,
          yAxisID: 'y1',
        },
        {
          label: 'Weight PR',
          data: weightsData,
          borderColor: 'rgba(153, 102, 255, 1)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderWidth: 1,
          fill: true,
          yAxisID: 'y1',
        },
      ];

      if (topExerciseType === 'DYNAMIC') {
        datasets.push({
          label: 'Reps',
          data: repsData,
          borderColor: 'rgba(255, 159, 64, 1)',
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          borderWidth: 1,
          fill: true,
          yAxisID: 'y1',
        });
      } else if (topExerciseType === 'STATIC') {
        datasets.push({
          label: 'Duration (seconds)',
          data: durationData,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderWidth: 1,
          fill: true,
          yAxisID: 'y2',
        });
      }

      setChartData({
        labels: labels,
        datasets: datasets.filter(dataset => dataset.data.length > 0),
      });
    }
  }, [exerciseData, topExerciseId, topExerciseType]);

  if (loading) return <p className="text-center text-muted">Loading...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;

  return (
    <div className="col-md-6 col-lg-6 mb-4 w-100">
      <div className="card shadow-sm border-0 p-3 rounded text-center">
        <h5 className="card-title text-primary">Favorite Exercise: {topExerciseName}</h5>
        {chartData && chartData.labels && (
          <div className="chart-container mx-auto" style={{ width: '100%', maxWidth: '600px', minHeight: '300px' }}>
            <Line 
              data={chartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: {
                      color: '#000', // Improved contrast
                    },
                  },
                },
                scales: {
                  x: {
                    grid: {
                      color: 'rgba(0, 0, 0, 0.1)',
                    },
                    ticks: {
                      color: '#000',
                    },
                  },
                  y1: {
                    type: 'linear',
                    position: 'left',
                    grid: {
                      color: 'rgba(0, 0, 0, 0.1)',
                    },
                    ticks: {
                      color: '#000',
                    },
                  },
                },
              }} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TopExerciseLineChart;
