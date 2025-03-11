import React, { useState } from 'react';

const AddSet = ({ addSet, exerciseType }) => {
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');
    const [duration, setDuration] = useState('');

    const handleAddSet = () => {
        if (exerciseType === 'DYNAMIC' && reps && weight) {
            addSet({
                reps: parseInt(reps, 10),
                weight: parseFloat(weight),
            });
            setReps(''); 
            setWeight(''); 
        } else if (exerciseType === 'STATIC' && duration && weight) {
            addSet({
                duration: `PT${duration}S`,
                weight: parseFloat(weight),
            });
            setDuration(''); 
            setWeight('');
        } else {
            alert("Please fill out all required fields.");
        }
    };

    return (
        <div className="container mt-3">
          <div className="card shadow p-3">
            <h5 className="text-center text-primary">Add Set</h5>
            <div className="row g-2">
              {/* Dynamic Exercise: Reps */}
              {exerciseType === "DYNAMIC" && (
                <div className="col-md-4">
                  <input
                    type="number"
                    className="form-control"
                    min={1}
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    placeholder="Reps"
                  />
                </div>
              )}
      
              {/* Static Exercise: Duration */}
              {exerciseType === "STATIC" && (
                <div className="col-md-4">
                  <input
                    type="number"
                    className="form-control"
                    min={1}
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Hold (sec)"
                  />
                </div>
              )}
      
              {/* Weight Input */}
              <div className="col-md-4">
                <input
                  type="number"
                  className="form-control"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Weight (kg)"
                />
              </div>
            </div>
      
            {/* Add Set Button */}
            <div className="text-center mt-3">
              <button className="btn btn-primary" onClick={handleAddSet}>
                <span className="fw-bold">+</span> Add Set
              </button>
            </div>
          </div>
        </div>
    );      
};

export default AddSet;
