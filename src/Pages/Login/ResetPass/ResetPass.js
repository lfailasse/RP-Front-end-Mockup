import { Link, useNavigate, useParams } from 'react-router-dom'
import './ResetPass.css'
import { useEffect } from 'react'
import axiosInstance from '../../../Components/Axios/axios'
import { useState } from 'react'
import Head from '../../../Components/Head'
import { FaEye, FaEyeSlash } from "react-icons/fa";

export const ResetPass = () => {

    const { token } = useParams()

    const [valid, setValid] = useState()

    const [Aviso, setAviso] = useState("")

    const [newPass, setNewPass] = useState()

    const [password1, setPassword1] = useState("password")
    const [password2, setPassword2] = useState("password")


    const nav = useNavigate()

    useEffect(() => {
        IsValid()
    }, [])

    async function sendNewPass(e) {
        e.preventDefault()
        if (document.getElementById("firstpass").value != null) {
            var pass1 = document.getElementById("firstpass").value
        }
        if (document.getElementById("secondpass").value != null) {
            var pass2 = document.getElementById("secondpass").value
        }
        if (pass1 === pass2) {
            await axiosInstance.put(`/user/reset/${token}`, newPass, { headers: { "Content-Type": "text/plain" } })
            window.alert("Efetuado com sucesso, clique em \"OK\" ou pressione Enter para redirecionar ao login")
            nav("/login")
        } else {
            setAviso("As senhas não conferem")
            console.log(Aviso)
        }
    }

    async function IsValid() {
        await axiosInstance.get(`user/reset/valid?token=${token}`).then((res) => setValid(res.data))
    }

    function changePassView(e) {
        if (document.getElementById("firstpass") != null) {
            var pass1 = document.getElementById("firstpass")
        }
        if (document.getElementById("secondpass") != null) {
            var pass2 = document.getElementById("secondpass")
        }
        if (e === "first") {
            if (pass1.type === "password") {
                pass1.type = "text"
                setPassword1("text")
            } else {
                pass1.type = "password"
                setPassword1("password")
            }
        } else {
            if (pass2.type === "password") {
                pass2.type = "text"
                setPassword2("text")
            } else {
                pass2.type = "password"
                setPassword2("password")
            }
        }
    }

    return (
        <div style={{ height: '100vh', position: 'relative' }}>
            <div className='div_login'>
                <img src="../../../../public/assets/github.png" height="100" alt='logo'></img>
            </div>
            {valid === null || valid === "" || valid === undefined ?
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '5cm' }}>
                    <label style={{ color: 'orange', fontSize: '19px' }}>Token para redefinição de senha inválido ou expirado.</label>
                    <label style={{ color: 'white' }}>Entre em contato com um administrador para uma nova redefinição</label>
                    <div style={{ marginTop: '1cm' }}>
                        <Link style={{ textDecorationColor: 'white', textDecorationThickness: '0.5px' }} to={"/login"}>
                            <label style={{ color: 'white', cursor: 'pointer' }}>Clique para voltar ao </label>
                            <label style={{ color: 'aquamarine', cursor: 'pointer' }}>Login</label>
                        </Link>
                    </div>
                </div>
                : <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Head title="Redefinição de senha"></Head>
                    <div style={{ color: 'white', marginTop: '1cm' }}>Olá, {valid.name}</div>
                    <div style={{ color: 'aquamarine' }}>Insira uma nova senha para utilização e clique em enviar</div>
                    <div>
                        <form style={{ marginTop: '1cm', display: 'flex', flexDirection: 'column', gap: '10px' }} onSubmit={(e) => { setAviso(""); sendNewPass(e) }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'white' }}>
                                <label>Insira a nova senha:</label>
                                <div style={{ display: 'flex', flexDirection: 'row', position: 'relative' }}>
                                    <input style={{ borderRadius: '5px', width: '7cm' }} required id='firstpass' onChange={(e) => { setNewPass(e.target.value); setAviso("") }} type={'password'}></input>
                                    <div style={{ marginLeft: '10px', cursor: 'pointer', position: 'absolute', right: -30 }} onClick={() => { changePassView("first") }}>
                                        {password1 === "password" ? <FaEye></FaEye> : <FaEyeSlash></FaEyeSlash>}
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'white' }}>
                                <label>Repita a senha:</label>
                                <div style={{ display: 'flex', flexDirection: 'row', position: 'relative' }}>
                                    <input style={{ borderRadius: '5px', width: '7cm' }} required id='secondpass' type={'password'} onChange={() => { setAviso("") }}></input>
                                    <div style={{ marginLeft: '10px', cursor: 'pointer', position: 'absolute', right: -30 }} onClick={() => { changePassView("second") }}>
                                        {password2 === "password" ? <FaEye></FaEye> : <FaEyeSlash></FaEyeSlash>}
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1cm' }}>
                                <input className='resetpass_sendbutton' type={"submit"}></input>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'orange' }}>
                                <label>{Aviso}</label>
                            </div>
                        </form>
                    </div>
                </div >}
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', position: 'absolute', bottom: 0, alignItems: 'center' }}>
                <img style={{ opacity: '0.4' }} src='../../../../public/assets/igedesbranco.png' alt='logo'></img>
            </div>
        </div >
    )
}