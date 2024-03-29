import Axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import { AuthContext } from '../../Components/Contexts/AuthContext';
import './Login.css';


export const Login = () => {

    const { setTestAuth, setUserData } = useContext(AuthContext)

    const [Error, setError] = useState(false)

    const [Login, setLogin] = useState({
        name: '',
        role: ''
    })

    const navigate = useNavigate();

    function data(e) {
        const data = { ...Login }
        data[e.target.id] = e.target.value
        setLogin(data)
    }

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {
            const response = await Axios.post('http://localhost:8080/user/login', { username: Login.username, password: Login.password })
            if (response?.data.token !== "") {
                Login.name = response?.data.name
                Login.role = response?.data.role
                setUserData(Login)
                secureLocalStorage.setItem("user", JSON.stringify(Login))
                secureLocalStorage.setItem("logged", true)
                secureLocalStorage.setItem("token", response?.data.token)
                setTestAuth(true)
                navigate("/")
            } else {
                setError(true)
            }
        } catch (error) {
            setError(true)
        }
    }

    return (
        <div>
            <div className='div_login'>

                <div>
                    <a className='github_redirect' href='https://github.com/lfailasse'>
                        <img className='testeaaa' src='../../../assets/whitegithub.png' height="50px"></img>
                        <label className='div_login_img_label'>lfailasse</label>
                    </a>
                </div>

            </div>
            <form className="login_form" onSubmit={(e) => { handleSubmit(e) }}>
                <label className='login_label'>Usuário</label>
                <input className='login_input' id="username" onChange={(e) => { data(e); setError(null) }} type={"text"} placeholder="Insira seu usuário" required></input>
                <label className='login_label'>Senha</label>
                <input className='login_input' id="password" onChange={(e) => { data(e); setError(null) }} type={"password"} placeholder="Insira sua senha" required></input>
                {Error ? <h1 className='login_error'>Usuário ou senha incorretos</h1> : null}
                <hr style={{ width: "7cm" }}></hr>
                <input className='login_submit' type={"submit"} value="Entrar"></input>
            </form>
        </div>
    )
}