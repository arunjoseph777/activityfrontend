import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ApiService from '../services/ApiService';
import Navbar from '../components/Navbar';
import { FaChevronLeft, FaEye } from "react-icons/fa";
import { MdDeleteForever, MdModeEditOutline } from "react-icons/md";
import { FaChevronRight } from "react-icons/fa";
import Footer from './Footer';


const ITEMS_PER_PAGE = 12; // Number of items per page

const AllExercises = () => {
    const [exercises, setExercises] = useState([]);
    const [filteredExercises, setFilteredExercises] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('name-asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const data = await ApiService.getAllExercises();
                setExercises(data.exerciseDetailsList);
                setFilteredExercises(data.exerciseDetailsList);
                setTotalPages(Math.ceil(data.exerciseDetailsList.length / ITEMS_PER_PAGE));
            } catch (error) {
                console.error('Error fetching exercises', error);
            }
        };

        fetchExercises();
    }, []);

    useEffect(() => {
        handleFilter();
    }, [searchTerm, sortOption]);

    useEffect(() => {
        // Update total pages when filteredExercises changes
        setTotalPages(Math.ceil(filteredExercises.length / ITEMS_PER_PAGE));
    }, [filteredExercises]);

    const handleFilter = () => {
        let filtered = exercises.filter((exercise) =>
            exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        switch (sortOption) {
            case 'name-asc':
                filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filtered = filtered.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'difficulty-asc':
                filtered = filtered.sort((a, b) => a.difficulty - b.difficulty);
                break;
            case 'difficulty-desc':
                filtered = filtered.sort((a, b) => b.difficulty - a.difficulty);
                break;
            default:
                break;
        }

        setFilteredExercises(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    };

    const handleDelete = async (exerciseId) => {
        if (window.confirm('Are you sure you want to delete this exercise?')) {
            try {
                await ApiService.deleteExercise(exerciseId);
                setFilteredExercises(filteredExercises.filter((exercise) => exercise.id !== exerciseId));
                setTotalPages(Math.ceil(filteredExercises.length / ITEMS_PER_PAGE));
            } catch (error) {
                console.error('Error deleting exercise', error);
            }
        }
    };

    const paginatedExercises = filteredExercises.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div>
            <Navbar />
            <div className="container-fluid">
                <div className="container mt-4">
                    <div className="row mb-3">
                        <div className="col text-center">
                            <h1 className="text-primary">All Exercises</h1>
                        </div>
                    </div>
    
                    {/* Search and Sort Filter */}
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <input
                              type="text"
                              placeholder="Search exercises..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="form-control"
                            />
                        </div>
                        <div className="col-md-6">
                            <select
                              value={sortOption}
                              onChange={(e) => setSortOption(e.target.value)}
                              className="form-select"
                            >
                              <option value="name-asc">Name (A-Z)</option>
                              <option value="name-desc">Name (Z-A)</option>
                              <option value="difficulty-asc">Difficulty (Low to High)</option>
                              <option value="difficulty-desc">Difficulty (High to Low)</option>
                            </select>
                        </div>
                    </div>
    
                    {/* Exercise Cards */}
                    <div className="row">
                      {paginatedExercises.map((exercise) => (
                        <div key={exercise.id} className="col-md-4 mb-4">
                          <div className="card shadow">
                            <div className="card-body">
                              <h4 className="card-title">{exercise.name}</h4>
                              <p className="card-text">{exercise.description}</p>
                              <h5>
                                <span className="text-muted">Difficulty Level: </span>
                                {exercise.difficulty}
                              </h5>
                              <div className="d-flex justify-content-between mt-3">
                                <Link to={`/exercise/${exercise.id}`} className="btn btn-primary">
                                  <FaEye /> View
                                </Link>
                                {ApiService.isAdmin() && (
                                  <div>
                                    <button
                                      className="btn btn-warning me-2"
                                      onClick={() => navigate(`/exercise/edit-exercise/${exercise.id}`)}
                                    >
                                      <MdModeEditOutline /> Edit
                                    </button>
                                    <button
                                      className="btn btn-danger"
                                      onClick={() => handleDelete(exercise.id)}
                                    >
                                      <MdDeleteForever /> Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  
                    {/* Pagination */}
                    <nav>
                      <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          >
                            <FaChevronLeft />
                          </button>
                        </li>
                        <li className="page-item disabled mt-2">
                          <span className="page-link">
                            Page {currentPage} of {totalPages}
                          </span>
                        </li>
                        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          >
                            <FaChevronRight />
                          </button>
                        </li>
                      </ul>
                    </nav>
                </div>
            </div>
            <Footer/>
        </div>
      );
};

export default AllExercises;
