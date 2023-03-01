import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import { thunkCreateProject } from "../../store/project";
import { thunkCreateProjectTask } from "../../store/tasks";
import "./CreateTaskForm.css"

function CreateTaskFormModal({projectId}) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTask = {}
    if (name) newTask.name = name;
    if (description) newTask.description = description;
    if (dueDate) newTask.due_date = dueDate;

    const data = await dispatch(thunkCreateProjectTask(projectId, newTask));

    if (data.errors) {
      setErrors(data.errors);
    } else {
        closeModal()
    }
  };

  return (
    <div className="createTaskBox">
      <h1>Create Task</h1>
      <form onSubmit={handleSubmit} className="createTaskForm">
        <ul>
          {errors.map((error, idx) => (
            <li key={idx} className="errorText">{error}</li>
          ))}
        </ul>
        <label>

          <input
            type="text"
            value={name}
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>

          <textarea
            type="textarea"
            value={description}
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label>
          Due Date
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </label>
        <button type="submit" className="cleanButton">Submit</button>
      </form>
    </div>
  );
}

export default CreateTaskFormModal;
