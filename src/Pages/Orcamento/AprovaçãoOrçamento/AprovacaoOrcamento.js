import './AprovacaoOrcamento.css'
import { useContext, useEffect, useRef, useState } from 'react'
import axiosInstance from '../../../Components/Axios/axios'
import { AuthContext } from '../../../Components/Contexts/AuthContext'
import { Tooltip } from '@mui/material'
import { PDFViewer } from '@react-pdf/renderer'
import RPpdf from '../../Controle de RPs/RPpdf'
import { GiConfirmed } from "react-icons/gi";
import { IoMdCloseCircleOutline, IoMdArrowBack, IoIosEye, IoIosEyeOff, IoIosInformationCircleOutline, IoMdArrowRoundBack, IoMdArrowDropdown, IoMdArrowDropup, IoIosClose } from "react-icons/io";
import { AiFillPlusSquare, AiFillMinusSquare, AiOutlineSearch } from "react-icons/ai"
import Head from '../../../Components/Head'
import PDFDownload from '../../Controle de RPs/PDFDownload'
import { FourSquare } from 'react-loading-indicators'
import PDFView from '../../Controle de RPs/PDFview'
import { MdBlock } from 'react-icons/md'
import Select from 'react-select'
import ReactPaginate from 'react-paginate'

export const AprovacaoOrcamento = () => {

    const [signature1, setSignature1] = useState();
    const [signature2, setSignature2] = useState();
    const [signatureContratos, setSignatureContratos] = useState()

    const { headers, userData } = useContext(AuthContext)

    const [RPs, setRPs] = useState([])

    const [RPView, setRPView] = useState(false)
    const [view, setView] = useState([false])
    const [Loading, setLoading] = useState(false)
    const [NPages, setNPages] = useState([])

    const [CPage, setCPage] = useState(0)

    const [Search, setSearch] = useState("")

    const [Filtered, setFiltered] = useState(false)

    const [Column, setColumn] = useState("count")

    const [Order, setOrder] = useState(true)

    const [CFilter, setCFilter] = useState("Todos")

    const [Period, setPeriod] = useState(0)

    const [StartDate, setStartDate] = useState()

    const [EndDate, setEndDate] = useState()

    const [Filtertype, setFiltertype] = useState("Favorecido")

    const [Details, setDetails] = useState()

    const [PDFAnexos, setPDFAnexos] = useState(false)

    const [PDFViewAnexos, setPDFViewAnexos] = useState(false)

    const [requestID, setRequestID] = useState(0)

    const [LoadingAnimation, setLoadingAnimation] = useState(false)

    const [loadingAnexos, setLoadingAnexos] = useState(false)

    const [RPID, setRPID] = useState()
    const [trigger, setTrigger] = useState(false)

    const [currentRubrica, setCurrentRubrica] = useState()
    const [CFinanceira, setCFinanceira] = useState()

    const [rejectedList, setRejectedList] = useState([])
    const [notificacaoView, setNotificacaoView] = useState(true)
    const [rejectedTrigger, setRejectedTrigger] = useState(false)

    let ref = useRef()

    useEffect(() => {
        async function rejectedList() {
            await axiosInstance.get("/rp/orcamento/rejectedlist", { headers }).then((res) => setRejectedList(res.data))
        }
        rejectedList()
    }, [rejectedTrigger])

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

    async function searchrpwfilter() {
        setView([false])
        if (Filtered === true) {
            try {
                setLoading(true)
                await axiosInstance.get(`/rp/orcamento/aprovacao?filterType=${Filtertype}&filterSearch=${Search.toUpperCase()}&page=${CPage}&days=${Period}&startDate=${StartDate}&endDate=${EndDate}&filter=${CFilter}&department=COMPRAS&role=${userData.role}&sortColumn=${Column}&order=${Order}`, { headers: headers }).then((res) => setRPs(res.data))
                setFiltered(true)
            } catch (e) {
                console.log(e)
            }
            setLoading(false)
        } else if (Filtered === false) {
            try {
                setLoading(true)
                await axiosInstance.get(`/rp/orcamento/aprovacao?filterType=${Filtertype}&filterSearch=${Search.toUpperCase()}&page=${0}&days=${Period}&startDate=${StartDate}&endDate=${EndDate}&filter=${CFilter}&department=COMPRAS&role=${userData.role}&sortColumn=${Column}&order=${Order}`, { headers: headers }).then((res) => setRPs(res.data))
                setFiltered(true)
            } catch (e) {
                console.log(e)
            }
            setLoading(false)
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

    useEffect(() => {
        searchrpwfilter()
        pages()
    }, [CPage, CFilter, Column, Order, Period, StartDate, EndDate, trigger])

    async function getAllRP() {
        setLoading(true)
        await axiosInstance.get("/rp/orcamento/aprovacao", { headers: headers }).then((res) => setRPs(res.data))
        setLoading(false)
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
                    console.log(requestData)
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

    async function aprovarRP(id, e) {
        e.preventDefault()
        if (window.confirm(`Deseja aprovar esta RP? (${id})`)) {
            await axiosInstance.patch(`/rp/orcamento/approve/${id}?rubrica=${currentRubrica.id}&classefinanceira=${CFinanceira.id}`, {}, { headers: headers })
            window.location.reload()
        }
    }

    function selectRubrica(e) {
        setCurrentRubrica(e)
        ref.current.clearValue()
    }

    async function rejectRP(e, id) {
        e.preventDefault()
        let fd = new FormData()
        if (window.confirm(`Deseja rejeitar e solicitar alterações para a RP ${id}?`)) {
            let reason = document.getElementById("dialog_reason").value
            fd.append('reason', reason)
            await axiosInstance.patch(`/rp/reject/${id}`, fd, { headers: headers })
        }
        document.getElementById("modal_dialog").close()
        alert("Efetuado com sucesso!")
        searchrpwfilter()
    }

    function showDetails() {
        setDetails(!Details)
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
            setPDFAnexos(false)
        }
    }, [RPView])

    function openDialogDevolucao() {
        document.getElementById("devolucaoDialog").showModal()
    }

    function closeModal() {
        document.getElementById("devolucaoDialog").close()
    }

    function sortColumn(e) {
        if (Column !== e) {
            setColumn(e)
            setOrder(true)
        } else {
            setOrder(!Order)
        }
    }

    function closeModalNotificacao() {
        setNotificacaoView(false)
    }

    async function rejectedRemove(e, id) {
        e.preventDefault()
        await axiosInstance.patch(`/rp/orcamento/notified/${id}`, {}, { headers })
        setRejectedTrigger(!rejectedTrigger)
    }

    return (
        <div style={{ pointerEvents: LoadingAnimation ? 'none' : 'auto' }}>
            <div>
                <Head title="Aprovação de RPs - Orçamento"></Head>
            </div>
            <div>
                <div>
                    <div className='main_filter_div'>
                        <dialog id='dialog_notificacao' className='dialog_notificacao' open={rejectedList.length > 0 && notificacaoView ? true : false}>
                            <div className='div_backarrow'>
                                <button onClick={() => closeModalNotificacao()} className='dialog_modal_div_button'><IoMdArrowBack className='dialog_backarrow' size={20}></IoMdArrowBack></button>
                            </div>
                            <div>
                                {rejectedList.map((rp) =>
                                    <div style={{ display: 'flex', flexDirection: 'row', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                        <label>{rp.notificacaoOrcamento}</label>
                                        <div onClick={(e) => rejectedRemove(e, rp.id)} className='div_remove_rejectedrp'>
                                            <IoIosClose size={25}></IoIosClose>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </dialog>
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
                    {/* <div className='main_div_filter_situacao'>
                        <div className='main_div_filter_situacao_div'>
                            <label className='label_situacao'>Situação:</label>
                            <select onChange={(e) => { setFilterandSearch(e.target.value) }}>
                                <option>Todos</option>
                                <option>Assinatura pendente</option>
                                <option>Aprovado</option>
                            </select>
                        </div>
                    </div> */}
                    <div className={LoadingAnimation || PDFViewAnexos ? 'main_div_rp_loading' : 'main_div_rp'} style={{ pointerEvents: PDFViewAnexos ? 'none' : 'auto', position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: '90%', display: 'flex', flexDirection: 'row', textAlign: 'center', gap: '20px', justifyContent: 'center', marginBottom: '10px', marginTop: '1cm', color: 'white' }}>
                            <div className='div_column'><label id='centrodecustos' style={{ fontWeight: 'bold' }} >SETOR</label></div>
                            <div className='div_column'><label id='count' onClick={(e) => sortColumn(e.target.id)}>NÚMERO DA RP</label>{Column == "count" && Order ? <IoMdArrowDropdown /> : Column == "count" && Order == false ? <IoMdArrowDropup /> : null}</div>
                            <div className='div_column'><label id='dataemissao' onClick={(e) => sortColumn(e.target.id)}>DATA DE EMISSÃO</label>{Column == "dataemissao" && Order ? <IoMdArrowDropdown /> : Column == "dataemissao" && Order == false ? <IoMdArrowDropup /> : null}</div>
                            <div className='div_column'><label id='datapagamento' onClick={(e) => sortColumn(e.target.id)}>DATA DE PAGAMENTO</label>{Column == "datapagamento" && Order ? <IoMdArrowDropdown /> : Column == "datapagamento" && Order == false ? <IoMdArrowDropup /> : null}</div>
                            <div className='div_column'><label id='favorecido' onClick={(e) => sortColumn(e.target.id)}>FAVORECIDO</label>{Column == "favorecido" && Order ? <IoMdArrowDropdown /> : Column == "favorecido" && Order == false ? <IoMdArrowDropup /> : null}</div>
                            <div className='div_column'><label id='projeto' onClick={(e) => sortColumn(e.target.id)}>PROJETO</label>{Column == "projeto" && Order ? <IoMdArrowDropdown /> : Column == "projeto" && Order == false ? <IoMdArrowDropup /> : null}</div>
                            <div className='div_column'><label id='rubrica' onClick={(e) => sortColumn(e.target.id)}>RUBRICA</label>{Column == "rubrica" && Order ? <IoMdArrowDropdown /> : Column == "rubrica" && Order == false ? <IoMdArrowDropup /> : null}</div>
                            <div className='div_column'><label id='classefinanceira' onClick={(e) => sortColumn(e.target.id)}>CLASSE FINANCEIRA</label>{Column == "classefinanceira" && Order ? <IoMdArrowDropdown /> : Column == "classefinanceira" && Order == false ? <IoMdArrowDropup /> : null}</div>
                            <div className='div_column'><label id='total' onClick={(e) => sortColumn(e.target.id)}>VALOR TOTAL</label>{Column == "total" && Order ? <IoMdArrowDropdown /> : Column == "total" && Order == false ? <IoMdArrowDropup /> : null}</div>
                            <div style={{ width: '11%' }}><label style={{ fontWeight: 'bold' }}>VISUALIZAR PDF</label></div>
                        </div>
                        {Loading ? <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}><label style={{ textAlign: "center", color: 'white' }}>Carregando...</label></div> : RPs?.content?.map((rp, index) => (
                            <div style={{ width: '90%' }} key={index}>
                                <div style={{ borderTop: '1px solid white', display: "flex", flexDirection: "row", justifyContent: "center", textAlign: "left" }}>
                                    <div style={{ width: '100%', display: "flex", flexDirection: "row", justifyContent: 'center', textAlign: 'center', gap: '20px', color: rp.status && rp.rejected ? "orange" : rp.status ? "red" : "white" }}>
                                        <div style={{ width: '11%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}><label>{rp.department}</label></div>
                                        <div style={{ width: '11%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}><label>{rp.id}</label></div>
                                        <div style={{ width: '11%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}><label>{rp.dataemissao}</label></div>
                                        <div style={{ width: '11%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}><label>{rp.datapagamento}</label></div>
                                        <Tooltip title={rp.favorecido} placement='top'><div style={{ width: '11%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}><label>{rp.favorecido ? rp.favorecido : "SEM FAVORECIDO"}</label></div></Tooltip>
                                        <div style={{ width: '11%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}><label>{rp.projeto?.name}</label></div>
                                        <Tooltip title={rp.rubrica?.code + ' - ' + rp.rubrica?.name} placement='top'><div style={{ width: '11%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}><label>{rp.rubrica ? rp.rubrica?.code + ' - ' + rp.rubrica?.name : "Indefinido"}</label></div></Tooltip>
                                        <Tooltip title={rp.classefinanceira?.code + ' - ' + rp.classefinanceira?.name} placement='top'><div style={{ width: '11%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}><label>{rp.classefinanceira ? rp.classefinanceira?.code + ' - ' + rp.classefinanceira?.name : "Indefinido"}</label></div></Tooltip>
                                        <div style={{ width: '11%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}><label>{rp.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</label></div>
                                        <div style={{ width: '11%', display: "flex", flexDirection: "row", justifyContent: "center", alignItems: 'center', flexWrap: 'nowrap' }}>
                                            <button style={{ marginTop: '4px' }} value={"Ver PDF"} onClick={async () => { setRPID(rp.id); await getSignature1(rp.rp_signature1); await getSignature2(rp.rp_signature2); await getSignatureContratos(rp.rp_signature_contratos); setCurrentRubrica(rp.rubrica); setCFinanceira(rp.classefinanceira); viewpdf(index) }}>{view[index] ? "Ocultar PDF" : "Ver PDF"}</button>
                                        </div>
                                    </div>
                                </div>
                                {view[index] ?
                                    <div style={{ position: 'relative', marginTop: "10px", marginBottom: "30px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", backgroundColor: "rgba(1, 1, 56, 0.397)", boxShadow: "5px 5px 5px 5px rgba(2, 0, 36, 0.63)", borderTop: "1px solid black", borderBottom: "1px solid black" }}>
                                        <PDFViewer style={{ height: "80vh", width: "70%" }}>
                                            <RPpdf assinatura1={signature1} assinatura2={signature2} assinaturaContratos={signatureContratos} rpaprovacaoOrcamento={rp.aprovacaoOrcamento ? "/assets/carimboOrcamento.png" : null} rplancamentocompras={rp.lancamentoCompras} rpdepartment={rp.department} documento={rp.documento} dataemissao={rp.dataemissao} datapagamento={rp.datapagamento} favorecido={rp.favorecido} centrodecustos={rp.centrodecustos?.name} debprojeto={rp.projeto?.name} rporcamento={rp.orcamento} rprubrica={rp.rubrica?.code + ' - ' + rp.rubrica?.name} rpclassefinanceira={rp.classefinanceira?.code + ' - ' + rp.classefinanceira?.name} rpitems={rp.rpitems} rpdesc={rp.desc} rptotal={rp.total} rppag={rp.pagamento} rpanexo={rp.anexo} rpanexos={RPView} rpbancon={rp.banco_n} rpbanconome={rp.banco_nome} rpagencian={rp.agencia_n} rpagencianome={rp.agencia_nome} rpccn={rp.cc_n} rpid={rp.id} rpclassificacao={rp.classificacao} rpstatus={rp.status} contaprovisao={rp.contaprovisao} contaexecucao={rp.contaexecucao}></RPpdf>
                                        </PDFViewer>
                                        <div onClick={() => { openDialogDevolucao(); console.log(rejectedList.length) }} className='div_devolucaorp'>
                                            <IoMdArrowRoundBack size={12}></IoMdArrowRoundBack>
                                            <label>Devolução</label>
                                        </div>
                                        <dialog id='devolucaoDialog' className='dialog_modal'>
                                            <div className='dialog_modal_div'>
                                                <div className='div_backarrow'>
                                                    <button onClick={() => closeModal()} className='dialog_modal_div_button'><IoMdArrowBack className='dialog_backarrow' size={20}></IoMdArrowBack></button>
                                                </div>
                                                <div className='div_reject'>
                                                    <form className='div_reject_form' onSubmit={(e) => rejectRP(e, rp.id)}>
                                                        <div className='div_reject_desc'>
                                                            <div className='div_reject_desc_label'>
                                                                <label className='label_reject_desc'>Descreva o motivo da devolução:</label>
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
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                            <label className='label_datacriacao'>{rp.datacriacao}</label>
                                            {!Details ?
                                                <AiFillPlusSquare style={{ color: 'white', marginTop: '5px' }} onClick={() => { showDetails() }}></AiFillPlusSquare>
                                                :
                                                <AiFillMinusSquare style={{ color: 'white', marginTop: '5px' }} onClick={() => { showDetails() }}></AiFillMinusSquare>
                                            }
                                        </div>
                                        {Details ?
                                            <>
                                                <label className='label_datacriacao'>{rp.dataProntoParaAprovacaoProjeto}</label>
                                                {rp.projetoEmitido == "MATRIZ" ? <label className='label_datacriacao'>{rp.dataAprovacaoMatriz}</label> : null}
                                                <label className='label_datacriacao'>{rp.dataAprovacaoRH}</label>
                                                <label className='label_datacriacao'>{rp.dataAprovacaoCompras}</label>
                                                <label className='label_datacriacao'>{rp.dataAprovacaoAdministrativo}</label>
                                                {rp.projetoEmitido != "MATRIZ" ? <label className='label_datacriacao'>{rp.dataAprovacaoMatriz}</label> : null}
                                                <label className='label_datacriacao'>{rp.dataAprovacaoGerenciaMatriz}</label>
                                                <label className='label_datacriacao'>{rp.dataAprovacaoContratos}</label>
                                                <label className='label_datacriacao'>{rp.dataAprovacaoOrcamento}</label>
                                                <label className='label_datacriacao'>{rp.financeirorecebimento}</label>
                                            </>
                                            : null
                                        }
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
                                        {rp.rejectedreason ? <div className='div_rejectedreason'>
                                            <label className='label_rejectedreason'>{rp.rejectedreason}</label>
                                        </div> : null}
                                        <div className='div_main_anexos'>
                                            {!loadingAnexos && RPView ? RPView.map((anexo, index) => (
                                                <div className='div_main_anexos_files'>
                                                    <label className='label_download_file' onClick={() => base64ToArrayBuffer(anexo.anexo, anexo.originalFilename, anexo.contentType)}>{anexo.originalFilename}</label>
                                                </div>))
                                                : <div className='div_main_anexos_files'>
                                                    <label style={{ color: 'white' }}>Carregando anexos...</label>
                                                </div>}
                                        </div>
                                        <form onSubmit={(e) => aprovarRP(rp.id, e)} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
                                            <div style={{ color: 'white', display: 'flex', flexDirection: 'row', padding: '30px' }}>
                                                <div style={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
                                                    <label>Rubrica: </label>
                                                    <Select
                                                        className='orcamento_select'
                                                        placeholder={"Selecione uma rubrica"}
                                                        id='rubricaSelect'
                                                        isClearable={true}
                                                        required={true}
                                                        isSearchable={true}
                                                        defaultValue={(rp.rubrica)}
                                                        getOptionValue={(rubricalist) => rubricalist?.id}
                                                        getOptionLabel={(rubricalist) => rubricalist?.code + ' - ' + rubricalist?.name}
                                                        options={rp.projeto?.rubricas?.sort(function (a, b) { return a.code.localeCompare(b.code) })}
                                                        noOptionsMessage={() => "Sem opções, é possível que seja necessário selecionar um projeto para continuar"}
                                                        onChange={(e) => { selectRubrica(e) }}
                                                    >
                                                    </Select>
                                                </div>
                                                <div style={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
                                                    <label>Classe Financeira: </label>
                                                    <Select
                                                        ref={ref}
                                                        className='orcamento_select'
                                                        placeholder={"Selecione uma classe financeira"}
                                                        id='cfinanceiraSelect'
                                                        required={true}
                                                        isClearable={true}
                                                        isSearchable={true}
                                                        defaultValue={rp.classefinanceira}
                                                        getOptionValue={(cfinanceiralist) => cfinanceiralist.id}
                                                        getOptionLabel={(cfinanceiralist) => cfinanceiralist.code + ' - ' + cfinanceiralist.name}
                                                        options={currentRubrica?.classefinanceira?.sort(function (a, b) { return a.code.localeCompare(b.code) })}
                                                        noOptionsMessage={() => "Sem opções, é possível que seja necessário selecionar uma rubrica para continuar"}
                                                        onChange={(e) => { setCFinanceira(e) }}
                                                    >
                                                    </Select>
                                                </div>
                                            </div>
                                            <input type={'submit'} value={'Enviar'}></input>
                                        </form>
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
                                    </div>
                                    : null}
                            </div>
                        ))}
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
                    </div>
                    {LoadingAnimation ?
                        <div style={{ position: 'fixed', top: '90%', right: 0 }}>
                            <FourSquare size='small' color="lightblue"></FourSquare>
                        </div>
                        : null}
                    {PDFViewAnexos ?
                        <div ref={pdfViewRef} style={{ zIndex: 11, position: 'fixed', top: 10, left: 50, right: 50 }}>
                            <PDFView rpanexos={RPView} />
                        </div>
                        : null}
                </div>
            </div>
        </div>
    )
}