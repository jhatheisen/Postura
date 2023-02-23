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

    // get date
    const firstDash = dueDate.indexOf('-')
    const year = dueDate.slice(0, firstDash)
    const secondDash = dueDate.indexOf('-', firstDash + 1);
    const month = dueDate.slice(firstDash + 1, secondDash);
    const day = dueDate.slice(secondDash + 1)

    const newProject = {}
    if (name) newProject.name = name;
    if (description) newProject.description = description;
    if (dueDate) newProject.due_date = `${month}-${day}-${year}`;

    console.log('new Project:', newProject)

    const data = await dispatch(thunkCreateProject(newProject));

    console.log('data:', data)

    if (data.errors) {
      setErrors(data.errors);
    } else {
        closeModal()
    }
  };

  return (
    <>
      <h1>Create Project</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Description
          <textarea
            type="textarea"
            value={description}
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
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default CreateProjectFormModal;
