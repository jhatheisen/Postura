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

    console.log('data:', data)

    if (data.errors) {
      setErrors(data.errors);
    } else {
        closeModal()
    }
  };

  return (
    <>
      <h1>Edit Task</h1>
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
        <button type="submit" className="cleanButton">Submit</button>
      </form>
    </>
  );
}

export default EditTaskFormModal;
