import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Register from "./pages/Register";
import AddNewWorkout from "./pages/AddNewWorkout";
import EditWorkout from "./pages/EditWorkout";
import WorkoutHistoryPage from "./pages/WorkoutHistoryPage";
import MyProfile from "./pages/MyProfile";
import EditProfile from "./pages/EditProfile";
import AllExercises from "./pages/AllExercises";
import AddNewExercise from "./pages/AddNewExercise";
import EditExercise from "./pages/EditExercise";
import ExerciseDetail from "./pages/ExerciseDetail";
import AccessDenied from "./pages/AccessDenied"; 
import { ProtectedRoute, AdminRoute } from "./services/GuardService";
import ApiService from "./services/ApiService";

function App() {
  const isLoggedIn = ApiService.isAuthenticated();

  return (
    <BrowserRouter>
      <Routes>

        {/* Root Route */}
        <Route 
          path="/" 
          element={<Navigate to={isLoggedIn ? "/dashboard" : "/home"} />} 
        />

        {/* Public Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />

        {/* USER Routes */}
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/add-new-workout" element={ <ProtectedRoute element={ <AddNewWorkout />} />} />
        <Route path="/edit-workout/:workoutId" element={ <ProtectedRoute element={ <EditWorkout />} />} />
        <Route path="/workout-history" element={ <ProtectedRoute element={ <WorkoutHistoryPage />} />} />
        <Route path="/my-profile" element={ <ProtectedRoute element={ <MyProfile />} />} />
        <Route path="/edit-profile" element={ <ProtectedRoute element={ <EditProfile />} />} />
        <Route path="/exercises" element={ <ProtectedRoute element={ <AllExercises />} />} />
        <Route path="/exercise/:exerciseDetailsId" element={ <ProtectedRoute element={ <ExerciseDetail />} />} />

        {/* ADMIN Routes */}
        <Route path="/add-new-exercise" element={ <AdminRoute element={ <AddNewExercise />} />} />
        <Route path="/exercise/edit-exercise/:id" element={ <AdminRoute element={ <EditExercise />} />} />

        {/* Access Denied Route */}
        <Route path="/access-denied" element={<AccessDenied />} />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to='/home'/>}/>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;