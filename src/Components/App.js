import Coopernet from "../Services/Coopernet";
import {useEffect, useRef, useState} from "react";
import Task from "./Task";
import AddTask from './AddTask';
import EditTask from './EditTask';

function App() {
  const firstUpdate = useRef(true);

  // Déclare une nouvelle variable d'état, que l'on va appeler « count »
  // useState renvoie un tableau. Le premier élément de ce dernier est un état et le deuxième élément est une référence vers la fonction qui permet de modifier cet état.
  const [tasks, setTasks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const handleCloseAddModal = () => setShowAddModal(false);
  const handleShowAddModal = () => setShowAddModal(true);




  // Equivalent du componentDidMount si le deuxième paramètre de useEffect est []
  useEffect(() => {
    const testLocalStorageToken = async () => {
      try {
        if (await Coopernet.getStorage()) {
          console.log(
              "Je suis dans le cas où mon local storage me permet de" +
              " me connecter!"
          );
        } else {
          // Je modifie le login et le mot de passe
          // Il faudra faire en sorte d'appeler ici le component de formulaire
          // de login
          Coopernet.setUsername("desmartin.anthony");
          Coopernet.setPassword("desmartin.anthony");
          await Coopernet.setOAuthToken();
          // Si le code est exécuté, c'est que je suis bien connecté
          console.log(
              "Je suis maintenant bien connecté au server de" + " Coopernet"
          );
        }
        // Récupération des tâches
        const server_tasks = await Coopernet.getTasks();
        console.log("tasks récupérées sur le server: ", server_tasks);
        setTasks(server_tasks);
      } catch (e) {
        // Ici, il faudrait afficher dans l'interface qu'il y a eu une
        // erreur d'identification et donner un email de l'administrateur
        // par exemple
        console.log("Erreur: ", e);
      }
    };
    testLocalStorageToken();
  }, []);

  /**
   * Gère le click sur le bouton supprimer
   * Utilisation de la méthode filter : si l'index de la tâche cliquée correspond à l'index de la tâche, cette dernière ne passe pas le filtre
   * Appel du mutateur de l'état tasks "setTasks"
   * @param {Number} id
   */
  const handleClickDeleteTask = (id) => {
    console.log(`Dans handleClickDeleteTask`);
    setTasks(tasks.filter((task) => task.id !== id));
    Coopernet.deleteTask(id);
    console.log(tasks);
  };
  const handleClickValidateTask = (id) => {
    console.log(`Dans handleClickValidateTask`);
    setTasks(
        tasks.map((task) => {
          if (task.id === id) task.isValidate = !task.isValidate;
          return task;
        })
    );
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    handleCloseAddModal();
    const label = document.getElementById("label").value;
    const description = document.getElementById("description").value;
    const ended = document.getElementById("ended").value;
    const newTask = {
      label: label,
      description: description,
      ended: ended,
    }
    try {
      const id = await Coopernet.addTask(newTask, tasks.length)
      newTask.id = id.id;
      setTasks([...tasks, newTask]);
    } catch (e) {
      console.log('Erreur lors de l\'ajout au serveur : ', e);
    }
  };
  return (
      <div className="App container">
        <AddTask showAddModal={showAddModal} handleCloseAddModal={handleCloseAddModal} handleSubmitTask={handleSubmitTask} handleShowAddModal={handleShowAddModal}/>
        <h1>Liste des tâches</h1>
        <div className="fw-bold">
          <h2>Tâches en cours</h2>
          {tasks
              .filter((task) => !task.isValidate)
              .map((task) => (
                  <Task
                      task={task}
                      tasks={tasks}
                      setTasks={setTasks}
                      key={task.id}
                      handleClickDeleteTask={handleClickDeleteTask}
                      handleClickValidateTask={handleClickValidateTask}
                  />
              ))}
        </div>
        <div className="fw-bold mt-5">
          <h2>Tâches validées</h2>
          {tasks
              .filter((task) => task.isValidate)
              .map((task) => (
                  <Task
                      task={task}
                      key={task.id}
                      handleClickDeleteTask={handleClickDeleteTask}
                      handleClickValidateTask={handleClickValidateTask}
                  />
              ))}
        </div>
      </div>
  );
}

export default App;
