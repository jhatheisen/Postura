import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import { thunkEditTask } from "../../store/tasks";
import "./EditTaskForm.css"

function EditTaskFormModal({task}) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description);

  const tasks = useSelector(state => state.tasks.projectTasks)

  let date = task.due_date
  // add 8 hours
  date = new Date(date)
  date.setHours(date.getHours()+8)
  // format date
  let year = date.getFullYear()
  let month = ('0'+ (date.getMonth()+1)).slice(-2)
  let day = ('0'+ date.getDate()).slice(-2)
  date = `${year}-${month}-${day}`
  // set date
  const [dueDate, setDueDate] = useState(date);
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const editedTask = {}
    if (name) editedTask.name = name;
    if (description) editedTask.description = description;
    if (dueDate) editedTask.due_date = dueDate;

    const data = await dispatch(thunkEditTask(editedTask, task.id));

    if (data.errors) {
      setErrors(data.errors);
    } else {
        closeModal()
    }
  };

  return (
    <div className="editTaskBox">
      <h1>Edit Task</h1>
      <form onSubmit={handleSubmit} className="editTaskForm">
        <ul>
          {errors.map((error, idx) => (
            <li key={idx} className="errorText">{error}</li>
          ))}
        </ul>
        <div>
          <label for="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            maxLength={25}
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label for="description">
            Description (optional)
          </label>
          <textarea
            type="textarea"
            id="description"
            value={description}
            placeholder="Description"
            maxLength={250}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label for="dueDate">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <button type="submit" className="cleanButton">Submit</button>
      </form>
    </div>
  );
}

export default EditTaskFormModal;
