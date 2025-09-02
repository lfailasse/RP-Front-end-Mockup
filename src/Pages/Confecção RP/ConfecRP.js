import { useContext, useEffect, useRef, useState } from 'react'
import Head from '../../Components/Head'
import './ConfecRP.css'
import ReactInputMask from 'react-input-mask'
import Select from 'react-select'
import { AuthContext } from '../../Components/Contexts/AuthContext'
import { Link } from 'react-router-dom'
import { IoIosArrowForward } from 'react-icons/io'
import axiosInstance from '../../Components/Axios/axios'
import { set } from 'react-hook-form'
import { isMobile } from 'react-device-detect'
import axios from 'axios'
import { type } from '@testing-library/user-event/dist/type'
import { FourSquare } from 'react-loading-indicators'
import { MdBlock } from 'react-icons/md'

export const ConfecRP = () => {
    

    const { headers, userData } = useContext(AuthContext)
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
        projeto: {},
        centrodecustos: {},
        rubrica: null,
        classefinanceira: null,
        datapagamento: "",
        contrato: false,
        classificacao: "",
        favorecido: "",
        documento: "",
        desc: "",
        orcamento: "",
        pix: "",
        credito_agencia_n: "",
        credito_agencia_nome: "",
        credito_banco_n: "",
        credito_banco_nome: "",
        credito_cc_n: ""
    })

    const [rubricalist, setRubricalist] = useState([])

    const [cfinanceiralist, setCfinanceiralist] = useState([])

    const [currentRubrica, setCurrentRubrica] = useState([])

    const [currentdocument, setcurrentdocument] = useState("")

    const [favorecidoslist, setFavorecidoslist] = useState([])

    const [itens, setItens] = useState([])

    const [valortotal, setValortotal] = useState(0)

    const [provisao, setProvisao] = useState(false)

    const [classificacaolist, setClassificaolist] = useState([])

    const [projetolist, setProjetolist] = useState([]);

    const [Centrodecustolist, setCentrodecustolist] = useState([]);

    const [orçamentos, setOrçamentos] = useState([])

    const [orçamento, setOrçamento] = useState()

    const [LoadingAnimation, setLoadingAnimation] = useState(false)

    const [trigger, setTrigger] = useState(false)

    const selectRef = useRef(null);

    useEffect(() => {
        async function Requests() {
            axios.get("https://mesa.ddns.com.br/notas/reports/api").then((res) => setOrçamentos(res.data))
            axiosInstance.get("/rp/favorecidos", { headers: headers }).then((res) => setFavorecidoslist(res.data))
            axiosInstance.get("/cenc", { headers: headers }).then((res) => setCentrodecustolist(res.data))
            axiosInstance.get("/projects", { headers: headers }).then((res) => setProjetolist(res.data))
            axiosInstance.get("/classificacao", { headers: headers }).then((res) => setClassificaolist(res.data))
            currentDate()
        }

        Requests()
    }, [trigger])

    useEffect(() => {
        const cItens = [...itens]
        if (cItens.length == 0) {
            setValortotal(0)
        } else {
            totalvalue()
        }
    }, [itens.length])

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

    const customOption = {
        option: (provided, state) => {
            if (state.isFocused && state.data.saldo <= 0) {
                return {
                     ...provided,
                    backgroundColor: 'red',
                    color: 'black',
                };
            }
            if (state.data.saldo <= 0) {
                return {
                    ...provided,
                    backgroundColor: '#FF7F7F',
                    color: 'black',
                };
            }
            return provided;
        }
    }

    const Additem = () => {
        const add = [...itens, { name: "" }]
        setItens(add)
    }

    const delItem = () => {
        const Item = [...itens]
        Item.splice(Item.length - 1, 1)
        setItens(Item)
        totalvalue()
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

    function totalvalue() {
        var valor = 0
        for (const [index, value] of itens.entries()) {
            var cvalor = 0
            if (!isNaN(value.valor)) {
                cvalor = value.valor
            }
            valor += cvalor
        }
        setValortotal(parseFloat(valor))
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

    async function sendFavorecido(e) {
        e.preventDefault()
        await axiosInstance.post("/rp/favorecidos", { document: favorecido.document, name: favorecido.name }, { headers: headers })
        setTrigger(!trigger)
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
        const rp = { ... RP}
        if (payment == "PIX") {
            if (currentdocument.pix != null) {
                document.getElementById("pix").defaultValue = currentdocument.pix
                rp["pix"] = currentdocument.pix
            }
        } else if (payment == "CRÉDITO EM C/C") {
            if (currentdocument.credito_banco_n != null) {
                document.getElementById("credito_banco_n").defaultValue = currentdocument.credito_banco_n
                rp["credito_banco_n"] = currentdocument.credito_banco_n
            }
            if (currentdocument.credito_banco_nome != null) {
                document.getElementById("credito_banco_nome").defaultValue = currentdocument.credito_banco_nome
                rp["credito_banco_nome"] = currentdocument.credito_banco_nome
            }
            if (currentdocument.credito_agencia_n != null) {
                document.getElementById("credito_agencia_n").defaultValue = currentdocument.credito_agencia_n
                rp["credito_agencia_n"] = currentdocument.credito_agencia_n
            }
            if (currentdocument.credito_agencia_nome != null) {
                document.getElementById("credito_agencia_nome").defaultValue = currentdocument.credito_agencia_nome
                rp["credito_agencia_nome"] = currentdocument.credito_agencia_nome
            }
            if (currentdocument.credito_cc_n != null) {
                document.getElementById("credito_cc_n").defaultValue = currentdocument.credito_cc_n
                rp["credito_cc_n"] = currentdocument.credito_cc_n
            }
        }
    }

    async function sendRP(e) {
        e.preventDefault();
        setLoadingAnimation(true)
        var fd = new FormData()
        if (!document.getElementById('files').files.length == 0) {
            var files = document.getElementById('files').files;
            for (var i = 0; i < files.length; i++) {
                fd.append("files", files[i]);
            }
        } else {
            fd.append("files", null)
        }
        fd.append('rpdto', new Blob([JSON.stringify({ entityRP: { dataemissao: RP.dataemissao, orcamento: RP.orcamento, datapagamento: RP.datapagamento, contrato: RP.contrato, contaprovisao: RP.contaprovisao, projeto: RP.projeto, rubrica: RP.rubrica, classefinanceira: RP.classefinanceira, documento: RP.documento, desc: RP.desc, favorecido: RP.favorecido, centrodecustos: RP.centrodecustos, classificacao: RP.classificacao, pagamento: payment, anexo: RP.pix, agencia_n: RP.credito_agencia_n, agencia_nome: RP.credito_agencia_nome, banco_n: RP.credito_banco_n, banco_nome: RP.credito_banco_nome, cc_n: RP.credito_cc_n }, rpitems: itens })], { type: "application/json" }))
        try {
            await axiosInstance.post("/rp", fd, { headers: headers })
        } catch (error) {
            window.alert("Erro ao criar a RP")
            setLoadingAnimation(false)
        }
        setLoadingAnimation(false)
        window.alert("Criado! Verifique na página de visualização de RPs")
        selectRef.current.clearValue();
        currentDate()
    }

    function setClassificacao(e) {
        const rp = { ...RP }
        rp["classificacao"] = e.name
        setRP(rp)
    }

    function setProjeto(e) {
        const rp = { ...RP }
        rp["projeto"] = e
        setRP(rp)
    }

    async function setRubrica(e) {
        const rp = { ...RP }
        rp["rubrica"] = e
        setRP(rp)
        await axiosInstance.get(`/rubricas/${e.id}`, { headers: headers }).then((res) => setCurrentRubrica(res.data))
        console.log(currentRubrica)
    }

    function setCFinanceira(e) {
        const rp = { ...RP }
        rp["classefinanceira"] = e
        setRP(rp)
    }

    function setCentrodecustos(e) {
        const rp = { ...RP }
        rp["centrodecustos"] = e
        setRP(rp)
    }

    function setOrcamento(e) {
        const rp = { ...RP }
        rp["orcamento"] = e
        console.log(rp)
        setRP(rp)
    }

    function currentDate() {
        document.getElementById('dataemissao').valueAsDate = new Date()
        var data = document.getElementById('dataemissao').value
        const rp = { ...RP }
        rp["dataemissao"] = data
        setRP(rp)
    }

    function setContratoRP(e) {
        const rp = { ...RP }
        rp["contrato"] = e
        setRP(rp)
    }

    async function deleteFav(id, nome) {
        if (window.confirm(`Deseja deletar o favorecido ${nome}?`)) {
            await axiosInstance.delete(`/rp/favorecidos/deletar?id=${id}`, { headers })
            setTrigger(!trigger)
        }
    }

    return (
        <div style={{ pointerEvents: LoadingAnimation ? 'none' : 'auto' }}>
            <div className='main_div_confecrp' style={{ filter: LoadingAnimation ? 'blur(5px) brightness(50%)' : null }}>
                {reg ? <Head title="Requisição de Pagamento"></Head> : <Head title="Registro de Favorecido"></Head>}
                <div className='div_favorecido_registrarrp'>
                    <button className='div_favorecido_registrarrp_button' onClick={() => setreg(!reg)}>{reg ? "Registrar Favorecido" : "Registrar RP"}</button>
                </div>
                {reg ?
                    <form onSubmit={(e) => { sendRP(e); e.target.reset(); setpayment("DINHEIRO"); setValortotal(0); setcurrentdocument(null) }}>
                        <div className='div_rp'>
                            <div className='div_rp_main'>
                                <div className='div_rp_main_cabeçalho'>
                                    <div className='div_rp_main_cabeçalho_itens'>
                                        <div className='div_rp_main_cabeçalho_item'>
                                            <label>Debitar ao projeto:</label>
                                        </div>
                                        <div className='div_rp_main_cabeçalho_item'>
                                            <label>Centro de custos:</label>
                                        </div>
                                        {isMobile ? null :
                                            <div className='div_rp_main_cabeçalho_item'>
                                                <label>Data de emissão:</label>
                                            </div>
                                        }
                                    </div>
                                    <div className='div_rp_main_selects'>
                                        <div className='div_rp_main_select'>
                                            <Select
                                                id='projeto'
                                                isClearable={false}
                                                isSearchable={true}
                                                required={true}
                                                className='rpconfec_select'
                                                getOptionLabel={(projetolist) => projetolist.name}
                                                getOptionValue={(projetolist) => projetolist.name}
                                                options={projetolist.sort(function (a, b) { return a.name.localeCompare(b.name) })}
                                                placeholder={"Selecione um projeto"}
                                                noOptionsMessage={() => "Sem opções"}
                                                onChange={(e) => { setProjeto(e) }}
                                            ></Select>
                                        </div>
                                        <div className='div_rp_main_select'>
                                            <Select
                                                id='centrodecustos'
                                                isClearable={false}
                                                isSearchable={true}
                                                required={true}
                                                className='rpconfec_select'
                                                getOptionLabel={(Centrodecustolist) => Centrodecustolist.name}
                                                getOptionValue={(Centrodecustolist) => Centrodecustolist.name}
                                                options={RP.projeto?.centrodecustos?.sort(function (a, b) { return a.name.localeCompare(b.name) })}
                                                placeholder={"Selecione um centro de custos"}
                                                noOptionsMessage={() => "Sem opções, é possível que seja necessário selecionar um projeto para continuar"}
                                                onChange={(e) => { setCentrodecustos(e) }}
                                            ></Select>
                                        </div>
                                        {isMobile ? null :
                                            <div className='div_rp_main_select'>
                                                <input className='div_rp_main_dataemissao' id="dataemissao" required onChange={(e) => saveRP(e)} type={"date"} min={"2000-01-01"}></input>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className='div_rp_main_line_div'>
                                    <hr className='div_rp_main_line'></hr>
                                </div>
                                <div className='div_rp_main_corpo'>
                                    <div className='div_rp_main_corpo_selects'>
                                        <div className='div_rp_main_corpo_select'>
                                            <label>Favorecido: </label>
                                            <Select
                                                ref={selectRef}
                                                className='rpconfec_select'
                                                placeholder={"Selecione um favorecido"}
                                                id='favorecido'
                                                isClearable={true}
                                                isSearchable={true}
                                                getOptionValue={(favorecidoslist) => favorecidoslist.name}
                                                getOptionLabel={(favorecidoslist) => favorecidoslist.name}
                                                options={favorecidoslist.sort(function (a, b) { return a.name.localeCompare(b.name) })}
                                                onChange={(e) => { searchDocument(e) }}
                                            >
                                            </Select>
                                        </div>
                                        <div className='div_rp_main_corpo_select'>
                                            <label>CNPJ/CPF: </label>
                                            {Loadingdoc ? <input id="documento" onChange={(e) => saveRP(e)} value={checkdocument()} className='div_rp_main_corpo_favdocumento' type={"text"} readOnly></input> : <input value={"Aguarde..."} className='div_rp_main_corpo_favdocumento' type={"text"} readOnly></input>}
                                        </div>
                                        <div className='div_rp_main_corpo_select'>
                                            <label>Data de pagamento: </label>
                                            <input id="datapagamento" onChange={(e) => saveRP(e)} required className='div_rp_main_corpo_datapagamento' type={"date"}></input>
                                        </div>
                                        {isMobile ?
                                            <div className='div_rp_main_corpo_select'>
                                                <label>Data de emissão: </label>
                                                <input id="dataemissao" onChange={(e) => saveRP(e)} required className='div_rp_main_corpo_datapagamento' type={"date"}></input>
                                            </div>
                                            : null
                                        }
                                    </div>
                                    {isMobile ? null :
                                        <div className='div_rp_main_corpo_additems'>
                                            <input type={"button"} value={"Adicionar item"} onClick={() => Additem()}></input>
                                            {itens.length > 0 ?
                                                <input className='div_rp_main_corpo_additems_delbutton' type={"button"} value={"Excluir"} onClick={() => { delItem() }}></input>
                                                : null
                                            }
                                            {itens.map((item, i) => (
                                                <div key={i}>
                                                    <div className='div_rp_main_corpo_additems_item'>
                                                        <label className='div_rp_main_corpo_additems_name'>Item:</label>
                                                        <label className='div_rp_main_corpo_additems_value'>Valor:</label>
                                                    </div>
                                                    <div className='div_rp_main_corpo_additems_itemlist'>
                                                        <div className='div_rp_main_corpo_additems_itemlist_items'>
                                                            <input required id='name' type={"text"} className='div_rp_main_corpo_additems_itemlist_items_name' onChange={(e) => saveItem(e, i)}></input>
                                                            <input required id='valor' type={"number"} step={0.01} className='div_rp_main_corpo_additems_itemlist_items_value' onChange={(e) => { saveItem(e, i); totalvalue() }}></input>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className='div_valortotal'>
                                                {itens.length > 0 ? <label>Valor total: {valortotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</label> : null}
                                            </div>
                                            {itens.length > 0 && userData.department === "RH" ?
                                                <div className='div_contaprovisao'>
                                                    Utilizar conta provisão?
                                                    <div className='div_contaprovisao_checkbox'>
                                                        <input id='provisaocheckbox' type={'checkbox'} onChange={(e) => { setProvisao(!provisao) }}></input>
                                                    </div>
                                                </div> : null}
                                            {itens.length > 0 ?
                                                document.getElementById("provisaocheckbox") !== null && document.getElementById("provisaocheckbox").checked ?
                                                    <div className='provisao_value_text'>
                                                        <label>Insira o valor que será debitado da conta provisão:</label>
                                                        <div>
                                                            <label>R$</label>
                                                            <input id='contaprovisao' className='provisao_value' type={"number"} placeholder='0.00' step={0.01} min={0.0} onChange={(e) => saveRP(e)}></input>
                                                        </div>
                                                    </div> : null : null}
                                        </div>
                                    }
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', padding: '30px' }}>
                                    <div style={{ width: '50%' }}>
                                        <label>Rubrica: </label>
                                        <Select
                                            className='rpconfec_select'
                                            placeholder={"Selecione uma rubrica"}
                                            id='rubrica'
                                            isClearable={true}
                                            required={false}
                                            isSearchable={true}
                                            getOptionValue={(rubricalist) => rubricalist.id}
                                            getOptionLabel={(rubricalist) => rubricalist.code + ' - ' + rubricalist.name}
                                            options={RP.projeto?.rubricas?.sort(function (a, b) { return a.code.localeCompare(b.code) })}
                                            noOptionsMessage={() => "Sem opções, é possível que seja necessário selecionar um projeto para continuar"}
                                            onChange={(e) => { setRubrica(e) }}
                                        >
                                        </Select>
                                    </div>
                                    <div style={{ width: '50%' }}>
                                        <label>Classe Financeira: </label>
                                        <Select
                                            className='rpconfec_select'
                                            placeholder={"Selecione uma classe financeira"}
                                            id='cfinanceira'
                                            required={false}
                                            isClearable={true}
                                            isSearchable={true}
                                            getOptionValue={(cfinanceiralist) => cfinanceiralist.id}
                                            getOptionLabel={(cfinanceiralist) => cfinanceiralist.code + ' - ' + cfinanceiralist.name}
                                            options={currentRubrica?.classefinanceira?.sort(function (a, b) { return a.code.localeCompare(b.code) })}
                                            noOptionsMessage={() => "Sem opções, é possível que seja necessário selecionar uma rubrica para continuar"}
                                            onChange={(e) => { setCFinanceira(e) }}
                                        >
                                        </Select>
                                    </div>
                                </div>
                                {userData.department === "COMPRAS" ?
                                    <div>
                                        <div className='div_orçamento_main'>
                                            <div>Orçamento:</div>
                                            <div className='div_orcamento'>
                                                <div className='div_orcamento_select'>
                                                    <Select
                                                        id='projeto'
                                                        styles={customOption}
                                                        isClearable={false}
                                                        required={false}
                                                        isSearchable={true}
                                                        className='rpconfec_select'
                                                        getOptionLabel={(orçamentos) => orçamentos.orcamento}
                                                        getOptionValue={(orçamentos) => orçamentos.orcamento}
                                                        options={orçamentos.filter((orçamento) => orçamento.projeto === RP.projeto?.name).sort(function (a, b) { return b.orcamento.localeCompare(a.orcamento) })}
                                                        placeholder={"Selecione um orçamento"}
                                                        onChange={(e) => { setOrçamento(e); setOrçamento(orçamentos.find(orç => orç.orcamento === e.orcamento)); setOrcamento(e.orcamento) }}
                                                        isLoading={orçamentos.length > 0 ? false : true}
                                                        noOptionsMessage={() => "Sem opções, é possível que seja necessário selecionar um projeto antes de continuar..."}
                                                        loadingMessage={() => "Carregando orçamentos, aguarde..."}
                                                    ></Select>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    {orçamento ? <div>Valor total: {orçamento?.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div> : null}
                                                    {orçamento ? <div>Saldo Atual: <label style={{ color: orçamento.saldo < 0 ? 'red' : orçamento.saldo == 0 ? 'orange' : 'white' }}>{orçamento?.saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</label></div> : null}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    : null}
                                <div className='div_rp_main_corpo_description'>
                                    <label className='div_rp_main_corpo_description_label'>Descrição: </label>
                                    <textarea placeholder='Insira o texto' className='div_rp_main_corpo_desc' id="desc" maxLength={255} onChange={(e) => saveRP(e)} required></textarea>
                                </div>
                                {userData.department === "ADMINISTRATIVO" ?
                                    <div style={{ padding: '30px', display: 'flex', flexDirection: 'column' }}>
                                        <label style={{ display: 'flex' }}>Esta RP é um contrato<input style={{ marginBottom: '0px' }} type={"checkbox"} onChange={(e) => setContratoRP(e.target.checked)}></input></label>
                                    </div>
                                    : null}
                                {isMobile ?
                                    <>
                                        <div className='div_rp_main_corpo_hr_div'>
                                            <hr className='div_rp_main_corpo_hr'></hr>
                                        </div>
                                        <div className='div_rp_main_corpo_additems'>
                                            <input type={"button"} value={"Adicionar item"} onClick={() => Additem()}></input>
                                            {itens.length > 0 ?
                                                <input className='div_rp_main_corpo_additems_delbutton' type={"button"} value={"Excluir"} onClick={() => { delItem() }}></input>
                                                : null
                                            }
                                            {itens.map((item, i) => (
                                                <div key={i}>
                                                    <div className='div_rp_main_corpo_additems_item'>
                                                        <label className='div_rp_main_corpo_additems_name'>Item:</label>
                                                        <label className='div_rp_main_corpo_additems_value'>Valor:</label>
                                                    </div>
                                                    <div className='div_rp_main_corpo_additems_itemlist'>
                                                        <div className='div_rp_main_corpo_additems_itemlist_items'>
                                                            <input required id='name' type={"text"} className='div_rp_main_corpo_additems_itemlist_items_name' onChange={(e) => saveItem(e, i)}></input>
                                                            <input required id='valor' type={"number"} step={0.01} className='div_rp_main_corpo_additems_itemlist_items_value' onChange={(e) => { saveItem(e, i); totalvalue() }}></input>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className='div_valortotal'>
                                                {itens.length > 0 ? <label>Valor total: {valortotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</label> : null}
                                            </div>
                                            {itens.length > 0 ?
                                                <div className='div_contaprovisao'>
                                                    Utilizar conta provisão?
                                                    <div className='div_contaprovisao_checkbox'>
                                                        <input id='provisaocheckbox' type={'checkbox'} onChange={(e) => { setProvisao(!provisao) }}></input>
                                                    </div>
                                                </div> : null}
                                            {itens.length > 0 ?
                                                document.getElementById("provisaocheckbox") !== null && document.getElementById("provisaocheckbox").checked ?
                                                    <div className='provisao_value_text'>
                                                        <label>Insira o valor que será debitado da conta provisão:</label>
                                                        <div>
                                                            <label>R$</label>
                                                            <input id='contaprovisao' className='provisao_value' type={"number"} placeholder='0.00' step={0.01} min={0.0} onChange={(e) => saveRP(e)}></input>
                                                        </div>
                                                    </div> : null : null}
                                        </div>
                                    </> : null}
                                <div className='div_rp_main_corpo_hr_div'>
                                    <hr className='div_rp_main_corpo_hr'></hr>
                                </div>
                                <div className='div_paymentselect_main'>
                                    <div className='div_paymentselect'>
                                        <select id="selectpayment" value={payment} onChange={(e) => setpayment(e.target.value)}>
                                            <option>DINHEIRO</option>
                                            <option>BOLETO</option>
                                            <option>CRÉDITO EM C/C</option>
                                            <option>PIX</option>
                                        </select>
                                    </div>
                                    <div className='div_payment_option'>
                                        {payment === "CRÉDITO EM C/C" ?
                                            <div>
                                                <div className='div_payment'>
                                                    <div className='div_payment_label'>
                                                        <label>BANCO:</label>
                                                    </div>
                                                    <label>N°: </label>
                                                    <input required className='input_cheque_n' id='credito_banco_n' onChange={(e) => saveRP(e)} type='text'></input>
                                                    <label> - NOME: </label>
                                                    <input required className='input_cheque_nome' id='credito_banco_nome' onChange={(e) => saveRP(e)} type='text'></input>
                                                </div>
                                                <div className='div_payment'>
                                                    <div className='div_payment_label'>
                                                        <label>AGÊNCIA: </label>
                                                    </div>
                                                    <label>N°: </label>
                                                    <input required className='input_cheque_n' id='credito_agencia_n' onChange={(e) => saveRP(e)} type={"text"}></input>
                                                    <label> - NOME: </label>
                                                    <input required className='input_cheque_nome' id='credito_agencia_nome' onChange={(e) => saveRP(e)} type={"text"}></input>
                                                </div>
                                                <div className='div_payment'>
                                                    <div className='div_payment_label'>
                                                        <label>C/C: </label>
                                                    </div>
                                                    <label>N°: </label>
                                                    <input required className='input_cheque_n' id='credito_cc_n' onChange={(e) => saveRP(e)} type='text'></input>
                                                </div>
                                            </div>
                                            : payment === "PIX" ?
                                                <div className='pix_input'>CHAVE PIX:
                                                    <input id='pix' onChange={(e) => saveRP(e)} required className='input_cheque_pix' type={"text"}></input>
                                                </div>
                                                : null}
                                    </div>
                                </div>
                                <div className='div_payment_hr'>
                                    <hr className='payment_hr'></hr>
                                </div>
                                <div className='div_anexos'>
                                    <div className='div_anexos_label'>
                                        <label>Anexar documentos</label>
                                    </div>
                                    <div className='div_anexos_input'>
                                        <input id='files' type='file' webkitdirectory directory multiple></input>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='div_rp_main_corpo_submit'>
                            <input className='favorecido-submit-btn' type={"submit"}></input>
                        </div>
                    </form>
                    :
                    <div className="favorecido-container">
                        <div className="favorecido-form-container">
                            <form onSubmit={(e) => sendFavorecido(e)}>
                                <div className="input-group">
                                    <label className="input-label">Nome do favorecido: </label>
                                    <input
                                        className="favorecido-input"
                                        id="name"
                                        required
                                        onChange={(e) => saveFavorecido(e)}
                                        type="text"
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Documento do favorecido: </label>
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name="cpf/cnpj"
                                            defaultChecked
                                            onClick={() => { setdoc("cpf") }}
                                        />
                                        CPF
                                    </label>
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name="cpf/cnpj"
                                            onClick={() => { setdoc("cnpj") }}
                                        />
                                        CNPJ
                                    </label>

                                    {doc === "cpf" ? (
                                        <ReactInputMask
                                            id="document"
                                            required
                                            onChange={(e) => saveFavorecido(e)}
                                            mask="999.999.999-99"
                                            className="favorecido-input docfavorecido-input"
                                        />
                                    ) : (
                                        <ReactInputMask
                                            id="document"
                                            required
                                            onChange={(e) => saveFavorecido(e)}
                                            mask="99.999.999/9999-99"
                                            className="favorecido-input docfavorecido-input"
                                        />
                                    )}
                                </div>

                                <div className="submit-container">
                                    <input
                                        className="favorecido-submit-btn"
                                        type="submit"
                                    />
                                </div>
                            </form>

                            <div className="favorecidos-list-container">
                                <label className="favorecidos-list-label">Favorecidos registrados</label>
                                <hr className="favorecidos-list-divider" />
                                {favorecidoslist.map((fav) => (
                                    <div className="favorecido-item" key={fav.document}>
                                        <label className="favorecido-name">{fav.name}</label>
                                        <div
                                            onClick={() => deleteFav(fav.document, fav.name)}
                                            className="favorecido-delete-btn"
                                        >
                                            <MdBlock />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                }
                {userData.department === "RH" ?
                    <><Link to={'/RH/controleRP'}><div className='redirect_confecrp'><IoIosArrowForward size={'40px'}></IoIosArrowForward></div></Link></>
                    : userData.department === "COMPRAS" ?
                        <><Link to={'/Compras/controleRP'}><div className='redirect_confecrp'><IoIosArrowForward size={'40px'}></IoIosArrowForward></div></Link></>
                        :
                        <><Link to={'/Administrativo/controleRP'}><div className='redirect_confecrp'><IoIosArrowForward size={'40px'}></IoIosArrowForward></div></Link></>
                }
            </div>
            {LoadingAnimation ?
                <div style={{ position: 'fixed', top: '90%', right: 0 }}>
                    <FourSquare size='small' color="lightblue"></FourSquare>
                </div>
                : null}
        </div >
    )
}