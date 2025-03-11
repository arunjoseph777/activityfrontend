import { useState } from "react";
import ApiService from "../services/ApiService";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import '../style/Register.css'

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    age: "",
    height: "",
    weight: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const { username, email, password, age, height, weight } = formData;
    if (!username || !email || !password || !age || !height || !weight) {
      return false;
    }
    return true;
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setErrorMessage("Please fill all fields.");
      setTimeout((setErrorMessage(""), 5000));
      return;
    }


    try {
      const response = await ApiService.registerUser(formData);

      if (response.statusCode === 200) {
        setFormData({
          username: "",
          email: "",
          password: "",
          age: "",
          height: "",
          weight: "",
        });
        setSuccessMessage("Thanks for joining Trak.!");
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/login", {replace: true});
        }, 3000);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message);
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center reg-bg">
      <div className="card shadow p-4 w-50 my-5">
        <div className="text-center mb-4">
          <Link to="/home" className="text-decoration-none text-dark">
            <h1>Trak.</h1>
          </Link>
        </div>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input type="text" name="username" className="form-control" value={formData.username} onChange={handleInputChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-control" value={formData.email} onChange={handleInputChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-control" value={formData.password} onChange={handleInputChange} required />
          </div>
          <div className="row">
            <div className="col-md-4">
              <label className="form-label">Age (yr)</label>
              <input type="number" name="age" min="10" className="form-control" value={formData.age} onChange={handleInputChange} required />
            </div>
            <div className="col-md-4">
              <label className="form-label">Height (cm)</label>
              <input type="number" name="height" min="100" className="form-control" value={formData.height} onChange={handleInputChange} required />
            </div>
            <div className="col-md-4">
              <label className="form-label">Weight (kg)</label>
              <input type="number" name="weight" min="20" className="form-control" value={formData.weight} onChange={handleInputChange} required />
            </div>
          </div>
          <div className="mt-3 text-center">
            <button type="submit" className="btn btn-primary w-100">Sign Up</button>
          </div>
          <p className="text-center mt-3">Already registered? <Link to="/login">Login</Link> here.</p>
        </form>
      </div>
    </div>
  );
};
export default Register;
