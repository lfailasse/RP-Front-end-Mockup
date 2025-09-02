import { PDFViewer } from '@react-pdf/renderer'
import Head from '../../../Components/Head'
import './ComprasRP.css'
import RPpdf from '../../Controle de RPs/RPpdf'
import { useContext, useEffect, useReducer, useRef, useState } from 'react'
import { AuthContext } from '../../../Components/Contexts/AuthContext'
import { AiOutlineSearch, AiFillPlusSquare, AiFillMinusSquare } from 'react-icons/ai'
import { FaPencilAlt } from "react-icons/fa";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { Link } from 'react-router-dom'
import { IoIosArrowBack, IoIosArrowForward, IoIosInformationCircleOutline, IoIosSave, IoMdArrowDropdown, IoMdArrowDropup, IoMdArrowBack } from 'react-icons/io'
import { MdBlock } from "react-icons/md";
import ReactPaginate from 'react-paginate'
import axiosInstance from '../../../Components/Axios/axios'
import { Tooltip } from '@mui/material'
import { isMobile } from 'react-device-detect'
import PDFView from '../../Controle de RPs/PDFview'
import { FourSquare } from 'react-loading-indicators'
import { blue, lightBlue } from '@mui/material/colors'
import PDFDownload from '../../Controle de RPs/PDFDownload'
import { GiConfirmed } from 'react-icons/gi'
import Select from 'react-select'
import axios from 'axios'

export const ComprasRP = () => {

    const { headers, userData } = useContext(AuthContext)

    const [RPs, setRPs] = useState([null])

    const [editRP, setEditRP] = useState()

    const [nEditRP, setNEditRP] = useState({})

    const [view, setView] = useState([false])

    const [NPages, setNPages] = useState([])

    const [CPage, setCPage] = useState(0)

    const [Search, setSearch] = useState("")

    const [Filtered, setFiltered] = useState(false)

    const [Period, setPeriod] = useState(0)

    const [StartDate, setStartDate] = useState()

    const [EndDate, setEndDate] = useState()

    const [Loading, setLoading] = useState(false)
    const [loadingAnexos, setLoadingAnexos] = useState(false)

    const [RPView, setRPView] = useState([])

    const [Column, setColumn] = useState("count")

    const [Order, setOrder] = useState(true)

    const [CFilter, setCFilter] = useState("Todos")

    const [orçamentos, setOrçamentos] = useState([])

    const [Filtertype, setFiltertype] = useState("Favorecido")

    const [Classificacoes, setClassificacoes] = useState()
    const [Centrosdecustos, setCentrosdecustos] = useState()
    const [Projetos, setProjetos] = useState()
    const [Favorecidos, setFavorecidos] = useState()
    const [LoadingDoc, setLoadingDoc] = useState()
    const [currentdocument, setCurrentdocument] = useState()
    const [currentProject, setCurrentProject] = useState()
    const [currentRubrica, setCurrentRubrica] = useState()

    const [signature1, setSignature1] = useState();
    const [signature2, setSignature2] = useState();
    const [signatureContratos, setSignatureContratos] = useState();

    const [Details, setDetails] = useState()

    const [selectedRubrica, setSelectedRubrica] = useState()
    const [selectedCFinanceira, setSelectedCFinanceira] = useState()
    const [SelectedCenC, setSelectedCenC] = useState()
    const [PDFAnexos, setPDFAnexos] = useState(false)

    const [PDFViewAnexos, setPDFViewAnexos] = useState(false)

    const [requestID, setRequestID] = useState(0)

    const [LoadingAnimation, setLoadingAnimation] = useState(false)

    const [RPID, setRPID] = useState()
    const [trigger, setTrigger] = useState(false)

    const [orcamento, setOrcamento] = useState()


    useEffect(() => {
        async function mesa() {
            await axios.get("https://mesa.ddns.com.br/notas/reports/api").then((res) => setOrçamentos(res.data))
        }
        mesa()
    }, [])

    async function getSignature1(id) {
        if (id != null) {
            await axiosInstance.get(`/user/signature?id=${id}`, { headers: headers, 'Content-Type': 'image/jpg', responseType: 'blob' })
                .then((res) => {
                    const url = URL.createObjectURL(res.data);
                    setSignature1(url)
                })
        } else {
            setSignature1(null)
        }
    }

    async function getSignature2(id) {
        if (id != null) {
            await axiosInstance.get(`/user/signature?id=${id}`, { headers: headers, 'Content-Type': 'image/jpg', responseType: 'blob' })
                .then((res) => {
                    const url = URL.createObjectURL(res.data);
                    setSignature2(url)
                })
        } else {
            setSignature2(null)
        }
    }

    async function getSignatureContratos(id) {
        if (id != null) {
            await axiosInstance.get(`/user/signature?id=${id}`, { headers: headers, 'Content-Type': 'image/jpg', responseType: 'blob' })
                .then((res) => {
                    const url = URL.createObjectURL(res.data);
                    setSignatureContratos(url)
                })
        } else {
            setSignatureContratos(null)
        }
    }

    useEffect(() => {

        let pdf = false
        if (RPView.length > 0) {
            for (const [index, anexo] of RPView.entries()) {
                if (anexo.contentType === "application/pdf")
                    pdf = true
                break
            }
        }
        if (pdf === true) {
            setPDFAnexos(true)
        } else {
            setPDFAnexos(true)
        }
    }, [RPView, trigger])

    useEffect(() => {
        searchrpwfilter()
        pages()
    }, [CPage, CFilter, Column, Order, Period, StartDate, EndDate, trigger])

    async function searchrpwfilter() {
        setView([false])
        if (Filtered === true) {
            try {
                setLoading(true)
                await axiosInstance.get(`/rp/search?filterType=${Filtertype}&filterSearch=${Search.toUpperCase()}&page=${CPage}&days=${Period}&startDate=${StartDate}&endDate=${EndDate}&filter=${CFilter}&department=COMPRAS&role=${userData.role}&sortColumn=${Column}&order=${Order}`, { headers: headers }).then((res) => setRPs(res.data))
                setFiltered(true)
            } catch (e) {
                console.log(e)
            }
            setLoading(false)
        } else if (Filtered === false) {
            try {
                setLoading(true)
                await axiosInstance.get(`/rp/search?filterType=${Filtertype}&filterSearch=${Search.toUpperCase()}&page=${0}&days=${Period}&startDate=${StartDate}&endDate=${EndDate}&filter=${CFilter}&department=COMPRAS&role=${userData.role}&sortColumn=${Column}&order=${Order}`, { headers: headers }).then((res) => setRPs(res.data))
                setFiltered(true)
            } catch (e) {
                console.log(e)
            }
            setLoading(false)
        }
    }

    async function signRP(id, type) {
        if (window.confirm(`Deseja assinar a RP (${id})?`)) {
            try {
                await axiosInstance.patch(`/rp/signature/${id}?type=${type}`, {}, { headers: headers })
                setTimeout(() => {

                }, 2000);
                window.location.reload()
            } catch (e) {
                alert("Erro ao assinar a RP")
            }
        }
    }

    function pages() {

        if (NPages.length < RPs?.totalPages) {
            NPages.length = 0
            for (let i = 0; i < RPs?.totalPages; i++) {
                NPages.push(i)
            }
        } else if (NPages.length > RPs?.totalPages) {
            NPages.length = RPs?.totalPages
        }

    }

    function viewpdf(i) {
        const pdf = [...view]
        for (const [index, value] of pdf.entries()) {
            if (index !== i) {
                pdf[index] = false
            }
        }
        pdf[i] = !pdf[i]
        setView(pdf)
    }

    function cancelRP(e) {
        if (window.confirm(`Deseja cancelar esta RP? (${e})`)) {
            try {
                axiosInstance.patch(`/rp/cancel/${e}`, {}, { headers: headers })
                alert("Cancelada com sucesso!")
                if (Filtered === false) {
                    searchrpwfilter()
                } else {
                    searchrpwfilter()
                }
                pages()
            } catch (e) {
                alert("Erro ao cancelar a RP")
            }
        }
    }

    function saveModel(e) {
        if (window.confirm(`Deseja salvar esta RP? (${e})`)) {
            try {
                let modelName = window.prompt("Digite um nome para o modelo")
                if (modelName != null) {
                    axiosInstance.patch(`/rp/savemodel/${e}?name=${modelName}`, {}, { headers: headers })
                    alert(`Modelo \"${modelName}\" salvo com sucesso!`)
                } else {
                    window.alert("Cancelado")
                }
            } catch (e) {
                alert("Erro ao salvar o modelo, tente novamente")
            }
        }
    }

    useEffect(() => {
        axiosInstance.get("/classificacao", { headers: headers }).then((res) => setClassificacoes(res.data))
        axiosInstance.get("/cenc", { headers: headers }).then((res) => setCentrosdecustos(res.data))
        axiosInstance.get("/projects", { headers: headers }).then((res) => setProjetos(res.data))
        axiosInstance.get("/rp/favorecidos", { headers: headers }).then((res) => setFavorecidos(res.data))
    }, [])


    function setperiod(e) {
        switch (e) {
            case 'Todo o período':
                setPeriod(0)
                break;
            case 'Últimos 7 dias':
                setPeriod(7)
                break;
            case 'Últimos 15 dias':
                setPeriod(15)
                break;
            case 'Últimos 30 dias':
                setPeriod(30)
                break;
            case 'Período informado':
                setPeriod(4)
                break;
        }
    }

    function setInformedDate(e) {
        let cDate = new Date(e.target.value)
        let stringDate = (cDate.getDate() + 1) + "/" + (cDate.getMonth() + 1) + "/" + cDate.getFullYear()
        if (e.target.id == "startdaterp") {
            setStartDate(stringDate)
        } else {
            setEndDate(stringDate)
        }
    }

    function setFilterandSearch(e) {
        setCPage(0)
        setCFilter(e)
    }

    function base64ToArrayBuffer(base64, fileName, contentType) {
        var binaryString = window.atob(base64);
        var binaryLen = binaryString.length;
        var bytes = new Uint8Array(binaryLen);
        for (var i = 0; i < binaryLen; i++) {
            var ascii = binaryString.charCodeAt(i);
            bytes[i] = ascii;
        }
        var blob = new Blob([bytes], { type: `${contentType}` });
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    }

    async function addFiles(id) {
        if (window.confirm(`Deseja adicionar os anexos à ${id}?`)) {
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
            fd.append("id", new Blob([id], { type: "application/json" }))
            await axiosInstance.patch("/rp/anexosrp", fd, { headers: headers })
            alert(`Anexos adicionados à ${id}`)
            setLoadingAnimation(false)
            setTrigger(!trigger)
            document.getElementById('files').value = null
        }
    }

    const requestNumber = requestID
    const abortController = new AbortController()
    const signal = abortController.signal

    useEffect(() => {

        async function getRP(id) {
            setLoadingAnexos(true)
            setRPView([])

            if (id) {
                try {
                    const requestData = await axiosInstance.get(`/rp/financeirorps/${id}`, { headers, signal })
                    if (requestData && requestData.data) {
                        setRPView(requestData.data);
                    } else {
                        console.error('Dados da requisição não encontrados', requestData);
                    }
                } catch (err) {
                    if (err.name !== 'AbortError') {
                        console.error('Erro ao buscar dados:', err)
                    }
                } finally {
                    setLoadingAnexos(false)
                }
            }
        }
        if (RPID) {
            getRP(RPID)
        }
        setRequestID((prevID) => prevID + 1)
        return () => {
            abortController.abort()
        }
    }, [RPID, trigger])


    function sortColumn(e) {
        if (Column !== e) {
            setColumn(e)
            setOrder(true)
        } else {
            setOrder(!Order)
        }
    }

    function openModal() {
        document.getElementById("modal_dialog").showModal()
        const reason = document.getElementById("dialog_reason")
        reason.focus()
    }

    function closeModal() {
        document.getElementById("modal_dialog").close()
        const reason = document.getElementById("dialog_reason")
        reason.value = ""
    }

    async function rpEditOpen(id) {
        await axiosInstance.get(`/rp/searchbyid/${id}`, { headers: headers }).then((res) => { setEditRP(res.data) })
        document.getElementById("rpedit").showModal()
        const favorecido = document.getElementById("favorecido")
        favorecido.focus()
    }


    useEffect(() => {
        const selectRubrica = document.getElementById("rubrica")
        const selectCFinanceira = document.getElementById("classefinanceira")

        const firstRubrica = currentProject?.rubricas?.sort((a, b) => a.name.localeCompare(b.name))[0];
        const firstCFinanceira = currentRubrica?.classefinanceira?.sort((a, b) => a.name.localeCompare(b.name))[0];

        if (firstRubrica) {
            selectRubrica.value = firstRubrica.id
        }

        if (firstCFinanceira) {
            selectCFinanceira.value = firstCFinanceira.id
        }
    }, [currentProject, currentRubrica]);

    function editDataRP(e) {
        const newRP = { ...nEditRP }
        if (e.target.id !== "projeto" || e.target.id !== "rubrica" || e.target.id !== "classefinanceira" || e.target.id !== "centrodecustos") {
            newRP[e.target.id] = e.target.value
        }
        if (e.target.id === "projeto") {
            const projeto = Projetos.find(proj => proj.id === parseInt(e.target.value))
            newRP["projeto"] = projeto
            setCurrentProject(projeto)
            const sortedRubricas = projeto?.rubricas?.sort(function (a, b) { return a.name.localeCompare(b.name) });
            newRP["rubrica"] = sortedRubricas ? sortedRubricas[0] : null
            setSelectedRubrica(sortedRubricas ? sortedRubricas[0] : null)
            setCurrentRubrica(sortedRubricas ? sortedRubricas[0] : null)
            newRP["centrodecustos"] = projeto?.centrodecustos?.sort(function (a, b) { return a.name.localeCompare(b.name) })[0]
            setSelectedCenC(projeto?.centrodecustos?.sort(function (a, b) { return a.name.localeCompare(b.name) })[0])
            newRP["classefinanceira"] = sortedRubricas[0]?.classefinanceira?.sort(function (a, b) { return a.name.localeCompare(b.name); })[0]
            setSelectedCFinanceira(sortedRubricas ? sortedRubricas[0]?.classefinanceira?.sort(function (a, b) { return a.name.localeCompare(b.name); })[0] : null)
        } else if (e.target.id === "rubrica") {
            const rubrica = currentProject?.rubricas?.find(rubrica => rubrica.id === parseInt(e.target.value))
            console.log(rubrica)
            newRP["rubrica"] = rubrica
            setSelectedRubrica(rubrica)
            newRP["classefinanceira"] = rubrica?.classefinanceira.sort(function (a, b) { return a.name.localeCompare(b.name) })[0]
            setSelectedCFinanceira(rubrica ? rubrica?.classefinanceira.sort(function (a, b) { return a.name.localeCompare(b.name) })[0] : null)
            setCurrentRubrica(rubrica)
        } else if (e.target.id === "classefinanceira") {
            const classefinanceira = currentRubrica?.classefinanceira?.find(cfinanceira => cfinanceira.id === parseInt(e.target.value)) || null
            newRP["classefinanceira"] = classefinanceira
            setSelectedCFinanceira(classefinanceira)
        } else {
            const centrodecustos = currentProject?.centrodecustos?.find(cenc => cenc.id === parseInt(e.target.value)) || null
            newRP["centrodecustos"] = centrodecustos
            setSelectedCenC(centrodecustos)
        }
        console.log(newRP)
        setNEditRP(newRP)
    }

    function editDataRPItems(e, index) {
        const newRP = { ...nEditRP }
        const RPItems = [...editRP.rpitems]
        RPItems[index][e.target.id] = e.target.value
        newRP["rpitems"] = RPItems
        setNEditRP(newRP)
    }

    async function sendEditRP(e, id) {
        e.preventDefault()
        if (window.confirm(`Deseja atualizar esta RP? (${id})`)) {
            await axiosInstance.patch(`/rp/editar/${id}`, { entityRP: nEditRP, rpitems: nEditRP?.rpitems }, { headers: headers })
            window.location.reload()
        }
    }

    useEffect(() => {
        if (document.getElementById("documento")) {
            document.getElementById("documento").value = currentdocument?.document
        }
        if (nEditRP) {
            nEditRP["favorecido"] = currentdocument?.name
            nEditRP["documento"] = currentdocument?.document
        }
    }, [currentdocument])

    async function searchFavDoc(e) {
        await axiosInstance.get(`/rp/favorecidos/documento?doc=${e.target.value}`, { headers: headers }).then((res) => { setCurrentdocument(res.data) })
        setLoadingDoc(false)
    }

    function rejectRP(e, id) {
        e.preventDefault()
        let fd = new FormData()
        if (window.confirm(`Deseja rejeitar e solicitar alterações para a RP ${id}?`)) {
            let reason = document.getElementById("dialog_reason").value
            fd.append('reason', reason)
            axiosInstance.patch(`/rp/reject/${id}`, fd, { headers: headers })
        }
        document.getElementById("modal_dialog").close()
        alert("Efetuado com sucesso!")
        searchrpwfilter()
    }

    async function lancamentoCompras(e) {
        if (window.confirm(`Deseja inserir o carimbo do compras nesta RP? (${e})`)) {
            await axiosInstance.patch(`/rp/compras/lancamento/${e}`, {}, { headers: headers })
            window.alert(`RP ${e} indicada como lançada`)
            setTrigger(!trigger)
        } else {
            window.alert("Cancelado")
        }
    }

    function showDetails() {
        setDetails(!Details)
    }

    async function deleteAnexo(id, name) {
        if (window.confirm(`Deseja deletar o anexo ${name}?`)) {
            setLoadingAnimation(true)
            await axiosInstance.delete(`/rp/anexosrp/${id}`, { headers })
            setLoadingAnimation(false)
        }
        setTrigger(!trigger)
    }

    const pdfViewRef = useRef()

    const [isClickingInside, setIsClickingInside] = useState(false);

    const handleClickDialog = () => {
        setPDFViewAnexos(prevState => !prevState);
        setIsClickingInside(true);
    };

    const handleClickOutside = (e) => {
        if (PDFViewAnexos && !pdfViewRef?.current.contains(e?.target)) {
            if (!isClickingInside) {
                setPDFViewAnexos(false);
            }
        }
    };

    useEffect(() => {
        if (PDFViewAnexos) {
            setIsClickingInside(false);
        }
    }, [PDFViewAnexos]);

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        document.addEventListener("keydown", function (e) {
            if (e.key == "Escape") {
                setPDFViewAnexos(false)
            }
        })
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    });

    async function prontoAprovacao(e, id) {
        if (window.confirm(`Deseja marcar a requisição ${id} como pronta para aprovação?`)) {
            await axiosInstance.patch(`/rp/compras/pronto/${id}`, {}, { headers })
            setTrigger(prev => !prev)
        }
    }

    async function sendOrcamento(e, id) {
        e.preventDefault()
        const fd = new FormData();
        fd.append("orcamento", orcamento)
        await axiosInstance.patch(`/rp/orcamentochange/${id}`, fd, { headers })
        setTrigger(!trigger)
    }

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

    return (
        <div style={{ pointerEvents: LoadingAnimation ? 'none' : 'auto' }}>
            <div style={{ pointerEvents: PDFViewAnexos ? 'none' : 'auto' }} className={LoadingAnimation || PDFViewAnexos ? 'main_div_rp_loading' : 'main_div_rp'}>
                <Head title="Controle de RPs">/</Head>
                <div>
                    <div>
                        <div className='main_filter_div'>
                            <div className='main_filter_div_search_div'>
                                <label className='label_white'>Pesquisar por filtro</label>
                            </div>
                            <div className='main_filter_div_form'>
                                <form className='main_filter_div_form_inner' onSubmit={(e) => { e.preventDefault(); searchrpwfilter(); setRPs(null) }}>
                                    <div>
                                        <select className='RP_selection_filter' onChange={(e) => setFiltertype(e.target.value)}>
                                            <option>Favorecido</option>
                                            <option>Numero da RP</option>
                                            <option>Centro de custos</option>
                                            <option>Projeto</option>
                                            <option>Rubrica</option>
                                            <option>Classe Financeira</option>
                                            <option>Feito por</option>
                                        </select>
                                    </div>
                                    <input id="searchinput" type={"text"} className='search_input' onChange={(e) => { setSearch(e.target.value); setFiltered(false) }}></input>
                                    <button onClick={() => { setCPage(0) }} type={"submit"} className='search_button'>
                                        <AiOutlineSearch></AiOutlineSearch>
                                    </button>
                                </form>
                                <div className='div_periodo'>
                                    <select className='RP_date_filter' onChange={(e) => setperiod(e.target.value)}>
                                        <option>Todo o período</option>
                                        <option>Últimos 7 dias</option>
                                        <option>Últimos 15 dias</option>
                                        <option>Últimos 30 dias</option>
                                        <option>Período informado</option>
                                    </select>
                                    <div>
                                        <Tooltip placement='right' title={"A data do período corresponde a data de emissão da RP"} enterDelay={50} leaveDelay={50}>
                                            <div className='rp_date_filter_info_container'>
                                                <IoIosInformationCircleOutline size={20} className='rp_date_filter_info'></IoIosInformationCircleOutline>
                                            </div>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                            {Period === 4 ? (
                                <div className='rp_datainformada'>
                                    <div>
                                        <label className='label_white'>Data início:</label>
                                        <input id='startdaterp' onChange={(e) => setInformedDate(e)} className='input_date' onKeyDown={(e) => e.preventDefault()} type={"date"} min={"2000-01-01"} max={"2030-01-01"} />
                                    </div>
                                    <div>
                                        <label className='label_white'>Data fim:</label>
                                        <input id='enddaterp' onChange={(e) => setInformedDate(e)} className='input_date' onKeyDown={(e) => e.preventDefault()} type={"date"} min={"2000-01-01"} max={"2030-01-01"} />
                                    </div>
                                </div>
                            ) : null}
                        </div>
                        <div className='main_div_filter_situacao'>
                            <div className='main_div_filter_situacao_div'>
                                <label className='label_situacao'>Situação:</label>
                                <select onChange={(e) => { setFilterandSearch(e.target.value) }}>
                                    <option>Todos</option>
                                    <option>Assinatura pendente</option>
                                    <option>Aprovado</option>
                                </select>
                            </div>
                        </div>
                        <div className='div_main_columns'>
                            <div className='div_columns'>
                                <div className='div_column'><label id='count' onClick={(e) => sortColumn(e.target.id)}>NÚMERO DA RP</label>{Column == "count" && Order ? <IoMdArrowDropdown /> : Column == "count" && Order == false ? <IoMdArrowDropup /> : null}</div>
                                <div className='div_column'><label id='dataemissao' onClick={(e) => sortColumn(e.target.id)}>DATA DE EMISSÃO</label>{Column == "dataemissao" && Order ? <IoMdArrowDropdown /> : Column == "dataemissao" && Order == false ? <IoMdArrowDropup /> : null}</div>
                                <div className='div_column'><label id='datapagamento' onClick={(e) => sortColumn(e.target.id)}>DATA DE PAGAMENTO</label>{Column == "datapagamento" && Order ? <IoMdArrowDropdown /> : Column == "datapagamento" && Order == false ? <IoMdArrowDropup /> : null}</div>
                                <div className='div_column'><label id='favorecido' onClick={(e) => sortColumn(e.target.id)}>FAVORECIDO</label>{Column == "favorecido" && Order ? <IoMdArrowDropdown /> : Column == "favorecido" && Order == false ? <IoMdArrowDropup /> : null}</div>
                                <div className='div_column'><label id='projeto' onClick={(e) => sortColumn(e.target.id)}>PROJETO</label>{Column == "projeto" && Order ? <IoMdArrowDropdown /> : Column == "projeto" && Order == false ? <IoMdArrowDropup /> : null}</div>
                                <div className='div_column'><label id='centrodecustos' onClick={(e) => sortColumn(e.target.id)}>CENTRO DE CUSTO</label>{Column == "centrodecustos" && Order ? <IoMdArrowDropdown /> : Column == "centrodecustos" && Order == false ? <IoMdArrowDropup /> : null}</div>
                                <div className='div_column'><label id='rubrica' onClick={(e) => sortColumn(e.target.id)}>RUBRICA</label>{Column == "rubrica" && Order ? <IoMdArrowDropdown /> : Column == "rubrica" && Order == false ? <IoMdArrowDropup /> : null}</div>
                                <div className='div_column'><label id='classefinanceira' onClick={(e) => sortColumn(e.target.id)}>CLASSE FINANCEIRA</label>{Column == "classefinanceira" && Order ? <IoMdArrowDropdown /> : Column == "classefinanceira" && Order == false ? <IoMdArrowDropup /> : null}</div>
                                <div className='div_column'><label id='total' onClick={(e) => sortColumn(e.target.id)}>VALOR TOTAL</label>{Column == "total" && Order ? <IoMdArrowDropdown /> : Column == "total" && Order == false ? <IoMdArrowDropup /> : null}</div>
                                <div className='div_column_visualizar'><label>VISUALIZAR PDF</label></div>
                            </div>
                            {Loading ? <div className='div_main_info_columns'><label className='div_info_columns_loading_label'>Carregando...</label></div> : RPs?.content?.filter(rp => userData.project !== "MATRIZ" ? rp.projeto.name === userData.project : true).map((rp, index) => (
                                rp.department === 'COMPRAS' ?
                                    <div className='div_main_info_column' key={index}>
                                        <div className={isMobile ? rp.status && rp.rejected && view[index] ? 'div_info_columns_rejected_opened' : rp.status && rp.rejected ? 'div_info_columns_rejected' : rp.status && view[index] ? "div_info_columns_canceled_opened" : rp.status ? "div_info_columns_canceled" : view[index] ? "div_info_columns_opened" : 'div_info_columns' : 'div_info_columns'}>
                                            <div className='div_info_column' onClick={isMobile ? () => { setRPID(rp.id); viewpdf(index); getSignature1(rp.rp_signature1); getSignature2(rp.rp_signature2); getSignatureContratos(rp.rp_signature_contratos) } : null} style={{ color: rp.rejected && userData.project === "MATRIZ" && rp.aprovacaomatriz == true || rp.rejected && userData.project !== "MATRIZ" && rp.prontoParaAprovacaoProjeto ? "#00FF00" : rp.status && rp.rejected ? "orange" : rp.status ? "red" : userData.project === "MATRIZ" && rp.aprovacaomatriz == true || userData.project !== "MATRIZ" && rp.prontoParaAprovacaoProjeto ? "#00FF00" : "yellow" }}>
                                                <div className='div_info_column_content'><label className='label_content_title'>Número da RP: </label><label>{rp.id}</label></div>
                                                <div className='div_info_column_content'><label className='label_content_title'>Data de emissão: </label><label>{rp.dataemissao}</label></div>
                                                <div className='div_info_column_content'><label className='label_content_title'>Data de pagamento: </label><label>{rp.datapagamento}</label></div>
                                                <Tooltip title={rp.favorecido} placement='top'><div className='div_info_column_content'><label className='label_content_title'>Favorecido: </label><label>{rp.favorecido ? rp.favorecido : "SEM FAVORECIDO"}</label></div></Tooltip>
                                                <div className='div_info_column_content'><label className='label_content_title'>Projeto: </label><label>{rp.projeto?.name}</label></div>
                                                <div className='div_info_column_content'><label className='label_content_title'>Centro de custos: </label><label>{rp.centrodecustos?.name}</label></div>
                                                <Tooltip title={rp.rubrica?.code + ' - ' + rp.rubrica?.name} placement='top'><div className='div_info_column_content'><label className='label_content_title'>Rubrica: </label><label>{rp.rubrica ? rp.rubrica?.code + ' - ' + rp.rubrica?.name : "Indefinido"}</label></div></Tooltip>
                                                <Tooltip title={rp.classefinanceira?.code + ' - ' + rp.classefinanceira?.name} placement='top'><div className='div_info_column_content'><label className='label_content_title'>Rubrica: </label><label>{rp.classefinanceira ? rp.classefinanceira?.code + ' - ' + rp.classefinanceira?.name : "Indefinido"}</label></div></Tooltip>
                                                <div className='div_info_column_content'><label className='label_content_title'>Valor: </label><label>{rp.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</label></div>
                                                <div className='div_info_column_content_visualizar'>
                                                    <Tooltip title={rp.status ? "Status: Cancelada" : !rp.aprovacaoCompras ? "Status: Aguardando aprovação do Compras" : !rp.aprovacaoOrcamento ? "Status: Aguardando aprovação do Orçamento" : rp.financeirostatus !== "Pago" ? "Status: Aguardando pagamento" : "Status: Pago"} placement='top'>
                                                        <div style={{ position: 'absolute', left: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                            <IoIosInformationCircleOutline size={20} style={{ display: view[index] ? 'none' : null, color: 'lightblue' }} className='rp_date_filter_info'></IoIosInformationCircleOutline>
                                                        </div>
                                                    </Tooltip>
                                                    <button className='button_visualizarpdf' value={"Ver PDF"} onClick={async () => { setRPID(rp.id); await getSignature1(rp.rp_signature1); await getSignature2(rp.rp_signature2); await getSignatureContratos(rp.rp_signature_contratos); viewpdf(index) }}>{view[index] ? "Ocultar PDF" : "Ver PDF"}</button>
                                                </div>
                                                {rp.status || (rp.aprovacaoCompras || rp.aprovacaoGerenciaMatriz) ? <div className='button_cancelarpdf_false'></div> : <div onClick={() => cancelRP(rp.id)} className='button_cancelarpdf_true' style={{ right: view[index] ? 60 : 70 }}><MdBlock className='pdf_cancel' size={20}></MdBlock></div>}
                                                <dialog className='modal_editrp' id='rpedit'>
                                                    <label>{editRP?.id}</label>
                                                    <form onSubmit={(e) => sendEditRP(e, editRP?.id)} id="rpedit_form" className='modal_editrp_main_form'>
                                                        <div className='modal_editrp_main_div'>
                                                            <div className='modal_editrp_rp'>
                                                                <label className='modal_editrp_rp_title'>Dados da RP</label>
                                                                <div className='div_editrp_rp_atributo'><label className='div_editrp_rp_atributo_label'>Favorecido: </label><select id='favorecido' onChange={(e) => { setLoadingDoc(true); searchFavDoc(e) }} key={editRP?.favorecido} className='div_editrp_rp_atributo_input' type={'text'}><option hidden>{editRP?.favorecido}</option>{Favorecidos?.sort((a, b) => { return a.name.localeCompare(b.name) }).map((fav) => (<option key={fav.document} value={fav.document}>{fav.name}</option>))}</select></div>
                                                                <div className='div_editrp_rp_atributo'><label className='div_editrp_rp_atributo_label'>Documento do favorecido: </label>{LoadingDoc ? <input readOnly id='documento' key={editRP?.documento} className='div_editrp_rp_atributo_inputdocumento' type={'text'} defaultValue={"Carregando..."}></input> : <input readOnly id='documento' onChange={(e) => editDataRP(e)} key={editRP?.documento} className='div_editrp_rp_atributo_inputdocumento' type={'text'} defaultValue={editRP?.documento}></input>} </div>
                                                                <div className='div_editrp_rp_atributo'><label className='div_editrp_rp_atributo_label'>Data de pagamento: </label><input id='datapagamento' onChange={(e) => editDataRP(e)} key={editRP?.datapagamento} className='div_editrp_rp_atributo_input' type={'text'} defaultValue={editRP?.datapagamento}></input></div>
                                                                <div className='div_editrp_rp_atributo'><label className='div_editrp_rp_atributo_label'>Projeto: </label><select id='projeto' onChange={(e) => editDataRP(e)} key={editRP?.projeto?.id} className='div_editrp_rp_atributo_input' type={'text'} defaultValue={editRP?.projeto?.id}>{Projetos?.sort((a, b) => { return a.name.localeCompare(b.name) }).map((proj) => (<option value={proj.id}>{proj.name}</option>))}</select></div>
                                                                <div className='div_editrp_rp_atributo'><label className='div_editrp_rp_atributo_label'>Centro de custos: </label> <select id='centrodecustos' onChange={(e) => editDataRP(e)} key={editRP?.centrodecustos?.id} className='div_editrp_rp_atributo_input' type={'text'} defaultValue={editRP?.centrodecustos?.id || currentProject?.centrodecustos?.id}>{!currentProject ? editRP?.projeto?.centrodecustos?.sort((a, b) => { return a.name.localeCompare(b.name) }).map((cenc) => (<option value={cenc.id}>{cenc.name}</option>)) : currentProject?.centrodecustos?.sort((a, b) => { return a.name.localeCompare(b.name) }).map((cenc) => (<option value={cenc.id}>{cenc.name}</option>))}</select></div>
                                                                <div className='div_editrp_rp_atributo'><label className='div_editrp_rp_atributo_label'>Rubrica: </label> <select id='rubrica' onChange={(e) => editDataRP(e)} key={editRP?.rubrica?.id} className='div_editrp_rp_atributo_input' type={'text'} value={selectedRubrica?.id || ''} defaultValue={editRP?.rubrica?.id || currentRubrica?.id}>{!currentProject ? editRP?.projeto?.rubricas?.sort((a, b) => { return a.name.localeCompare(b.name) }).map((rubrica) => (<option value={rubrica.id}>{rubrica.name}</option>)) : currentProject?.rubricas?.sort((a, b) => { return a.name.localeCompare(b.name) }).map((rubrica) => (<option value={rubrica.id}>{rubrica.name}</option>))}</select></div>
                                                                <div className='div_editrp_rp_atributo'><label className='div_editrp_rp_atributo_label'>Classe Financeira: </label> <select id='classefinanceira' onChange={(e) => editDataRP(e)} key={editRP?.classefinanceira?.id} className='div_editrp_rp_atributo_input' type={'text'} value={selectedCFinanceira?.id || ''} defaultValue={editRP?.classefinanceira?.id || currentRubrica?.classefinanceira[0]?.id}>{!currentRubrica ? editRP?.rubrica?.classefinanceira?.sort((a, b) => { return a.name.localeCompare(b.name) }).map((cfinanceira) => (<option value={cfinanceira.id}>{cfinanceira.name}</option>)) : currentRubrica?.classefinanceira?.sort((a, b) => { return a.name.localeCompare(b.name) }).map((cfinanceira) => (<option value={cfinanceira.id}>{cfinanceira.name}</option>))}</select></div>
                                                                <div className='div_editrp_rp_atributo'><label className='div_editrp_rp_atributo_label'>Descrição: </label><textarea id='desc' onChange={(e) => editDataRP(e)} key={editRP?.desc} className='div_editrp_rp_atributo_input' type={'text'} defaultValue={editRP?.desc}></textarea></div>
                                                            </div>
                                                            <div className='modal_editrp_rpitems'>
                                                                <label className='modal_editrp_rp_title'>Itens</label>
                                                                {editRP?.rpitems?.map((item, index) => (
                                                                    <div className='div_editrp_rpitems'>
                                                                        <div key={editRP?.id} className='div_editrp_rp_atributo'><input id='name' onChange={(e) => editDataRPItems(e, index)} className='div_editrp_rpitems_atributo_inputname' defaultValue={item.name}></input><input id='valor' onChange={(e) => editDataRPItems(e, index)} className='div_editrp_rp_atributo_inputvalue' type={'number'} min={0} step={0.01} defaultValue={item.valor}></input></div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className='div_editrp_form_submit'>
                                                            <input className='editrp_form_submit' type={'submit'}></input>
                                                        </div>
                                                    </form>
                                                </dialog>
                                                <div onClick={() => saveModel(rp.id)} className='button_salvarmodelo' style={{ right: view[index] ? 40 : 50 }}><IoIosSave className='pdf_save' size={20}></IoIosSave></div>
                                                {userData.project == "MATRIZ" && rp.aprovacaomatriz || userData.project !== "MATRIZ" && rp.prontoParaAprovacaoProjeto ? null : <div onClick={() => rpEditOpen(rp.id)} className='button_editrp' style={{ left: 50 }}><FaPencilAlt className='rp_edit' size={15}></FaPencilAlt></div>}
                                            </div>
                                            {userData.project === "MATRIZ" && !rp.aprovacaomatriz || userData.project !== "MATRIZ" && !rp.prontoParaAprovacaoProjeto ? <div onClick={(e) => { prontoAprovacao(e, rp.id) }} style={{ marginTop: '4px', position: 'absolute', right: view[index] ? 19 : 25, display: "flex", justifyContent: "center", alignItems: "center" }}><GiConfirmed className='pdf_confirm_button' size={20}></GiConfirmed></div>
                                                : null}
                                        </div>
                                        {view[index] ?
                                            <div className='div_pdfview_info'>
                                                <PDFViewer style={{ height: "80vh", width: "70%" }}>
                                                    <RPpdf assinatura1={signature1} assinatura2={signature2} assinaturaContratos={signatureContratos} rpaprovacaoOrcamento={rp.aprovacaoOrcamento ? "/assets/carimboOrcamento.png" : null} rplancamentocompras={rp.lancamentoCompras} rpdepartment={rp.department} documento={rp.documento} dataemissao={rp.dataemissao} datapagamento={rp.datapagamento} favorecido={rp.favorecido} centrodecustos={rp.centrodecustos?.name} debprojeto={rp.projeto?.name} rporcamento={rp.orcamento} rprubrica={rp.rubrica?.code + ' - ' + rp.rubrica?.name} rpclassefinanceira={rp.classefinanceira?.code + ' - ' + rp.classefinanceira?.name} rpitems={rp.rpitems} rpdesc={rp.desc} rptotal={rp.total} rppag={rp.pagamento} rpanexo={rp.anexo} rpanexos={RPView} rpbancon={rp.banco_n} rpbanconome={rp.banco_nome} rpagencian={rp.agencia_n} rpagencianome={rp.agencia_nome} rpccn={rp.cc_n} rpid={rp.id} rpclassificacao={rp.classificacao} rpstatus={rp.status} contaprovisao={rp.contaprovisao} contaexecucao={rp.contaexecucao}></RPpdf>
                                                </PDFViewer>
                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                                    <label className='label_datacriacao'>{rp.datacriacao}</label>
                                                    {!Details ?
                                                        <AiFillPlusSquare style={{ color: 'white', marginTop: '5px' }} onClick={() => { showDetails() }}></AiFillPlusSquare>
                                                        :
                                                        <AiFillMinusSquare style={{ color: 'white', marginTop: '5px' }} onClick={() => { showDetails() }}></AiFillMinusSquare>
                                                    }
                                                    <div className='div_downloadpdf'>
                                                        {rp ? <PDFDownload assinatura1={signature1} assinatura2={signature2} assinaturaContratos={signatureContratos} rpaprovacaoOrcamento={rp.aprovacaoOrcamento ? "/assets/carimboOrcamento.png" : null} rplancamentocompras={rp.lancamentoCompras} rpdepartment={rp.department} documento={rp.documento} dataemissao={rp.dataemissao} datapagamento={rp.datapagamento} favorecido={rp.favorecido} centrodecustos={rp.centrodecustos?.name} debprojeto={rp.projeto?.name} rporcamento={rp.orcamento} rprubrica={rp.rubrica?.code + ' - ' + rp.rubrica?.name} rpclassefinanceira={rp.classefinanceira?.code + ' - ' + rp.classefinanceira?.name} rpitems={rp.rpitems} rpdesc={rp.desc} rptotal={rp.total} rppag={rp.pagamento} rpanexo={rp.anexo} rpanexos={RPView} rpbancon={rp.banco_n} rpbanconome={rp.banco_nome} rpagencian={rp.agencia_n} rpagencianome={rp.agencia_nome} rpccn={rp.cc_n} rpid={rp.id} rpclassificacao={rp.classificacao} rpstatus={rp.status} contaprovisao={rp.contaprovisao} contaexecucao={rp.contaexecucao}></PDFDownload> : null}
                                                    </div>
                                                </div>
                                                {Details ?
                                                    <>
                                                        <label className='label_datacriacao'>{rp.dataProntoParaAprovacaoProjeto}</label>
                                                        <label className='label_datacriacao'>{rp.dataAprovacaoRH}</label>
                                                        {rp.project == "MATRIZ" ? <label className='label_datacriacao'>{rp.dataAprovacaoMatriz}</label> : null}
                                                        <label className='label_datacriacao'>{rp.dataAprovacaoCompras}</label>
                                                        <label className='label_datacriacao'>{rp.dataAprovacaoAdministrativo}</label>
                                                        {rp.project != "MATRIZ" ? <label className='label_datacriacao'>{rp.dataAprovacaoMatriz}</label> : null}
                                                        <label className='label_datacriacao'>{rp.dataAprovacaoGerenciaMatriz}</label>
                                                        <label className='label_datacriacao'>{rp.dataAprovacaoContratos}</label>
                                                        <label className='label_datacriacao'>{rp.dataAprovacaoOrcamento}</label>
                                                        <label className='label_datacriacao'>{rp.financeirorecebimento}</label>
                                                    </>
                                                    : null
                                                }
                                                {!rp.lancamentoCompras && userData.project == "MATRIZ" ?
                                                    <div>
                                                        <input type={'button'} value={"Lançamento Compras"} onClick={() => lancamentoCompras(rp.id)}></input>
                                                    </div>
                                                    : null}
                                                {rp.rejectedreason ? <div className='div_rejectedreason'>
                                                    <label className='label_rejectedreason'>{rp.rejectedreason}</label>
                                                </div> : null}
                                                {!rp.aprovacaomatriz && userData.project === "MATRIZ" ?
                                                    <form onSubmit={(e) => { sendOrcamento(e, rp.id) }} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
                                                        <Select
                                                            id='orcamento'
                                                            styles={customOption}
                                                            isClearable={false}
                                                            required={true}
                                                            isSearchable={true}
                                                            className='orcamento_select'
                                                            getOptionLabel={(orçamentos) => orçamentos.orcamento}
                                                            getOptionValue={(orçamentos) => orçamentos.orcamento}
                                                            options={orçamentos.filter((orçamento) => orçamento.projeto === rp.projeto?.name).sort(function (a, b) { return b.orcamento.localeCompare(a.orcamento) })}
                                                            placeholder={"Selecione um orçamento"}
                                                            onChange={(e) => { setOrcamento(e.orcamento) }}
                                                            isLoading={orçamentos.length > 0 ? false : true}
                                                            noOptionsMessage={() => "Sem opções, é possível que seja necessário selecionar um projeto antes de continuar..."}
                                                            loadingMessage={() => "Carregando orçamentos, aguarde..."}
                                                        ></Select>
                                                        <button style={{ background: 'transparent', border: 'none' }} type={'submit'}>
                                                            <GiConfirmed className='pdf_confirm_button' size={20}>
                                                            </GiConfirmed>
                                                        </button>
                                                    </form>
                                                    : null}
                                                {PDFAnexos ?
                                                    <div>
                                                        <div onClick={handleClickDialog} style={{ height: 'auto', width: 'auto', marginTop: '1cm', position: 'relative', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'end', color: 'white' }}>
                                                            <label className='label_anexos'>Anexos</label>
                                                            {PDFViewAnexos ?
                                                                <IoIosEye style={{ position: 'absolute', left: '1.5cm', marginBottom: '1px' }}></IoIosEye>
                                                                :
                                                                <IoIosEyeOff style={{ position: 'absolute', left: '1.5cm', marginBottom: '1px' }}></IoIosEyeOff>
                                                            }
                                                        </div>
                                                    </div> : null
                                                }
                                                <div className='div_main_anexos'>
                                                    {!loadingAnexos && RPView ? RPView.map((anexo, index) => (
                                                        <div className='div_main_anexos_files'>
                                                            <label className='label_download_file' onClick={() => base64ToArrayBuffer(anexo.anexo, anexo.originalFilename, anexo.contentType)}>{anexo.originalFilename}</label>
                                                            {userData.project == "MATRIZ" && !rp.aprovacaomatriz || userData.project !== "MATRIZ" && !rp.prontoParaAprovacaoProjeto ? <div className='button_delete_anexo' onClick={() => { deleteAnexo(anexo.id, anexo.originalFilename) }}>
                                                                <MdBlock size={12}></MdBlock>
                                                            </div> : null}
                                                        </div>))
                                                        : <div className='div_main_anexos_files'>
                                                            <label style={{ color: 'white' }}>Carregando anexos...</label>
                                                        </div>}
                                                    {userData.project == "MATRIZ" && !rp.aprovacaomatriz || userData.project !== "MATRIZ" && !rp.prontoParaAprovacaoProjeto ?
                                                        <div className='div_addfiles'>
                                                            <input className='input_files' id='files' type={'file'} multiple></input>
                                                            <input onClick={() => { addFiles(rp.id) }} className='button_sendfiles' type={'button'} value="Enviar anexos"></input>
                                                        </div>
                                                        : null}
                                                </div>
                                                <dialog id='modal_dialog' className='dialog_modal'>
                                                    <div className='dialog_modal_div'>
                                                        <div className='div_backarrow'>
                                                            <button onClick={() => closeModal()} className='dialog_modal_div_button'><IoMdArrowBack className='dialog_backarrow' size={20}></IoMdArrowBack></button>
                                                        </div>
                                                        <div className='div_reject'>
                                                            <form className='div_reject_form' onSubmit={(e) => { rejectRP(e, rp.id) }}>
                                                                <div className='div_reject_desc'>
                                                                    <div className='div_reject_desc_label'>
                                                                        <label className='label_reject_desc'>Descreva as alterações a serem feitas:</label>
                                                                    </div>
                                                                    <textarea id='dialog_reason' className='dialog_reason_desc' required></textarea>
                                                                </div>
                                                                <div className='dialog_reason_submit_button'>
                                                                    <input className='reason_submit_button' type={'submit'}></input>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </dialog>
                                                {(userData.role === "GERENCIA" && rp.rp_signature1 == null) || (userData.role === "CONTROLADORIA" && rp.rp_signature2 == null) ? <input className='reject_rp' type={'button'} value={"Solicitar alterações"} onClick={() => { openModal() }}></input> : null}
                                                {userData.role === "GERENCIA" && rp.rp_signature1 == null && rp.status == false ? <input className='input_signature_gerencia' value={"Assinatura - Gerência"} type={"button"} onClick={() => signRP(rp.id, true)}></input> : userData.role === "CONTROLADORIA" && rp.rp_signature2 == null && rp.status == false ? <input className='input_signature_controladoria' value={"Assinatura - Controladoria"} type={"button"} onClick={() => signRP(rp.id, false)}></input> : null}
                                            </div>
                                            : null}
                                    </div>
                                    : null
                            ))}
                        </div>
                    </div>
                </div>
                {pages()}
                <div className='div_pagination'>
                    <ReactPaginate
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={2}
                        containerClassName='pagination'
                        breakClassName='page-break'
                        breakLinkClassName='page-breaklink'
                        pageClassName='page-item'
                        pageLinkClassName='page-link'
                        previousClassName='page-item'
                        previousLinkClassName='page-previous-next'
                        nextClassName='page-item'
                        nextLinkClassName='page-previous-next'
                        activeLinkClassName='page-active'
                        previousLabel={'<'}
                        nextLabel={'>'}
                        breakLabel={'...'}
                        forcePage={CPage}
                        pageCount={NPages.length === 0 ? 1 : NPages.length}
                        onPageChange={(e) => { setCPage(e.selected); viewpdf(null) }}>
                    </ReactPaginate>
                </div>
                <Link to={'/rp'}><div className='redirect_rps'><IoIosArrowBack size={'40px'}></IoIosArrowBack></div></Link>
                <Link to={'/modelorp'}><div className='redirect_rpsforward'><IoIosArrowForward size={'40px'}></IoIosArrowForward></div></Link>
            </div >
            {
                LoadingAnimation ?
                    <div style={{ position: 'fixed', top: '90%', right: 0 }}>
                        <FourSquare size='small' color="lightblue"></FourSquare>
                    </div>
                    : null
            }
            {
                PDFViewAnexos ?
                    <div ref={pdfViewRef} style={{ zIndex: 11, position: 'fixed', top: 10, left: 50, right: 50 }}>
                        <PDFView rpanexos={RPView} />
                    </div>
                    : null
            }
        </div >
    )
}