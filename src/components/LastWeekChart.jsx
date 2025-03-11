import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import ApiService from '../services/ApiService';
import { color } from 'chart.js/helpers';

const LastWeekChart = () => {
    const [user, setUser] = useState(null);
    const [exerciseCounts, setExerciseCounts] = useState(Array(7).fill(0));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await ApiService.getLoggedInUser();
                setUser(response.user);
            } catch (error) {
                setError(error.response?.data?.message || "Error fetching user data.");
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchWorkoutHistory = async () => {
            if (!user?.id) return;

            try {
                const response = await ApiService.getWorkoutHistory(user.id);
                console.log("Workout Response:", response);

                if (response.statusCode === 200) {
                    const workouts = response.workoutList;

                    // Get last 7 days
                    const last7Days = Array.from({ length: 7 }, (_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() - i);
                        return date.toISOString().split('T')[0];
                    }).reverse();

                    // Initialize counts to zero
                    const exerciseCountMap = last7Days.reduce((acc, date) => {
                        acc[date] = 0;
                        return acc;
                    }, {});

                    // Count exercises for each day
                    workouts.forEach(workout => {
                        const workoutDate = workout.date.split('T')[0];
                        if (exerciseCountMap.hasOwnProperty(workoutDate)) {
                            exerciseCountMap[workoutDate] += workout.exercises.length;
                        }
                    });

                    const counts = last7Days.map(date => exerciseCountMap[date]);
                    console.log("Final Exercise Counts:", counts);
                    setExerciseCounts(counts);
                } else {
                    setError(response.message);
                }
            } catch (error) {
                setError("Error fetching workout history.");
            }
            setLoading(false);
        };

        fetchWorkoutHistory();
    }, [user]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="alert alert-danger">{error}</p>;

    const data = {
        labels: Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i)); // Last 7 days
            return date.toLocaleDateString(undefined, { weekday: 'short' });
        }),
        datasets: [
            {
                label: 'Exercises Completed',
                data: exerciseCounts,
                backgroundColor: 'lightgreen',
                hoverBackgroundColor: 'green',
                hoverBorderColor: 'lightgreen',
                borderColor: 'lightgreen',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            x: {
                ticks: { color: 'black' },
                grid: { color: 'gray' },
            },
            y: {
                beginAtZero: true,
                suggestedMax: Math.max(...exerciseCounts) + 2, // Prevents excessive growth
                ticks: { color: 'black' },
                grid: { color: 'gray' },
            },
        },
        plugins: {
            legend: {
                labels: { color: 'black' },
            },
        },
    };

    return (
        <div className="container mt-3">
            <div className="card shadow p-3">
                <h5 className="text-center text-primary">Last 7 Days Summary</h5>
                <div className="chart-container" style={{ height: '300px' }}>
                    <Bar data={data} options={options} />
                </div>
            </div>
        </div>
    );
};

export default LastWeekChart;
