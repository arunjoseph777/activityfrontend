import React, { useState, useEffect } from 'react';
import ApiService from '../services/ApiService';
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';
import Footer from './Footer';

const EditExercise = () => {
    const [name, setName] = useState('');
    const [type, setType] = useState('DYNAMIC'); // Default value
    const [description, setDescription] = useState('');
    const [difficulty, setDifficulty] = useState('1'); // Default value
    const [exerciseId, setExerciseId] = useState(null);
    const { id } = useParams(); // Get ID from URL

    useEffect(() => {
        const fetchExercise = async () => {
            try {
                const exerciseDetails = await ApiService.getExerciseById(id);
                const exercise = exerciseDetails.exerciseDetails
                console.log(exercise)
                setName(exercise.name);
                setType(exercise.type);
                setDescription(exercise.description);
                setDifficulty(exercise.difficulty.toString());
                setExerciseId(exercise.id);
            } catch (error) {
                console.error('Error fetching exercise:', error);
                alert('Failed to load exercise details');
            }
        };

        fetchExercise();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedExercise = { name, type, description, difficulty: parseInt(difficulty, 10) };
            await ApiService.updateExercise(exerciseId, updatedExercise);
            alert('Exercise updated successfully!');
            window.location.href = '/exercises';
        } catch (error) {
            console.error('Error updating exercise:', error);
            alert('Failed to update exercise');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this exercise?')) {
            try {
                await ApiService.deleteExercise(exerciseId);
                alert('Exercise deleted successfully!');
                window.location.href = '/exercise-list'; // Navigate to another page if needed
            } catch (error) {
                console.error('Error deleting exercise:', error);
                alert('Failed to delete exercise');
            }
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container-fluid">
                <div className="container mt-4">
                    <h2 className="text-center text-primary fw-bold">Edit Exercise</h2>

                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            <div className="card shadow p-4">
                                <form onSubmit={handleSubmit}>
                                    {/* Name Input */}
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {/* Type Selection */}
                                    <fieldset className="mb-3">
                                        <legend className="fw-bold">Type</legend>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                value="DYNAMIC"
                                                checked={type === 'DYNAMIC'}
                                                onChange={(e) => setType(e.target.value)}
                                            />
                                            <label className="form-check-label">DYNAMIC</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                value="STATIC"
                                                checked={type === 'STATIC'}
                                                onChange={(e) => setType(e.target.value)}
                                            />
                                            <label className="form-check-label">STATIC</label>
                                        </div>
                                    </fieldset>

                                    {/* Description */}
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Description</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {/* Difficulty Selection */}
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Difficulty</label>
                                        <select
                                            className="form-select"
                                            value={difficulty}
                                            onChange={(e) => setDifficulty(e.target.value)}
                                            required
                                        >
                                            {[...Array(10).keys()].map(i => (
                                                <option key={i + 1} value={i + 1}>
                                                    {i + 1}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Buttons */}
                                    <div className="d-flex justify-content-between">
                                        <button className="btn btn-primary" type="submit">
                                            Update Exercise
                                        </button>
                                        <button className="btn btn-danger" type="button" onClick={handleDelete}>
                                            Delete Exercise
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default EditExercise;
