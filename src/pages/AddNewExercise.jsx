import React, { useState } from 'react';
import ApiService from '../services/ApiService';
import Navbar from '../components/Navbar';
import Footer from './Footer';

const AddNewExercise = () => {
    const [name, setName] = useState('');
    const [type, setType] = useState('DYNAMIC'); // Default value
    const [description, setDescription] = useState('');
    const [difficulty, setDifficulty] = useState('1'); // Default value

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newExercise = { name, type, description, difficulty: parseInt(difficulty, 10) }; // Convert difficulty to number
            const response = await ApiService.addExercise(newExercise);
            alert('Exercise added successfully!');
            // Reset form or navigate to another page if needed
            setName('');
            setType('DYNAMIC'); // Reset to default value
            setDescription('');
            setDifficulty('1'); // Reset to default value
        } catch (error) {
            console.error('Error adding exercise:', error);
            alert('Failed to add exercise');
        }
    };

    return (
        <div className="add-exercise">
          <Navbar />
          <div className="container mt-4">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="card shadow-sm border-0 p-3 rounded">
                  <h2 className="text-center text-primary">Add New Exercise</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="exerciseName" className="form-label">
                        Name:
                      </label>
                      <input
                        type="text"
                        id="exerciseName"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
    
                    <fieldset className="mb-3">
                      <legend className="form-label">Type:</legend>
                      <div className="form-check">
                        <input
                          type="radio"
                          id="dynamicType"
                          value="DYNAMIC"
                          checked={type === "DYNAMIC"}
                          onChange={(e) => setType(e.target.value)}
                          className="form-check-input"
                        />
                        <label htmlFor="dynamicType" className="form-check-label">
                          DYNAMIC
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          type="radio"
                          id="staticType"
                          value="STATIC"
                          checked={type === "STATIC"}
                          onChange={(e) => setType(e.target.value)}
                          className="form-check-input"
                        />
                        <label htmlFor="staticType" className="form-check-label">
                          STATIC
                        </label>
                      </div>
                    </fieldset>
    
                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">
                        Description:
                      </label>
                      <textarea
                        id="description"
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </div>
    
                    <div className="mb-3">
                      <label htmlFor="difficulty" className="form-label">
                        Difficulty:
                      </label>
                      <select
                        id="difficulty"
                        className="form-select"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        required
                      >
                        {[...Array(10).keys()].map((i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
    
                    <button type="submit" className="btn btn-primary w-100">
                      Add Exercise
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <Footer/>
        </div>
      );
};

export default AddNewExercise;
