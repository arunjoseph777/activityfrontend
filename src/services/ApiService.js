import axios from "axios";

export default class ApiService {
  static BASE_URL = "http://localhost:8080";

  static getHeader() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  static async registerUser(registration) {
    const response = await axios.post(
      `${this.BASE_URL}/api/users/register`,
      registration
    );
    return response.data;
  }

  static async loginUser(loginDetails) {
    const response = await axios.post(
      `${this.BASE_URL}/api/users/login`,
      loginDetails
    );
    localStorage.setItem('token', response.data.token)
    return response.data;
  }

  static logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }

  static isAuthenticated() {
    const token = localStorage.getItem("token");
    return !!token;
  }

  static isAdmin() {
    const role = localStorage.getItem("role");
    return role === "ADMIN";
  }

  static isUser() {
    const role = localStorage.getItem("role");
    return role === "USER";
  }

  //   User Services

  static async getUser(userId) {
    const response = await axios.get(`${this.BASE_URL}/api/users/${userId}`, {
      headers: this.getHeader,
    });
    return response.data;
  }

  static async getLoggedInUser() {
    const response = await axios.get(`${this.BASE_URL}/api/users/logged-in-user`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getWorkoutHistory(userId) {
    const response = await axios.get(`${this.BASE_URL}/api/users/${userId}/workouts`, {
      headers: this.getHeader(),
    });
    return response.data;
}

static async updateUser(userId, updatedUserDetails) {
  const response = await axios.put(`${this.BASE_URL}/api/users/${userId}`, updatedUserDetails, {
    headers: this.getHeader(),
  });
  return response.data;
}
static async deleteUser(userId) {
  const response = await axios.delete(`${this.BASE_URL}/api/users/${userId}`, {
      headers: this.getHeader(),
  });
  return response.data;
}




  //Get Workout

  static async getExerciseDetailsById(exerciseDetailsId) {
    const response = await axios.get(`${this.BASE_URL}/api/exercise-details/${exerciseDetailsId}`, {
      headers: this.getHeader(),
    });
    return response.data;
  }
  static async deleteWorkout(workoutId) {
    const response = await axios.delete(`${this.BASE_URL}/api/workouts/${workoutId}`, {
        headers: this.getHeader(),
    });
    return response.data;
}

  static async getExerciseDetails(exerciseDetailsId) {
    const response = await axios.get(`${this.BASE_URL}/api/exercise-details/${exerciseDetailsId}`, {
        headers: this.getHeader(),
    });
    return response.data;
}

static async getAllExercises() {
  const response = await axios.get(`${this.BASE_URL}/api/exercise-details`, {
      headers: this.getHeader(),
  });
  return response.data;
}

static async deleteExercise(exerciseId) {
  const response = await axios.delete(`${this.BASE_URL}/api/exercise-details/${exerciseId}`, {
      headers: this.getHeader(),
  });
  return response.data;
}
static async addExercise(exercise) {
  const response = await axios.post(`${this.BASE_URL}/api/exercise-details`, exercise, {
      headers: this.getHeader(),
  });
  return response.data;
}

static async getExerciseById(exerciseId) {
  const response = await axios.get(`${this.BASE_URL}/api/exercise-details/${exerciseId}`, {
      headers: this.getHeader(),
  });
  return response.data;
}

static async updateExercise(exerciseId, updatedExercise) {
  const response = await axios.put(`${this.BASE_URL}/api/exercise-details/${exerciseId}`, updatedExercise, {
      headers: this.getHeader(),
  });
  return response.data;
}

static async getWorkoutsByUserAndExercise(userId, exerciseDetailsId) {
  const response = await axios.get(`${this.BASE_URL}/api/workouts/user/${userId}/exercise/${exerciseDetailsId}`, {
      headers: this.getHeader(),
  });
  return response.data;
}

static async getWorkoutHistoryWithNames(userId) {
  try {
    const response = await axios.get(`${this.BASE_URL}/api/workouts/users/${userId}/history-with-names`, {
      headers: this.getHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching workout history with names:', error);
    throw error;
  }
}



}
