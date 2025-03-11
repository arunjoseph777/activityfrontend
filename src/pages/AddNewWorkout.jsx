import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const AddNewWorkout = () => {
    const [workoutExercises, setWorkoutExercises] = useState([]);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

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

    const saveWorkout = async () => {
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

            const response = await axios.post('http://localhost:8080/api/workouts', workoutDTO, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.status === 200 || response.status === 201) {
                setMessage('Workout added successfully');
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            } else {
                console.error('Failed to save workout');
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <div>
            <Navbar/>
            <div className="container-fluid min-vh-100">
                {message && <div className="alert alert-success text-center">{message}</div>}
    
                <div className="container mt-4">
                    <div className="row justify-content-between align-items-center mb-3">
                        <div className="col-auto">
                            <h1 className="text-primary">+ New Workout</h1>
                        </div>
                        <div className="col-auto">
                        <button className="btn btn-success" onClick={saveWorkout}>Done</button>
                        </div>
                    </div>
        
                    <div className="card p-3 shadow">
                        <ExerciseSearch addWorkoutExercise={addWorkoutExercise} />
        
                        <div className="mt-4">
                            <h3 className="text-secondary">Selected Exercises</h3>
        
                            {workoutExercises.length === 0 ? (
                            <p className="text-muted">No exercises selected yet.</p>
                                ) : (
                            <ul className="list-group">
                                {workoutExercises.map((we, index) => (
                                <li className="list-group-item" key={index}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0">{we.exerciseDetails.name}</h5>
                                        <button
                                        className="btn btn-outline-danger btn-sm"
                                        title="Remove Exercise"
                                        onClick={() => removeExercise(index)}
                                        >
                                        <IoIosRemoveCircle />
                                        </button>
                                    </div>
                        
                                    <AddSet
                                      addSet={(newSet) => addSetToExercise(index, newSet)}
                                      exerciseType={we.exerciseDetails.type}
                                    />

                                    <ul className="list-group mt-2">
                                      {we.sets.map((set, setIndex) => (
                                        <li className="list-group-item d-flex justify-content-between align-items-center" key={setIndex}>
                                          <span>
                                            {we.exerciseDetails.type === "DYNAMIC" && `${set.reps} reps x `}
                                            {we.exerciseDetails.type === "STATIC" && `${formatDuration(parseISO8601Duration(set.duration))} x `}
                                            {`${set.weight} kg`}
                                          </span>
                                          <button
                                            className="btn btn-outline-danger btn-sm"
                                            title="Remove Set"
                                            onClick={() => removeSetFromExercise(index, setIndex)}
                                          >
                                            <IoIosRemoveCircle />
                                          </button>
                                        </li>
                                      ))}
                                    </ul>
                                </li>
                            ))}
                            </ul>
                        )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
      );
};

export default AddNewWorkout;
