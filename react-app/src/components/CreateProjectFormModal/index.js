import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import { thunkCreateProject } from "../../store/project";
import "./CreateProjectForm.css"

function CreateProjectFormModal() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newProject = {}
    if (name) newProject.name = name;
    if (description) newProject.description = description;
    if (dueDate) newProject.due_date = dueDate;

    const data = await dispatch(thunkCreateProject(newProject));

    if (data.errors) {
      setErrors(data.errors);
    } else {
        closeModal()
    }
  };

  return (
    <div className="createProjectBox">
      <h1>Create Project</h1>
      <form onSubmit={handleSubmit} className="createProjectForm">
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
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

export default CreateProjectFormModal;
