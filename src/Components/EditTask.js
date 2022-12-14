import {Button, Modal} from 'react-bootstrap';

const EditTask = (props) => {
  return (
      <>
        <Modal
            show={props.showEditModal}
            onHide={props.handleCloseEditModal}
            backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>Ajouter une tâche</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form id="form_add_task" onSubmit={props.handleSubmitTask}>
              <label htmlFor="label">Nom:</label>
              <br/>
              <input id="label" type="text" placeholder="Nom de la tâche" defaultValue={props.task.label}/>
              <br/>
              <label htmlFor="description">Description:</label>
              <br/>
              <textarea name="description" id="description" defaultValue={props.task.description}></textarea>
              <br/>
              <label htmlFor="ended">Date de fin:</label>
              <br/>
              <input id="ended" type="date" defaultValue={props.task.ended}/>
              <br/>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={props.handleCloseEditModal}>
              Fermer
            </Button>
            <Button variant="primary" type="submit" form="form_add_task">
              Valider
            </Button>
          </Modal.Footer>
        </Modal>
      </>
  )
}

export default EditTask;