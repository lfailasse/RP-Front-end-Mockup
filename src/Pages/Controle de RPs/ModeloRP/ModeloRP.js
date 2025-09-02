import { useState } from 'react'
import './ModeloRP.css'
import { useEffect } from 'react'
import axiosInstance from '../../../Components/Axios/axios'
import { useContext } from 'react'
import { AuthContext } from '../../../Components/Contexts/AuthContext'
import Head from '../../../Components/Head'
import { FaAngleDoubleRight, FaTrash } from 'react-icons/fa'
import { json, Link } from 'react-router-dom'
import { IoIosArrowBack } from 'react-icons/io'

export const ModeloRP = () => {

    const { headers, userData } = useContext(AuthContext)

    const [RPs, setRPs] = useState([])

    const [view, setView] = useState([(false)])

    useEffect(() => {
        fetchData()
    }, [])

    function deleteModel(id, name) {
        if (window.confirm(`Deseja remover o modelo ${name}?`)) {
            axiosInstance.patch(`/rp/deletemodel/${id}`, {}, { headers: headers }).then(alert(`Modelo removido com sucesso`))
            window.location.reload()
        }
    }

    async function createRP(e, i) {
        e.preventDefault()
        if (window.confirm("Deseja criar esta RP?")) {
            try {
                var fd = new FormData()
                fd.append("rpdto", new Blob([JSON.stringify({ entityRP: RPs[i], rpitems: RPs[i].rpitems })], { type: 'application/json' }))
                await axiosInstance.post("/rp", fd, { headers: headers })
                alert("Criado com sucesso")
            } catch (error) {
                alert("RP não criada, tente novamente")
            }
        }
    }

    function saveDatas(i, e) {
        const nDate = new Date(e.target.value)
        let dateToString = (nDate.getDate() + 1) + '/' + (nDate.getMonth() + 1) + "/" + (nDate.getFullYear())
        const datas = [...RPs]
        datas[i][e.target.id] = nDate
        setRPs(datas)
    }

    function fetchData() {
        axiosInstance.get("/rp/savedrps", { headers: headers }).then((data) => setRPs(data.data))
    }

    function setcview(i) {
        const cView = [...view]
        cView.forEach(function (value, index) {
            if (index !== i) {
                cView[index] = false
            }
        })
        cView[i] = !cView[i]
        setView(cView)
    }

    function setitemvalue(i, itemindex, e) {
        const RP = [...RPs]
        RP.forEach(function (value, index) {
            if (index === i) {
                value.rpitems[itemindex]["valor"] = e
            }
        })
        setRPs(RP)
    }

    return (
        <div style={{ position: 'relative', marginBottom: '1cm' }}>
            <div className='div_modelrp'>
                <Head title="Modelos de RP"></Head>
                {RPs.map((rp, index) =>
                (rp.department === userData.department ? <div className='div_modelrp_model' key={index}>
                    <div className='div_modelname' onClick={(e) => setcview(index)}>{index + 1} - {rp.modelname}</div>
                    {view[index] ?
                        <div className='div_modelrp_model_info'>
                            <form onSubmit={(e) => createRP(e, index)} className='div_modelrp_model_div'>
                                <div className='div_modelrp_infos_div'>
                                    <div className='div_modelrp_date_div'>
                                        <label style={{ fontSize: '13px', textAlign: 'center', color: 'orange' }}>Data de emissão</label>
                                        <input min={"2024-01-01"} id='dataemissao' onChange={(e) => saveDatas(index, e)} required className='div_modelrp_model_date' type='date'></input>
                                    </div>
                                    <div className='div_modelrp_date_div'>
                                        <label style={{ fontSize: '13px', textAlign: 'center', color: 'orange' }}>Data de pagamento</label>
                                        <input min={"2024-01-01"} id='datapagamento' onChange={(e) => saveDatas(index, e)} required className='div_modelrp_model_date' type='date'></input>
                                    </div>
                                </div>
                                <div className='div_modelrp_itens'>
                                    <label style={{ textAlign: 'center' }}>Itens</label>
                                    {rp.rpitems.map((item, itemindex) =>
                                    (<div className='div_modelrp_infos_itens'>
                                        <div style={{ color: 'orange' }}>{item.name}</div>
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: '15px' }}>
                                            <label>R$</label>
                                            <input style={{}} required type={'number'} step={'0.01'} defaultValue={item.valor} onChange={(e) => setitemvalue(index, itemindex, e.target.value)}></input>
                                        </div>
                                    </div>))}
                                </div>
                                <div onClick={() => deleteModel(rp.id, rp.modelname)} className='div_modelrp_icon'>
                                    <FaTrash className='modelrp_trashicon' size={15}></FaTrash>
                                </div>
                                <button className='div_modelrp_button_icon' type='submit'>
                                    <FaAngleDoubleRight className='modelrp_sendicon' size={15}></FaAngleDoubleRight>
                                </button>
                            </form>
                        </div>
                        : null}
                </div> : null))}
            </div>
            {userData.department === "RH" ?
                <Link to={'/RH/controleRP'}><div className='redirect_modelorp'><IoIosArrowBack size={'40px'}></IoIosArrowBack></div></Link>
                : userData.department === "COMPRAS" ?
                    <Link to={'/Compras/controleRP'}><div className='redirect_modelorp'><IoIosArrowBack size={'40px'}></IoIosArrowBack></div></Link>
                    :
                    <Link to={'/Administrativo/controleRP'}><div className='redirect_modelorp'><IoIosArrowBack size={'40px'}></IoIosArrowBack></div></Link>
            }
        </div>
    )
}