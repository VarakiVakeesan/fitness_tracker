import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './FitnessTracker.css';

const FitnessTracker = () => {
  const [date, setDate] = useState('');
  const [workoutName, setWorkoutName] = useState('');
  const [duration, setDuration] = useState('');
  const [workouts, setWorkouts] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState(null);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get('http://localhost:8082/workout/get-workouts');
      setWorkouts(response.data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  };

  const handleAddWorkout = async () => {
    if (!date || !workoutName || !duration) {
      alert('Please fill in all fields');
      return;
    }

    const newWorkout = {
      date,
      workoutName,
      duration,
    };

    try {
      await axios.post('http://localhost:8082/workout/create-workout', newWorkout);
      fetchWorkouts();
      setDate('');
      setWorkoutName('');
      setDuration('');
    } catch (error) {
      console.error('Error adding workout:', error);
    }
  };

  const handleEditWorkout = async () => {
    const updatedWorkout = {
      date: currentWorkout.date,
      workoutName: currentWorkout.workoutName,
      duration: currentWorkout.duration,
    };

    try {
      await axios.put(`http://localhost:8082/workout/update-workout/${currentWorkout.workoutId}`, updatedWorkout);
      fetchWorkouts();
      closeEditModal();
    } catch (error) {
      console.error('Error updating workout:', error);
    }
  };

  const handleDeleteWorkout = async () => {
    try {
      await axios.delete(`http://localhost:8082/workout/delete-workout/${currentWorkout.workoutId}`);
      fetchWorkouts();
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  const openEditModal = (workout) => {
    setCurrentWorkout(workout);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setCurrentWorkout(null);
    setIsEditModalOpen(false);
  };

  const openDeleteModal = (workout) => {
    setCurrentWorkout(workout);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setCurrentWorkout(null);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="fitness-tracker">
      <h1>Fitness Tracker</h1>
      <div className="input-form">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="Date"
        />
        <input
          type="text"
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
          placeholder="Workout Type"
        />
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Duration (in hours)"
        />
        <button onClick={handleAddWorkout}>Add Workout</button>
      </div>
      <div className="workout-list">
        {workouts.map((workout) => (
          <div key={workout.workoutId} className="workout-card">
            <p>Date: {workout.date}</p>
            <p>Workout: {workout.workoutName}</p>
            <p>Duration: {workout.duration}</p>
            <div className="workout-actions">
              <button onClick={() => openEditModal(workout)}>Edit</button>
              <button onClick={() => openDeleteModal(workout)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Workout Modal */}
      {isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onRequestClose={closeEditModal}
          contentLabel="Edit Workout"
          ariaHideApp={false}
        >
          <h2>Edit Workout</h2>
          <form>
            <input
              type="date"
              value={currentWorkout.date}
              onChange={(e) => setCurrentWorkout({ ...currentWorkout, date: e.target.value })}
            />
            <input
              type="text"
              value={currentWorkout.workoutName}
              onChange={(e) => setCurrentWorkout({ ...currentWorkout, workoutName: e.target.value })}
            />
            <input
              type="number"
              value={currentWorkout.duration}
              onChange={(e) => setCurrentWorkout({ ...currentWorkout, duration: e.target.value })}
            />
            <button type="button" onClick={handleEditWorkout}>Update Workout</button>
            <button type="button" onClick={closeEditModal}>Cancel</button>
          </form>
        </Modal>
      )}

      {/* Delete Workout Modal */}
      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onRequestClose={closeDeleteModal}
          contentLabel="Delete Workout"
          ariaHideApp={false}
        >
          <h2>Are you sure you want to delete?</h2>
          <button onClick={handleDeleteWorkout}>Yes</button>
          <button onClick={closeDeleteModal}>No</button>
        </Modal>
      )}
    </div>
  );
};

export default FitnessTracker;
