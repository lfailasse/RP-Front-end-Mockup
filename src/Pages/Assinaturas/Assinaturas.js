import Select from 'react-select';
import Head from '../../Components/Head';
import './Assinaturas.css';
import { useContext, useEffect, useState } from 'react';
import axiosInstance from '../../Components/Axios/axios';
import { AuthContext } from '../../Components/Contexts/AuthContext';

export const Assinaturas = () => {

    const { headers } = useContext(AuthContext);

    const [Users, setUsers] = useState([])
    const [uploadData, setUploadData] = useState({})
    const [imagepreview, setImagepreview] = useState()
    const [msg, setMsg] = useState(null)
    const [currentsignature, setCurrentsignature] = useState()
    const [Loading, setLoading] = useState(false)

    useEffect(() => {
        axiosInstance.get("/user", { headers: headers })
            .then((res) => setUsers(res.data))
        getSignature()
        console.log(currentsignature)
    }, [uploadData])

    async function getSignature() {
        if (uploadData.userid != null) {
            try {
                setLoading(true)
                setCurrentsignature(null)
                await axiosInstance.get(`/user/signature?id=${uploadData.userid}`, { headers: headers, 'Content-Type': 'image/jpg', responseType: 'blob' })
                    .then((res) => setCurrentsignature(URL.createObjectURL(res.data)))
            } catch (e) {
                setCurrentsignature(null)
            }
            setLoading(false)
        }
    }

    function validateFileType(e) {
        var fileName = document.getElementById(e).value;
        var idxDot = fileName.lastIndexOf(".") + 1;
        console.log(idxDot)
        var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
        if (extFile == "jpg" || extFile == "jpeg" || extFile == "png") {

        } else if (fileName == "") {
            document.getElementById(e).value = ""
            setImagepreview(null)
        } else {
            alert("Somente arquivos jpg/jpeg e png são permitidos.");
            document.getElementById(e).value = ""
        }
    }

    function setData(e) {
        const data = { ...uploadData }
        if (e == "file") {
            if (document.getElementById(e).value != "") {
                data["file"] = document.getElementById(e).files[0]
                setImagepreview(URL.createObjectURL(data["file"]))
            } else {
                data["file"] = null
            }
        } else {
            data["userid"] = e
        }
        setUploadData(data)
    }

    async function sendSignature(e) {
        e.preventDefault()
        const formData = new FormData();
        if (uploadData.file != null && uploadData.userid != null) {
            formData.append('file', uploadData.file)
            formData.append('userid', uploadData.userid)
            console.log(formData)
            if (currentsignature != null) {
                if (window.confirm("Esta ação irá sobrepor a assinatura existente, deseja continuar?")) {
                    try {
                        await axiosInstance.post("/user/signature", formData, { headers: headers })
                            .then(setMsg("Enviado com sucesso!"))
                            setCurrentsignature(null)
                    } catch (e) {
                        setMsg("Ocorreu um erro ao enviar as informações")
                    }
                }
            } else {
                try {
                    await axiosInstance.post("/user/signature", formData, { headers: headers })
                        .then(setMsg("Enviado com sucesso!"))
                        setCurrentsignature(null)
                } catch (e) {
                    setMsg("Ocorreu um erro ao enviar as informações")
                }
            }
        } else {
            alert("Existem campos não modificados para envio")
        }
    }

    return (
        <div>
            <Head title="Upload de assinaturas"></Head>
            <div className='div_assinaturas' onSubmit={(e) => { sendSignature(e) }}>
                <form className='div_assinaturas_form'>
                    <div>
                        <input style={{ color: "white" }} id="file" onChange={(e) => { validateFileType(e.target.id); setData(e.target.id); setMsg(null) }} type={"file"} accept="image/png, image/gif, image/jpeg"></input>
                    </div>
                    <div className='div_assinaturas_form_divimg'>
                        {imagepreview ? <img height={"100px"} width={"100px"} src={imagepreview}></img> : null}
                    </div>
                    <Select
                        id='form_select'
                        placeholder={"Selecione um usuário"}
                        isSearchable={true}
                        isClearable={false}
                        className='div_assinaturas_form_select'
                        options={Users}
                        getOptionLabel={(Users) => Users.username}
                        getOptionValue={(Users) => Users.username}
                        onChange={(e) => { setData(e.id); setMsg(null) }}
                    />
                    {Loading ? <div className='div_msg'>Carregando...</div> : null}
                    {currentsignature ? <div className='div_atenção'><div style={{ marginRight: "5px" }}>Atenção!</div><div style={{ color: "white" }}>Este usuário já possui uma assinatura ativa, enviar uma nova irá repor a atual.</div></div> : null}
                    <input className='div_assinaturas_form_button' type={"submit"} value={"Enviar"}></input>
                    {msg ? <div className='div_msg_success'>{msg}</div> : null}
                </form>
            </div>
        </div>
    )

}