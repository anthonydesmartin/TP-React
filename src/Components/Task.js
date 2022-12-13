import EditTask from './EditTask';
import {useState} from 'react';
import Coopernet from '../Services/Coopernet';

const Task = (props) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const handleCloseEditModal = () => setShowEditModal(false);
  const handleShowEditModal = () => setShowEditModal(true);

  const handleSubmitTask = (e) => {
    e.preventDefault();
    handleCloseEditModal();
    const label = document.getElementById('label').value;
    const description = document.getElementById('description').value;
    const ended = document.getElementById('ended').value;
    const copy_tasks = [...props.tasks].map(task => {
      if (task.id == props.task.id) {
        task.label;
      :
        label,
            task.description;
      :
        description,
            task.ended;
      :
        ended,
            task.isValidate;
      :
        props.task.isValidate,
      }
    });
    const newTask = {
      id: props.task.id,
      label: label,
      description: description,
      ended: ended,
      isValidate: props.task.isValidate,
    };
    try {
      Coopernet.updateTask(newTask, props.tasks.length);
      props.setTasks([copy_tasks]);
    } catch (e) {
      console.log('Erreur lors de la modification sur le serveur : ', e);
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
                props.task.isValidate ? 'text-decoration-line-through' : ''
              }
          >
            {props.task.label}
          </h2>
          <p>{props.task.description}</p>
          <p>{props.task.ended}</p>
          <div>
            <button
                onClick={(event) => {
                  props.handleClickValidateTask(props.task.id);
                }}
                className={
                  props.task.isValidate
                      ? 'text-decoration-line-through btn btn-success me-3'
                      : 'btn btn-success me-3'
                }
            >
              {props.task.isValidate ? 'Invalider' : 'Valider'}
            </button>
            <button
                onClick={() => {
                  handleShowEditModal();
                }}
                className={
                  props.task.isValidate
                      ? 'text-decoration-line-through btn btn-primary me-3'
                      : 'btn btn-primary me-3'
                }
            >
              Mettre à jour
            </button>
            <button
                onClick={() => {
                  props.handleClickDeleteTask(props.task.id);
                }}
                className={
                  props.task.isValidate
                      ? 'text-decoration-line-through btn btn-danger'
                      : 'btn btn-danger'
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
