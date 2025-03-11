import React, { useState, useEffect } from 'react';
import ApiService from '../services/ApiService';
import { useNavigate } from 'react-router-dom';
import { MdModeEditOutline } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";



const WorkoutHistory = () => {
    const [user, setUser] = useState(null);
    const [workoutHistory, setWorkoutHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize navigate

    // Fetch the logged-in user
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await ApiService.getLoggedInUser();
                setUser(response.user);
            } catch (error) {
                setError(error.response?.data?.message || error.message);
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    // Fetch the workout history for the user
    useEffect(() => {
        const fetchWorkoutHistory = async () => {
            if (user && user.id) {
                try {
                    const response = await ApiService.getWorkoutHistory(user.id);
                    if (response.statusCode === 200) {
                        const workouts = response.workoutList;

                        // Fetch exercise details for each workout
                        const workoutsWithDetails = await Promise.all(workouts.map(async (workout) => {
                            const exercisesWithDetails = await Promise.all(workout.exercises.map(async (we) => {
                                try {
                                    const exerciseResponse = await ApiService.getExerciseDetails(we.exerciseDetailsId);
                                    return {
                                        ...we,
                                        exerciseDetails: exerciseResponse.exerciseDetails,
                                    };
                                } catch (error) {
                                    console.error('An error occurred while fetching exercise details:', error);
                                    return {
                                        ...we,
                                        exerciseDetails: {},
                                    };
                                }
                            }));

                            return {
                                ...workout,
                                exercises: exercisesWithDetails,
                            };
                        }));

                        // Sort workouts by date in descending order
                        const sortedWorkouts = workoutsWithDetails.sort((a, b) => new Date(b.date) - new Date(a.date));
                        setWorkoutHistory(sortedWorkouts);
                    } else {
                        setError(response.message);
                    }
                } catch (error) {
                    setError("Error fetching workout history.");
                }
                setLoading(false);
            }
        };

        fetchWorkoutHistory();
    }, [user]);

    // Function to format duration as minutes and seconds
    const formatDuration = (duration) => {
        if (!duration) return '0 sec';
        
        // Remove the 'PT' prefix
        const trimmed = duration.replace('PT', '');
        
        // Extract minutes and seconds from the duration string
        const match = trimmed.match(/(?:(\d+)M)?(?:(\d+)S)?/);
        
        if (match) {
            const minutes = match[1] ? parseInt(match[1], 10) : 0;
            const seconds = match[2] ? parseInt(match[2], 10) : 0;
            
            if (minutes > 0) {
                return `${minutes}:${seconds < 10 ? '0' : ''}${seconds} min`;
            }
            return `${seconds} sec`;
        }
    
        return '0 sec';
    };

    // Handle edit and delete actions
    const handleEdit = (workoutId) => {
        navigate(`/edit-workout/${workoutId}`);
    };

    const handleDelete = async (workoutId) => {
        if (window.confirm('Are you sure you want to delete this workout?')) {
            try {
                await ApiService.deleteWorkout(workoutId);
                setWorkoutHistory(workoutHistory.filter(workout => workout.id !== workoutId));
            } catch (error) {
                setError('Error deleting workout.');
            }
        }
    };

    if (loading) return <p className='history-loading'>Loading...</p>;
    if (error) return <p className='history-error'>{error}</p>;

    return (
        <div className="container mt-4">
            {workoutHistory.length === 0 ? (
                <div className="alert alert-warning text-center">No workouts found.</div>
            ) : (
                workoutHistory.map((workout) => (
                    <div key={workout.id} className="card shadow mb-3">
                        <div className="card-body">
                            {/* Workout Name & Buttons */}
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="text-primary fw-bold">{workout.name}</h5>
                                <div>
                                    <button className="btn btn-outline-success me-2" onClick={() => handleEdit(workout.id)}>
                                        <MdModeEditOutline />
                                    </button>
                                    <button className="btn btn-outline-danger" onClick={() => handleDelete(workout.id)}>
                                        <MdDeleteForever />
                                    </button>
                                </div>
                            </div>

                            {/* Exercise List */}
                            <ul className="list-group mt-3">
                                {workout.exercises.map((exercise) => (
                                    <li className="list-group-item" key={exercise.id}>
                                        <strong>{exercise.exerciseDetails.name}</strong>
                                        <ul className="mt-2">
                                            {exercise.exerciseDetails.type === "STATIC"
                                                ? exercise.sets.map((set) => (
                                                      <li key={set.id}>
                                                          {formatDuration(set.duration)} x {set.weight} kg
                                                      </li>
                                                  ))
                                                : exercise.sets.map((set) => (
                                                      <li key={set.id}>
                                                          {set.reps} reps x {set.weight} kg
                                                      </li>
                                                  ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default WorkoutHistory;
