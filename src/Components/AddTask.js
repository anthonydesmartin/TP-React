import {Button, Modal} from 'react-bootstrap';

const AddTask = (props) => {
  return (
      <>
        <button className="btn btn-primary" onClick={props.handleShowAddModal}>Ajouter une tâche</button>

        <Modal
            show={props.showAddModal}
            onHide={props.handleCloseAddModal}
            backdrop="static"
            keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Ajouter une tâche</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form id="form_add_task" onSubmit={props.handleSubmitTask}>
              <label htmlFor="label">Nom:</label>
              <br/>
              <input id="label" type="text" placeholder="Nom de la tâche"/>
              <br/>
              <label htmlFor="description">Description:</label>
              <br/>
              <textarea name="description" id="description"></textarea>
              <br/>
              <label htmlFor="ended">Date de fin:</label>
              <br/>
              <input id="ended" type="date"/>
              <br/>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={props.handleCloseAddModal}>
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

export default AddTask;