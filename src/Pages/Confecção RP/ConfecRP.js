import { useContext, useEffect, useState } from 'react'
import Head from '../../Components/Head'
import './ConfecRP.css'
import ReactInputMask from 'react-input-mask'
import Select from 'react-select'
import { AuthContext } from '../../Components/Contexts/AuthContext'
import { Link } from 'react-router-dom'
import { IoIosArrowForward } from 'react-icons/io'
import axiosInstance from '../../Components/Axios/axios'

export const ConfecRP = () => {

    const { headers } = useContext(AuthContext)
    const [reg, setreg] = useState(true)
    const [Loadingdoc, setLoadingdoc] = useState(true)
    const [doc, setdoc] = useState("cpf")
    const [payment, setpayment] = useState("DINHEIRO")
    const [favorecido, setFavorecido] = useState({
        document: String,
        name: String
    })

    const [RP, setRP] = useState({
        dataemissao: "",
        debprojeto: "",
        centrodecustos: "",
        datapagamento: "",
        favorecido: "",
        documento: "",
        desc: "",
        pix: "",
        credito_agencia_n: "",
        credito_agencia_nome: "",
        credito_banco_n: "",
        credito_banco_nome: "",
        credito_cc_n: ""
    })

    const [currentdocument, setcurrentdocument] = useState("")

    const [favorecidoslist, setFavorecidoslist] = useState([])

    const [itens, setItens] = useState([])

    useEffect(() => {
        axiosInstance.get("/rp/favorecidos", { headers: headers }).then((res) => setFavorecidoslist(res.data))
    }, [])

    useEffect(() => {
        formapagamento()
        if (payment == "PIX") {
            let pix = document.getElementById("pix").value
            RP["pix"] = pix
        } else if (payment == "CRÉDITO EM C/C") {
            RP["credito_agencia_n"] = document.getElementById("credito_agencia_n").value
            RP["credito_agencia_nome"] = document.getElementById("credito_agencia_nome").value
            RP["credito_banco_n"] = document.getElementById("credito_banco_n").value
            RP["credito_banco_nome"] = document.getElementById("credito_banco_nome").value
            RP["credito_cc_n"] = document.getElementById("credito_cc_n").value
        }
        if (currentdocument != "") {
            RP["documento"] = currentdocument?.document
            RP["favorecido"] = currentdocument?.name
        }
    }, [currentdocument, formapagamento, payment])

    const Additem = () => {
        const add = [...itens, { name: "" }]
        setItens(add)
    }

    const delItem = (i) => {
        const Item = [...itens]
        Item.splice(i, 1)
        setItens(Item)
    }

    const saveItem = (e, i) => {
        const item = [...itens]
        if (e.target.id == "valor") {
            item[i][e.target.id] = parseFloat(e.target.value)
        } else {
            item[i][e.target.id] = e.target.value
        }
        setItens(item)
    }

    const saveFavorecido = (e) => {
        const fav = { ...favorecido }
        fav[e.target.id] = e.target.value.toUpperCase()
        setFavorecido(fav)
    }

    async function searchDocument(e) {
        if (e === null) {
            setcurrentdocument("")
        }
        setLoadingdoc(false)
        try {
            await axiosInstance.get(`/rp/favorecidos/documento?doc=${e.document}`, { headers: headers }).then((res) => { setcurrentdocument(res.data) })
        } catch (e) {

        }
        setLoadingdoc(true)
    }

    function sendFavorecido() {
        axiosInstance.post("/rp/favorecidos", { document: favorecido.document, name: favorecido.name }, { headers: headers })
    }

    const checkdocument = () => {
        if (currentdocument === "") {
            return ""
        } else {
            return currentdocument?.document
        }
    }


    function saveRP(e) {
        const rp = { ...RP }
        rp[e?.target.id] = e?.target.value
        setRP(rp)
    }

    function formapagamento() {

        if (payment == "PIX") {
            if (currentdocument.pix != null) {
                document.getElementById("pix").defaultValue = currentdocument.pix
            }
        } else if (payment == "CRÉDITO EM C/C") {
            if (currentdocument.credito_banco_n != null) {
                document.getElementById("credito_banco_n").defaultValue = currentdocument.credito_banco_n
            }
            if (currentdocument.credito_banco_nome != null) {
                document.getElementById("credito_banco_nome").defaultValue = currentdocument.credito_banco_nome
            }
            if (currentdocument.credito_agencia_n != null) {
                document.getElementById("credito_agencia_n").defaultValue = currentdocument.credito_agencia_n
            }
            if (currentdocument.credito_agencia_nome != null) {
                document.getElementById("credito_agencia_nome").defaultValue = currentdocument.credito_agencia_nome
            }
            if (currentdocument.credito_cc_n != null) {
                document.getElementById("credito_cc_n").defaultValue = currentdocument.credito_cc_n
            }
        }
    }

    function sendRP(e) {
        e.preventDefault();
        axiosInstance.post("/rp", { entityRP: { dataemissao: RP.dataemissao, datapagamento: RP.datapagamento, debprojeto: RP.debprojeto, documento: RP.documento, desc: RP.desc, favorecido: RP.favorecido, centrodecustos: RP.centrodecustos, pagamento: payment, anexo: RP.pix, agencia_n: parseInt(RP.credito_agencia_n), agencia_nome: RP.credito_agencia_nome, banco_n: parseInt(RP.credito_banco_n), banco_nome: RP.credito_banco_nome, cc_n: parseInt(RP.credito_cc_n) }, rpitems: itens }, { headers: headers })
    }

    return (
        <div>
            {reg ? <Head title="Confecção RP"></Head> : <Head title="Registro de Favorecido"></Head>}
            <div style={{ width: "70%", marginLeft: "auto", marginRight: "auto", marginBottom: "10px", textAlign: "right" }}>
                <button style={{ marginLeft: "auto" }} onClick={() => setreg(!reg)}>{reg ? "Registrar Favorecido" : "Registrar RP"}</button>
            </div>

            {reg ?
                <form onSubmit={(e) => { sendRP(e); e.target.reset(); setpayment("DINHEIRO"); setcurrentdocument(null); window.alert("Criado! Confira na aba Visualizar PDFs") }}>
                    <div className='div_rp'>
                        <div className='div_rp_main'>
                            <div className='div_rp_ main_cabeçalho'>
                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", paddingTop: "10px" }}>
                                    <div style={{ display: "flex", justifyContent: "center", width: "33%" }}>
                                        <label>Debitar ao projeto:</label>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "center", width: "33%" }}>
                                        <label>Centro de custos:</label>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "center", width: "33%" }}>
                                        <label>Data de emissão:</label>
                                    </div>
                                </div>
                                <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-evenly", paddingBottom: "20px" }}>
                                    <div style={{ display: "flex", justifyContent: "center", width: "33%" }}>
                                        <input id="debprojeto" required onChange={(e) => saveRP(e)} style={{ borderRadius: "5px" }}></input>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "center", width: "33%" }}>
                                        <input id="centrodecustos" required onChange={(e) => saveRP(e)} style={{ borderRadius: "5px" }}></input>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "center", width: "33%" }}>
                                        <input id="dataemissao" required onChange={(e) => saveRP(e)} style={{ borderRadius: "5px" }} type={"date"} min={"2000-01-01"}></input>
                                    </div>
                                </div>
                            </div>
                            <div style={{ width: "90%", margin: "auto" }}>
                                <hr style={{ color: "white" }}></hr>
                            </div>
                            <div className='div_rp_main_corpo'>
                                <div style={{ width: "50%" }}>
                                    <div>
                                        <label>Favorecido: </label>
                                        <Select
                                            className='rpconfec_select'
                                            placeholder={"Selecione um favorecido"}
                                            id='favorecido'
                                            isClearable={true}
                                            isSearchable={true}
                                            getOptionValue={(favorecidoslist) => favorecidoslist.name}
                                            getOptionLabel={(favorecidoslist) => favorecidoslist.name}
                                            options={favorecidoslist}
                                            onChange={(e) => { searchDocument(e) }}
                                        >
                                        </Select>
                                    </div>
                                    <div>
                                        <label>CNPJ/CPF: </label>
                                        {Loadingdoc ? <input id="documento" onChange={(e) => saveRP(e)} value={checkdocument()} style={{ width: "90%", boxSizing: "border-box", borderRadius: "5px", background: "rgb(150, 150, 150)" }} type={"text"} readOnly></input> : <input value={"Aguarde..."} style={{ width: "90%", boxSizing: "border-box", borderRadius: "5px", background: "rgb(150, 150, 150)" }} type={"text"} readOnly></input>}
                                    </div>
                                    <div>
                                        <label>Data de pagamento: </label>
                                        <input id="datapagamento" onChange={(e) => saveRP(e)} required style={{ width: "90%", boxSizing: "border-box", borderRadius: "5px" }} type={"date"}></input>
                                    </div>
                                </div>
                                <div style={{ boxShadow: "5px 5px 5px 0px rgba(1, 1, 30, 0.500)", backgroundColor: "rgba(1, 1, 110, 0.301)", width: "50%", padding: "20px", marginTop: "20px", textAlign: "center", border: "1px solid white", borderRadius: "5px" }}>
                                    <input type={"button"} value={"Adicionar item"} onClick={() => Additem()}></input>
                                    {itens.length > 0 ?
                                        <input style={{ marginLeft: "10px", marginBottom: "10px" }} type={"button"} value={"Excluir"} onClick={(i) => delItem(i)}></input>
                                        : null
                                    }
                                    {itens.map((item, i) => (
                                        <div key={i}>
                                            <div style={{ marginLeft: "25%", width: "50%", display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                                <label style={{ width: "3cm", marginRight: "20px" }}>Item:</label>
                                                <label style={{ width: "2cm" }}>Valor:</label>
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignContent: "center" }}>
                                                    <input required id='name' type={"text"} style={{ borderRadius: "5px", width: "3cm", marginRight: "20px", boxSizing: "border-box" }} onChange={(e) => saveItem(e, i)}></input>
                                                    <input required id='valor' type={"number"} step={0.01} style={{ borderRadius: "5px", width: "2cm", boxSizing: "border-box" }} onChange={(e) => saveItem(e, i)}></input>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div style={{ padding: "30px", display: "flex", alignItems: "center" }}>
                                    <label style={{ marginRight: "5px" }}>Descrição: </label>
                                    <textarea id="desc" maxLength={255} onChange={(e) => saveRP(e)} required style={{ width: "45%", height: "20px", minWidth: "45%", minHeight: "20px", maxWidth: "80%", maxHeight: "7cm", borderRadius: "5px" }}></textarea>
                                </div>
                            </div>
                            <div style={{ width: "90%", margin: "auto" }}>
                                <hr style={{ height: "0.5px", color: "white" }}></hr>
                            </div>
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <div style={{ margin: "1cm" }}>
                                    <select id="selectpayment" value={payment} onChange={(e) => setpayment(e.target.value)}>
                                        <option>DINHEIRO</option>
                                        <option>BOLETO</option>
                                        <option>CRÉDITO EM C/C</option>
                                        <option>PIX</option>
                                    </select>
                                </div>
                                <div style={{ width: "100%", margin: "1cm" }}>
                                    {payment === "CRÉDITO EM C/C" ?
                                        <div>
                                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                <div style={{ width: "2cm" }}>
                                                    <label>BANCO:</label>
                                                </div>
                                                <label>N°: </label>
                                                <input required className='input_cheque_n' id='credito_banco_n' onChange={(e) => saveRP(e)} type='text'></input>
                                                <label> - NOME: </label>
                                                <input required className='input_cheque_nome' id='credito_banco_nome' onChange={(e) => saveRP(e)} type='text'></input>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                <div style={{ width: "2cm" }}>
                                                    <label>AGÊNCIA: </label>
                                                </div>
                                                <label>N°: </label>
                                                <input required className='input_cheque_n' id='credito_agencia_n' onChange={(e) => saveRP(e)} type={"text"}></input>
                                                <label> - NOME: </label>
                                                <input required className='input_cheque_nome' id='credito_agencia_nome' onChange={(e) => saveRP(e)} type={"text"}></input>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                <div style={{ width: "2cm" }}>
                                                    <label>C/C: </label>
                                                </div>
                                                <label>N°: </label>
                                                <input required className='input_cheque_n' id='credito_cc_n' onChange={(e) => saveRP(e)} type='text'></input>
                                            </div>
                                        </div>
                                        : payment === "PIX" ?
                                            <div style={{ width: "60%" }}>CHAVE PIX:
                                                <input id='pix' onChange={(e) => saveRP(e)} required className='input_cheque_pix' type={"text"}></input>
                                            </div>
                                            : null}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginLeft: "48%", marginBottom: "1cm" }}>
                        <input type={"submit"}></input>
                    </div>
                </form>
                :
                <div>
                    <div className='div_regfav'>
                        <form onSubmit={() => sendFavorecido()}>
                            <div>
                                <label>Nome do favorecido: </label>
                                <input id="name" required onChange={(e) => saveFavorecido(e)} type={"text"} style={{ borderRadius: "5px" }}></input>
                            </div>
                            <div>
                                <label>Documento do favorecido: </label>
                                <label>
                                    <input type={"radio"} name='cpf/cnpj' defaultChecked onClick={() => { setdoc("cpf") }}></input>
                                    CPF</label>
                                <label style={{ marginRight: "10px" }}>
                                    <input type={"radio"} name='cpf/cnpj' onClick={() => { setdoc("cnpj") }}></input>
                                    CNPJ</label>
                                {
                                    doc === "cpf" ?
                                        <ReactInputMask id='document' required onChange={(e) => saveFavorecido(e)} mask={"999.999.999-99"} style={{ borderRadius: "5px" }}></ReactInputMask>
                                        :
                                        <ReactInputMask id='document' required onChange={(e) => saveFavorecido(e)} mask={"99.999.999/9999-99"} style={{ borderRadius: "5px" }}></ReactInputMask>
                                }
                            </div>
                            <div>
                                <input type={"submit"}></input>
                            </div>
                        </form>
                    </div>
                </div>
            }
            <Link to={'/controlerp'}><div className='redirect_confecrp'><IoIosArrowForward size={'40px'}></IoIosArrowForward></div></Link>
        </div >
    )
}