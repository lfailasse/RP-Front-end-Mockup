import axios from 'axios';
import { useContext, useState } from 'react';
import { AuthContext } from '../../../Components/Contexts/AuthContext';
import Head from '../../../Components/Head';
import './Register.css';
import axiosInstance from '../../../Components/Axios/axios';
window.Buffer = window.Buffer || require("buffer").Buffer;

export const Register = () => {

    const [Reg, setReg] = useState(null)

    const [LoginData, SetLoginData] = useState({
        name: "",
        username: "",
        password: "",
        role: "",
        email: ""
    })

    const { headers } = useContext(AuthContext);

    async function onclick(e) {
        e.preventDefault()
        try {
            await axiosInstance.post('/user', { name: LoginData.name, username: LoginData.username, password: LoginData.password, role: LoginData.role, email: LoginData.email }, { headers: headers })
            document.getElementById("form_reg").reset();
            setReg(true)
        }
        catch(error) {
            setReg(false)
        }
    }

    function setdata(e) {
        const data = { ...LoginData }
        data[e.target.id] = e.target.value;
        SetLoginData(data);
    }

    return (
        <div className="register_div">
            <Head title="Registro"></Head>
            <form id="form_reg" className="register_div_form" onSubmit={(e) => onclick(e)}>
                <label className='register_label' >Nome</label>
                <input required className='register_input' onChange={(e) => {setdata(e); setReg(null)}} type={'text'} id="name" placeholder="Nome"></input>
                <label className='register_label'>Login</label>
                <input required className='register_input' onChange={(e) => {setdata(e); setReg(null)}} type={'text'} id="username" placeholder="Login"></input>
                <label className='register_label'>Senha</label>
                <input required className='register_input' onChange={(e) => {setdata(e); setReg(null)}} type={'password'} id="password" placeholder="Senha"></input>
                <label className='register_label' >Cargo</label>
                <input required className='register_input' onChange={(e) => {setdata(e); setReg(null)}} type={'text'} id="role" placeholder="Cargo"></input>
                <label className='register_label' >Email</label>
                <input required className='register_input' onChange={(e) => {setdata(e); setReg(null)}} type={'text'} id="email" placeholder="Email"></input>
                <hr style={{width: "7cm"}}></hr>
                <input className='register_submit' type={'submit'} value="Cadastrar"></input>
            </form>
            {Reg == true ? <h1 className='register_testtrue'>Registrado com sucesso!</h1> : Reg == false ? <h1 className='register_testfalse'>Ocorreu um erro durante o registro</h1> : null}
        </div>
    )
}