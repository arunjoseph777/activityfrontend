import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ExerciseSearch from '../components/ExerciseSearch';
import AddSet from '../components/AddSet';
import Navbar from '../components/Navbar';
import axios from 'axios';
import ApiService from "../services/ApiService";
import { IoIosRemoveCircle } from "react-icons/io";
import Footer from './Footer';

// Utility function to parse ISO 8601 duration and convert it to seconds
const parseISO8601Duration = (duration) => {
    const regex = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
    const match = regex.exec(duration);
    if (!match) return 0;

    const hours = parseInt(match[1] || '0', 10);
    const minutes = parseInt(match[2] || '0', 10);
    const seconds = parseInt(match[3] || '0', 10);

    return (hours * 3600) + (minutes * 60) + seconds;
};

// Utility function to format seconds into minutes and seconds
const formatDuration = (seconds) => {
    if (seconds >= 60) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes} min ${remainingSeconds} sec`;
    }
    return `${seconds} sec`;
};

const EditWorkout = () => {
    const [workoutExercises, setWorkoutExercises] = useState([]);
    const [message, setMessage] = useState('');
    const { workoutId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWorkout = async () => {
            try {
                // Retrieve the Bearer token from localStorage or any other secure storage
                const token = localStorage.getItem('token');
                
                // Ensure the token is not null or undefined
                if (!token) {
                    console.error('No token found');
                    return;
                }
    
                // Make the request with the Bearer token
                const response = await axios.get(`http://localhost:8080/api/workouts/${workoutId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
    
                const workout = response.data.workout;
    
                if (workout) {
                    const exercisesWithDetails = await Promise.all(workout.exercises.map(async (we) => {
                        try {
                            const exerciseResponse = await axios.get(`http://localhost:8080/api/exercise-details/${we.exerciseDetailsId}`, {
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                },
                            });
                            return {
                                ...we,
                                exerciseDetails: exerciseResponse.data.exerciseDetails,
                            };
                        } catch (error) {
                            console.error('An error occurred while fetching exercise details:', error);
                            return {
                                ...we,
                                exerciseDetails: {},
                            };
                        }
                    }));
    
                    setWorkoutExercises(exercisesWithDetails.map((we) => ({
                        exerciseDetails: we.exerciseDetails || {},
                        sets: we.sets || [],
                    })));
                }
            } catch (error) {
                console.error('An error occurred while fetching workout details:', error);
            }
        };
    
        fetchWorkout();
    }, [workoutId]);
    

    const addWorkoutExercise = (exerciseDetails) => {
        setWorkoutExercises([...workoutExercises, { exerciseDetails, sets: [] }]);
    };

    const addSetToExercise = (index, newSet) => {
        const updatedExercises = [...workoutExercises];
        updatedExercises[index].sets.push(newSet);
        setWorkoutExercises(updatedExercises);
    };

    const removeSetFromExercise = (exerciseIndex, setIndex) => {
        const updatedExercises = workoutExercises.map((we, index) =>
            index === exerciseIndex
                ? { ...we, sets: we.sets.filter((_, sIndex) => sIndex !== setIndex) }
                : we
        );
        setWorkoutExercises(updatedExercises);
    };

    const removeExercise = (exerciseIndex) => {
        const updatedExercises = workoutExercises.filter((_, index) => index !== exerciseIndex);
        setWorkoutExercises(updatedExercises);
    };

    const updateWorkout = async () => {
        try {
            const loggedInUser = await ApiService.getLoggedInUser();
            const userId = loggedInUser.user.id;

            const now = new Date();
            const workoutTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const workoutDate = now.toLocaleDateString();
            const workoutName = `${workoutTime} Workout, ${workoutDate}`;

            const workoutDTO = {
                name: workoutName,
                date: now.toISOString(),
                userId: userId,
                exercises: workoutExercises.map((we) => ({
                    exerciseDetailsId: we.exerciseDetails.id,
                    sets: we.sets.map((set) => ({
                        reps: set.reps !== undefined ? set.reps : null,
                        duration: set.duration !== undefined ? set.duration.toString() : null,
                        weight: set.weight !== undefined ? set.weight : 0.0,
                    })),
                })),
            };

            const token = localStorage.getItem('token');

            const response = await axios.put(`http://localhost:8080/api/workouts/update/${workoutId}`, workoutDTO, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.status === 200 || response.status === 204) {
                setMessage('Workout updated successfully');
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            } else {
                console.error('Failed to update workout');
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-4">
              {/* Success Message */}
              {message && <div className="alert alert-success">{message}</div>}
        
              {/* Workout Header */}
              <div className="card p-3 shadow">
                <div className="d-flex justify-content-between align-items-center">
                  <h3 className="text-primary">Edit Workout</h3>
                  <button className="btn btn-success" onClick={updateWorkout}>Save</button>
                </div>
              </div>
        
              {/* Workout Edit Section */}
              <div className="card mt-3 p-4 shadow">
                <ExerciseSearch addWorkoutExercise={addWorkoutExercise} />
        
                {/* Selected Exercises */}
                <div className="mt-4">
                  <h5>Selected Exercises</h5>
                  <ul className="list-group">
                    {workoutExercises.map((we, index) => (
                      <li className="list-group-item" key={index}>
                        {/* Exercise Name & Remove Button */}
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="mb-0">{we.exerciseDetails?.name || "No name"}</h6>
                          <button className="btn btn-danger btn-sm" onClick={() => removeExercise(index)}>
                            <IoIosRemoveCircle />
                          </button>
                        </div>
                    
                        {/* Add Sets */}
                        <AddSet
                          addSet={(newSet) => addSetToExercise(index, newSet)}
                          exerciseType={we.exerciseDetails?.type || "Unknown"}
                        />

                        {/* Display Sets in a Table */}
                        {we.sets.length > 0 && (
                          <table className="table table-sm table-bordered mt-2">
                            <thead className="table-light">
                              <tr>
                                <th>{we.exerciseDetails?.type === "DYNAMIC" ? "Reps" : "Duration"}</th>
                                <th>Weight (kg)</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {we.sets.map((set, setIndex) => (
                                <tr key={setIndex}>
                                  <td>
                                    {we.exerciseDetails?.type === "DYNAMIC" ? set.reps || 0 :
                                      formatDuration(parseISO8601Duration(set.duration || "PT0S"))}
                                  </td>
                                  <td>{set.weight || 0} kg</td>
                                  <td>
                                    <button className="btn btn-outline-danger btn-sm" onClick={() => removeSetFromExercise(index, setIndex)}>
                                      <IoIosRemoveCircle />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <Footer/>
        </div>
    );
};

export default EditWorkout;
