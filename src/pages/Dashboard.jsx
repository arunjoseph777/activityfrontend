import Navbar from '../components/Navbar.jsx';
import ApiService from '../services/ApiService';
import { useState, useEffect } from 'react';
import ExercisePieChart from '../components/ExercisePieChart';
import BarChart from '../components/BarChart.jsx';
import TopExerciseLineChart from '../components/TopExerciseLineChart';
import Footer from './Footer.jsx';                                      

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserAndWorkoutHistory = async () => {
      try {
        const response = await ApiService.getLoggedInUser();
        setUser(response.user);

        const workoutResponse = await ApiService.getWorkoutHistory(response.user.id);
        setWorkoutHistory(workoutResponse.workoutList || []);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      }
    };

    fetchUserAndWorkoutHistory();
  }, []);

  return (
    <div>
      <Navbar/>
      <div className="container-fluid min-vh-100">
        <div className="row">
          {/* Main content */}
          <main className="col-md-9 sm-auto col-lg-10 px-md-4 py-4">
            <h1 className="fw-bold">
              Hello, {user ? user.name : "User"}
            </h1>

            {workoutHistory.length > 0 ? (
              <div className="row g-4 mt-3">
                <div className="col-lg-4 col-md-6">
                  <div className="card shadow p-3">
                    <ExercisePieChart />
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="card shadow p-3">
                    <BarChart />
                  </div>
                </div>
                <div className="col-lg-4 col-md-12">
                  <div className="card shadow p-3">
                    <TopExerciseLineChart />
                  </div>
                </div>
              </div>
            ) : (
              <div className="alert alert-info text-center mt-4">
                <h2>Start Tracking your Trak progress now!</h2>
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Dashboard;
