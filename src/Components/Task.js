import EditTask from "./EditTask";
import {useState} from "react";
import Coopernet from "../Services/Coopernet";

const Task = (props) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const handleCloseEditModal = () => setShowEditModal(false);
  const handleShowEditModal = () => setShowEditModal(true);

  const handleSubmitTask = (e) => {
    e.preventDefault();
    handleCloseEditModal();
    const label = document.getElementById("label").value;
    const description = document.getElementById("description").value;
    const ended = document.getElementById("ended").value;
    const newTask = {
      id: props.task.id,
      label: label,
      description: description,
      ended: ended,
      isValidate: props.task.isValidate,
    };
    const update_tasks = props.tasks.map((task) => {
      if (task.id == props.task.id) {
        return newTask;
      }
      return task;
    });
    try {
      Coopernet.updateTask(newTask, props.task.order);
      props.setTasks(update_tasks);
    } catch (e) {
      console.log("Erreur lors de la modification sur le serveur : ", e);
    }
  };

  return (
      <>
        <EditTask
            showEditModal={showEditModal}
            handleCloseEditModal={handleCloseEditModal}
            handleSubmitTask={handleSubmitTask}
            handleShowEditModal={handleShowEditModal}
            task={props.task}
        />
        <section
            className="d-flex justify-content-between align-items-center mt-3 border">
          <h2
              className={
                parseInt(props.task.isValidate)
                    ? "text-decoration-line-through"
                    : ""
              }
          >
            {props.task.label}
          </h2>
          <p
              className={
                parseInt(props.task.isValidate)
                    ? "text-decoration-line-through"
                    : ""
              }
          >
            {props.task.description}
          </p>
          <p
              className={
                parseInt(props.task.isValidate)
                    ? "text-decoration-line-through"
                    : ""
              }
          >
            {props.task.ended}
          </p>
          <div>
            <button
                onClick={(event) => {
                  props.handleClickValidateTask(props.task.id);
                }}
                className={
                  parseInt(props.task.isValidate)
                      ? "text-decoration-line-through btn btn-success me-3"
                      : "btn btn-success me-3"
                }
            >
              {parseInt(props.task.isValidate) ? "Invalider" : "Valider"}
            </button>
            <button
                onClick={() => {
                  handleShowEditModal();
                }}
                className={
                  parseInt(props.task.isValidate)
                      ? "text-decoration-line-through btn btn-primary me-3"
                      : "btn btn-primary me-3"
                }
            >
              Mettre à jour
            </button>
            <button
                onClick={() => {
                  props.handleClickDeleteTask(props.task.id);
                }}
                className={
                  parseInt(props.task.isValidate)
                      ? "text-decoration-line-through btn btn-danger"
                      : "btn btn-danger"
                }
            >
              Supprimer
            </button>
          </div>
        </section>
      </>
  );
};

export default Task;
