import Coopernet from "../Services/Coopernet";
import {useEffect, useState} from "react";
import Task from "./Task";
import AddTask from "./AddTask";
import Connect from "./Connect";

function App() {

  // Déclare une nouvelle variable d'état, que l'on va appeler « count »
  // useState renvoie un tableau. Le premier élément de ce dernier est un état et le deuxième élément est une référence vers la fonction qui permet de modifier cet état.
  const [tasks, setTasks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
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
          setIsConnected(true);
        } else {
          setIsConnected(false);
        }
        if (isConnected) {
          const server_tasks = await Coopernet.getTasks();
          console.log("tasks récupérées sur le server: ", server_tasks);
          setTasks(server_tasks);
        }
      } catch (e) {
        // Ici, il faudrait afficher dans l'interface qu'il y a eu une
        // erreur d'identification et donner un email de l'administrateur
        // par exemple
        console.log("Erreur: ", e);
      }
    };
    testLocalStorageToken();
  }, [isConnected]);

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
          if (task.id === id) {
            task.isValidate = +!+task.isValidate;
          } // Equivaut à +task.isValidate ? task.isValidate=0 : task.isValidate=1;
          Coopernet.updateTask(task, task.order);
          return task;
        })
    );
  };

  const handleClickDisconnect = () => {
    localStorage.removeItem("token");
    Coopernet.oauth = {};
    setTasks([]);
    Coopernet.setUsername("");
    Coopernet.setPassword("");
    setIsConnected(false);
  };

  const handleClickConnect = async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    Coopernet.setUsername(username);
    Coopernet.setPassword(password);
    if (await Coopernet.setOAuthToken()) {
      setIsConnected(true);
    }
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
    };
    try {
      const id = await Coopernet.addTask(newTask, tasks.length);
      newTask.id = id.id;
      newTask.isValidate = id.isValidate;
      setTasks([...tasks, newTask]);
    } catch (e) {
      console.log("Erreur lors de l'ajout au serveur : ", e);
    }
  };
  if (isConnected) {
    return (
        <div className="App container">
          <div className="d-flex justify-content-between my-3">
            <AddTask
                showAddModal={showAddModal}
                handleCloseAddModal={handleCloseAddModal}
                handleSubmitTask={handleSubmitTask}
                handleShowAddModal={handleShowAddModal}
            />
            <button onClick={handleClickDisconnect}
                    className="btn btn-secondary">
              Se déconnecter
            </button>
          </div>
          <h1 className="mb-5">Liste des tâches</h1>
          <div className="fw-bold">
            <h2>Tâches en cours</h2>
            {tasks
                .filter((task) => !parseInt(task.isValidate))
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
                .filter((task) => parseInt(task.isValidate))
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
        </div>
    );
  } else {
    return <Connect handleClickConnect={handleClickConnect}/>;
  }
}

export default App;
