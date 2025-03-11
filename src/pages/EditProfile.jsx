import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ApiService from '../services/ApiService';
import Navbar from '../components/Navbar';
import Footer from './Footer';

const EditProfile = () => {
    const [user, setUser] = useState({
        id: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        age: '',
        height: '',
        weight: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the logged-in user data
        const fetchUser = async () => {
            try {
                const loggedInUser = await ApiService.getLoggedInUser();
                setUser({
                    id: loggedInUser.user.id || '',
                    name: loggedInUser.user.name || '',
                    email: loggedInUser.user.email || '',
                    password: '', // Leave password fields empty
                    confirmPassword: '',
                    age: loggedInUser.user.age || '',
                    height: loggedInUser.user.height || '',
                    weight: loggedInUser.user.weight || ''
                });
            } catch (error) {
                setErrorMessage('Error fetching user data');
            }
        };

        fetchUser();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // If password fields are empty, exclude password from the update
        let updatedUser = {
            name: user.name,
            email: user.email,
            age: user.age,
            height: user.height,
            weight: user.weight,
        };

        if (user.password) {
            if (user.password !== user.confirmPassword) {
                setErrorMessage("Passwords do not match");
                return;
            }
            updatedUser.password = user.password;
        }

        try {
            const response = await ApiService.updateUser(user.id, updatedUser);

            if (response.statusCode === 200) {
                setSuccessMessage('Profile updated successfully');
                setTimeout(() => navigate('/my-profile'), 2000);
            } else {
                setErrorMessage(response.message);
            }
        } catch (error) {
            setErrorMessage('Error updating profile');
        }
    };

    const handleDelete = async () => {
        // Ask for user confirmation before deleting the profile
        const confirmDelete = window.confirm('Are you sure you want to delete your profile? This action cannot be undone.');
        
        if (confirmDelete) {
            try {
                const response = await ApiService.deleteUser(user.id);
                if (response.statusCode === 200) {
                    setSuccessMessage('Profile deleted successfully');
                    setTimeout(() => navigate('/home'), 2000);
                } else {
                    setErrorMessage(response.message);
                }
            } catch (error) {
                setErrorMessage('Error deleting profile');
            }
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container-fluid">
              <div className="container mt-4">
                <div className="row justify-content-center">
                  <div className="col-lg-6">
                    <h1 className="text-center text-primary mb-4">Edit Profile</h1>
        
                    {/* Error & Success Messages */}
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
        
                    <div className="card shadow">
                      <div className="card-body">
                        <form onSubmit={handleSubmit}>
                          {/* Name */}
                          <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input
                              type="text"
                              name="name"
                              value={user.name}
                              onChange={handleChange}
                              className="form-control"
                              required
                              placeholder="Preferred Name"
                            />
                          </div>
        
                          {/* Email */}
                          <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                              type="email"
                              name="email"
                              value={user.email}
                              onChange={handleChange}
                              className="form-control"
                              required
                              placeholder="Email"
                            />
                          </div>
        
                          {/* Password */}
                          <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                              type="password"
                              name="password"
                              value={user.password}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Enter new password"
                            />
                          </div>
        
                          {/* Confirm Password */}
                          <div className="mb-3">
                            <label className="form-label">Confirm Password</label>
                            <input
                              type="password"
                              name="confirmPassword"
                              value={user.confirmPassword}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Confirm new password"
                            />
                          </div>
        
                          {/* Age, Height, Weight - Grid Layout */}
                          <div className="row mb-3">
                            <div className="col-md-4">
                              <label className="form-label">Age (yr)</label>
                              <input
                                type="number"
                                name="age"
                                min="10"
                                value={user.age}
                                onChange={handleChange}
                                className="form-control"
                                required
                                placeholder="10"
                              />
                            </div>
                            <div className="col-md-4">
                              <label className="form-label">Height (cm)</label>
                              <input
                                type="number"
                                name="height"
                                min="100"
                                value={user.height}
                                onChange={handleChange}
                                className="form-control"
                                required
                                placeholder="100"
                              />
                            </div>
                            <div className="col-md-4">
                              <label className="form-label">Weight (kg)</label>
                              <input
                                type="number"
                                name="weight"
                                min="20"
                                value={user.weight}
                                onChange={handleChange}
                                className="form-control"
                                required
                                placeholder="20"
                              />
                            </div>
                          </div>
        
                          {/* Buttons */}
                          <div className="d-flex justify-content-between">
                            <button type="submit" className="btn btn-primary">
                              Update Profile
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={handleDelete}
                            >
                              Delete Profile
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Footer/>
        </div>
    );
};

export default EditProfile;
