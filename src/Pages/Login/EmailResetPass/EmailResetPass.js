import { useState } from 'react'
import './EmailResetPass.css'
import axiosInstance from '../../../Components/Axios/axios';
import Head from '../../../Components/Head';
import { FourSquare } from 'react-loading-indicators';

export const EmailResetPass = () => {

    const [email, setEmail] = useState();

    const [loading, setLoading] = useState(false)

    async function sendReset(e) {
        e.preventDefault()
        setLoading(true)
        await axiosInstance.post("/user/reset", email).then(() => setLoading(false))
        window.location.reload()
    }

    return (
        <div style={{ pointerEvents: loading ? 'none' : 'auto', height: '100vh', position: 'relative' }}>
            <div style={{ filter: loading ? 'blur(5px) brightness(50%)' : null }}>
                <div className='div_login'>
                    <img src="../../../assets/igedesbranco.png" height="100" alt='logo'></img>
                </div>
                <Head title="Redefinição de senha"></Head>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ marginTop: '3cm', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h4 style={{ color: 'white', margin: 0 }}>Insira o e-mail cadastrado:</h4>
                        <form onSubmit={(e) => sendReset(e)}>
                            <input style={{ borderRadius: '5px', width: '7cm' }} required onChange={(e) => { setEmail(e.target.value) }} type={"email"}></input>
                            <input type={"submit"} value={"Enviar"}></input>
                        </form>
                        <div style={{ marginTop: '1cm' }}>
                            <label style={{ color: 'red' }}>Atenção! </label>
                            <label style={{ color: 'white' }}>Caso desconheça o e-mail registrado em seu usuário, entre em contato com um administrador.</label>
                        </div>
                        <div style={{ position: 'absolute', bottom: 0 }}>
                            <img style={{ opacity: '0.4' }} src='assets/igedesbranco.png' height="100"  alt='igedeslogo'></img>
                        </div>
                    </div>
                </div>
            </div>
            {loading ?
                <div style={{ position: 'fixed', top: '90%', right: 0 }}>
                    <FourSquare size='small' color="lightblue"></FourSquare>
                </div>
                : null}
        </div>
    )
}