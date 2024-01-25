import { useContext } from 'react';
import './App.css';
import { AuthContext } from './Components/Contexts/AuthContext';


function App() {

  const Text = [
    "Este é um texto que pode aparecer aleatoriamente",
    "Este é outro texto que pode aparecer aleatoriamente"
  ]

  const { userData } = useContext(AuthContext );

  return (
    <div className='div_home'>
      <div className='home_welcome'>
        <h1 style={{ color: "white" }}>Bem-vindo(a), {userData.name}!</h1>
        <h4 style={{ color: "aquamarine" }}>{Text[Math.floor(Math.random() * Text.length)]}</h4>
        <div>
          <img src='./assets/panda.gif'></img>
          <img src='./assets/bmo.gif'></img>
        </div>
      </div>
    </div>
  );
}

export default App;