
import {useState, useEffect} from "react";
import {BsTrash, BsBookmarkCheck, BsBookmarkCheckFill} from 'react-icons/bs';
import './App.css';
import FirstComponent from './Components/FisrtComponent';
const API = 'http:localhost:5000'
export default function App() {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);  


  // Load todos on page load
  useEffect(()=>{
    const loadData = async()=>{
      setLoading(true)
      const res = await fetch(API + '/todos')
      .then((resp) => resp.json())
      .then((data) => data)
      .catch((err) => console.log(err));

      setLoading(false);
      setTodos(res);
    };
    loadData();
  }, [])

  const handleSubmit =  async(e) => {
    e.preventeDefault()
    const todo = {
      id: Math.random(),
      title,
      time,
      done: false,

    };
    await fetch(API + "/todos", {
      method: "POST",
      headers: {
       'Content-Type': 'application/json'
      },
      body: JSON.stringify(todo)
    })
    setTodos((prevState) => [...prevState, todo]);
    setTime('')
    setTitle('')
  }
  const handleDelete = async (id) => {
    await fetch(API + "/todos" + id, {
      method: "DELETE",
    });

    setTodos((prevState) => prevState.filter((todo) => todo.id !== id));
  }
  const handleEdit = async(todo) => {
     todo.done = !todo.done;
     const data  =await fetch(API + "/todos" + todo.id, {
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    setTodos((prevState) => prevState.map((t) => t.id === data.id ? (t.data) : t));
  }
  if(loading){
    return <p>Carregando...</p>
  }
  return (
    <div className="App">
      <div className="todoHeader">
      <h1>React Todo</h1>

      </div>
      <div className='formTodo'>
      <h2>Insira sua proxima tarefa:</h2>
      <form onSubmit={handleSubmit}>
        <div className='formControl'>
          <label htmlFor='title'>O que você vai fazer?
          </label>
          <input 
          type='text' 
          name='title' 
          placeholder='Titulo da tarefa'
          onChange={(e) => setTitle(e.target.value)}
          value={title || ""}
          required
         >

          </input>
        </div>
         <div className='formControl'>
          <label htmlFor='time'>Duração:
          </label>
          <input 
          type='text' 
          name='time' 
          placeholder='Tempo estimado em (horas)'
          onChange={(e) => setTime(e.target.value)}
          value={time || ""}
          required
         >

          </input>
        </div>
       <input 
       type='submit'
       value="Criar tarefa"></input>
      </form>
      </div>
      <div className="listTodo">
     <h2>Lista de tarefas:</h2>
     {todos.length === 0 && <p>Não há tarefas!</p>}
     {todos.map((todo) => (
      <div className='todo' key={todo.id}>
        <h3 className={todo.done ? "todoDone" : ''}>{todo.title}</h3>
        <p>Duração:{todo.time}</p>
        <div className='actions'>
          <span onClick={() => handleEdit(todo)}>
            {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
          </span>
          <BsTrash onClick={() => handleDelete(todo.id)}/>
        </div>
      </div>
     ))}
      </div>
    </div>
  );
}


