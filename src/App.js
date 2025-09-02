import Axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import './App.css';
import { AuthContext } from './Components/Contexts/AuthContext';
import Sidemenu from './Components/Sidemenu';
import axiosInstance from './Components/Axios/axios';
import { MdClose } from 'react-icons/md';


function App() {

  const { userData, headers } = useContext(AuthContext);

  const [version, setVersion] = useState(true)

  useEffect(() => {
    axiosInstance.get("/user/version", { headers }).then(version => { console.log(version.data); setVersion(version.data) })

  }, [])

  return (
    <div className='div_home'>
      {!version ?
        <div style={{ position: 'fixed', height: '100%', width: '100%', zIndex: 99 }}>
          <dialog style={{ overflowY: 'auto', marginTop: '1cm', position: 'fixed', width: '50%', height: '50%', zIndex: 11, borderRadius: '5px' }} open={version ? false : true}>
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
              <h2>Notas da atualização '01.01.01'</h2>
              <label style={{ marginBottom: '20px' }}>Existe agora um novo botão de "Pronto para aprovação" em verde, ao lado das RPs dentro da página de controle</label>
              <label>As requisições só passarão a ser visualizadas para aprovação quando forem sinalizadas como prontas, podendo ser manuseadas com segurança, sem possível conflito entre as funções de cargos</label>
              <div style={{ marginTop: '40px' }}>
                <label style={{ color: 'red' }}>Atenção!</label>
                <label> RPs só poderão ser editadas (Anexos ou informações) enquanto não estiverem prontas para aprovação.</label>
              </div>
              {userData.project == "MATRIZ" ?
                <div style={{ marginTop: '1cm' }}>
                  <h3>Orçamento</h3>
                  <label>Adicionada a opção de pesquisa e filtragem das RPs, assim como o botão de devolução das mesmas para casos de erro.</label>
                </div>
                : null}
              <label style={{ marginTop: '1cm' }}>-------------------</label>
              <label>Atenciosamente, administrador.</label>
              <div onClick={() => { setVersion(true) }} style={{marginTop: '1cm', textAlign: 'center'}}>
                <label className='app_close_dialog'>Clique para fechar</label>
              </div>
            </div>
          </dialog>
        </div>
        : null}
      <div className='home_welcome'>
        <h1 style={{ color: "white" }}>Bem-vindo(a), {userData.name}!</h1>
        <div className='div_home_gifs'>
          <img style={{ maxWidth: '50%', maxHeight: '320px', marginTop: '1cm' }} src='./assets/github.png'></img>
        </div>
      </div>
    </div>
  );
}

export default App;