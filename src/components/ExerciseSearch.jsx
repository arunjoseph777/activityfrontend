import React, { useState } from 'react';
import axios from 'axios';

const ExerciseSearch = ({ addWorkoutExercise }) => {
    const [query, setQuery] = useState('');
    const [exerciseDetailsList, setExerciseDetailsList] = useState([]);

    const searchExercises = async (e) => {
        setQuery(e.target.value);
        if (e.target.value.length > 0) {
            const token = localStorage.getItem('token'); // or wherever you're storing the JWT token
            const response = await axios.get(`http://localhost:8080/api/exercise-details/search?query=${e.target.value}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setExerciseDetailsList(response.data.exerciseDetailsList);
        } else {
            setExerciseDetailsList([]);
        }
    };
    

    const selectExercise = (exerciseDetails) => {
        addWorkoutExercise(exerciseDetails);
        setExerciseDetailsList([]);
        setQuery('');
    };

    return (
        <div className="container mt-3">
          <div className="card shadow p-3">
            <h5 className="text-center text-primary">Search Exercise</h5>
            
            {/* Search Input */}
            <input
              type="text"
              value={query}
              onChange={searchExercises}
              placeholder="Search for an exercise"
              className="form-control"
            />
      
            {/* Search Results */}
            {exerciseDetailsList.length > 0 && (
              <ul className="list-group mt-2">
                {exerciseDetailsList.map((exercise) => (
                  <li
                    key={exercise.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                    onClick={() => selectExercise(exercise)}
                  >
                    {exercise.name}
                    <button className="btn btn-success btn-sm">+</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
    );      
};

export default ExerciseSearch;
