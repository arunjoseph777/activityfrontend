import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ApiService from '../services/ApiService';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = () => {
    const [chartData, setChartData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch workout data and prepare chart data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const loggedInUser = await ApiService.getLoggedInUser();
                const data = await ApiService.getWorkoutHistory(loggedInUser.user.id);
                const workouts = data.workoutList;

                // Prepare data for the chart
                const workoutDates = workouts.map(workout => new Date(workout.date).toLocaleDateString());
                const exerciseCounts = workouts.map(workout => workout.exercises.length);

                setChartData({
                    labels: workoutDates,
                    datasets: [
                        {
                            label: 'Number of Exercises',
                            data: exerciseCounts,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1.5,
                        },
                    ],
                });
                setLoading(false);
            } catch (error) {
                setError('Error fetching workout data');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <p className="text-center text-muted">Loading...</p>;
    if (error) return <p className="text-center text-danger">{error}</p>;

    return (
        <div className="col-md-6 col-lg-6 mb-4 w-100">
            <div className="card shadow-sm border-0 p-3 rounded text-center">
                <h5 className="card-title text-primary">Exercises per Workout</h5>
                <div className="chart-container mx-auto" style={{ width: '100%', maxWidth: '600px', minHeight: '300px' }}>
                    <Bar
                        data={chartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'top',
                                    labels: {
                                        color: '#000', // Improved contrast
                                    },
                                },
                            },
                            scales: {
                                x: {
                                    ticks: {
                                        color: '#000',
                                    },
                                },
                                y: {
                                    ticks: {
                                        color: '#000',
                                    },
                                },
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default BarChart;
