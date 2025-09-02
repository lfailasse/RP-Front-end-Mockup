import { PDFViewer } from '@react-pdf/renderer'
import './FinanceiroRP.css'
import { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../../../Components/Contexts/AuthContext'
import { AiFillMinusSquare, AiFillPlusSquare, AiOutlineSearch } from 'react-icons/ai'
import { IoIosEye, IoIosEyeOff, IoIosInformationCircleOutline, IoMdArrowBack, IoMdArrowDropdown, IoMdArrowDropup, IoMdArrowRoundBack } from 'react-icons/io'
import { GiConfirmed } from "react-icons/gi";
import ReactPaginate from 'react-paginate'
import axiosInstance from '../../../Components/Axios/axios'
import { Tooltip } from '@mui/material'
import Head from '../../../Components/Head'
import RPpdf from '../RPpdf'
import { isMobile } from 'react-device-detect'
import PDFDownload from '../PDFDownload'
import { FourSquare } from 'react-loading-indicators'
import PDFView from '../PDFview'

export const FinanceiroRP = () => {

    const { headers, userData } = useContext(AuthContext)

    const [RPs, setRPs] = useState([null])

    const [view, setView] = useState([false])

    const [NPages, setNPages] = useState([])

    const [CPage, setCPage] = useState(0)

    const [Search, setSearch] = useState("")

    const [Filtered, setFiltered] = useState(false)

    const [Period, setPeriod] = useState(0)

    const [StartDate, setStartDate] = useState()

    const [EndDate, setEndDate] = useState()

    const [Loading, setLoading] = useState(false)

    const [Filtertype, setFiltertype] = useState("Favorecido")

    const [CFilter, setCFilter] = useState("Em aberto")

    const [Column, setColumn] = useState("count")

    const [Order, setOrder] = useState(true)

    const [SelectedRP, setSelectedRP] = useState()

    const [Checked, setChecked] = useState(false)

    const [ValueChecked, setValueChecked] = useState(false)

    const [ValorFinal, setValorFinal] = useState()

    const [RPView, setRPView] = useState()

    const [signature1, setSignature1] = useState();
    const [signature2, setSignature2] = useState();
    const [signatureContratos, setSignatureContratos] = useState()

    const [Details, setDetails] = useState()

    const [PDFAnexos, setPDFAnexos] = useState(false)
    const [loadingRP, setLoadingRP] = useState(false)
    const [LoadingAnimation, setLoadingAnimation] = useState(false)

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
        searchrpwfilter()
        pages()
    }, [CPage, CFilter, Column, Order, Period, StartDate, EndDate])

    const [RPID, setRPID] = useState()
    const [trigger, setTrigger] = useState(false)
    const [requestID, setRequestID] = useState(0)
    const [loadingAnexos, setLoadingAnexos] = useState(false)

    const requestNumber = requestID
    const abortController = new AbortController()
    const signal = abortController.signal


    useEffect(() => {


        async function getRP(id) {
            setLoadingAnexos(true)
            setRPView([])

            if (id) {
                try {
                    getSignature1(id)
                    getSignature2(id)
                    getSignatureContratos(id)
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
            searchrpwfilter()
        }
        setRequestID((prevID) => prevID + 1)

        return () => {
            abortController.abort()
        }
    }, [RPID, trigger])

    useEffect(() => {

        let pdf = false
        if (RPView?.length > 0) {
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

    async function searchrpwfilter() {
        setView([false])
        if (Filtered === true) {
            try {
                setLoading(true)
                if (Filtertype === "Número da RP") {
                    await axiosInstance.get(`/rp/financeirorps?id=${Search.toUpperCase()}&page=${CPage}&days=${Period}&startDate=${StartDate}&endDate=${EndDate}&filter=${CFilter}&sortColumn=${Column}&order=${Order}`, { headers: headers }).then((res) => setRPs(res.data))
                    setFiltered(true)
                } else if (Filtertype === "Favorecido") {
                    await axiosInstance.get(`/rp/financeirorps?fav=${Search.toUpperCase()}&id=&page=${CPage}&days=${Period}&startDate=${StartDate}&endDate=${EndDate}&filter=${CFilter}&sortColumn=${Column}&order=${Order}`, { headers: headers }).then((res) => setRPs(res.data))
                    setFiltered(true)
                }
            } catch (e) {
                console.log(e)
            }
            setLoading(false)
        } else if (Filtered === false) {
            try {
                setLoading(true)
                if (Filtertype === "Número da RP") {
                    await axiosInstance.get(`/rp/financeirorps?id=${Search.toUpperCase()}&page=${0}&days=${Period}&startDate=${StartDate}&endDate=${EndDate}&filter=${CFilter}&sortColumn=${Column}&order=${Order}`, { headers: headers }).then((res) => setRPs(res.data))
                    setFiltered(true)
                } else if (Filtertype === "Favorecido") {
                    await axiosInstance.get(`/rp/financeirorps?fav=${Search.toUpperCase()}&id=&page=${0}&days=${Period}&startDate=${StartDate}&endDate=${EndDate}&filter=${CFilter}&sortColumn=${Column}&order=${Order}`, { headers: headers }).then((res) => setRPs(res.data))
                    setFiltered(true)
                }
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


    function setperiod(e) {
        switch (e) {
            case 'Todo o período':
                setPeriod(0)
                break;
            case 'Próximos 7 dias':
                setPeriod(7)
                break;
            case 'Próximos 15 dias':
                setPeriod(15)
                break;
            case 'Próximos 30 dias':
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

    async function confirmRP(id) {
        console.log("aa")
        var today = new Date();
        var fd = new FormData()
        today.toLocaleString("pt-BR")
        today = new Date()
        fd.append("id", new Blob([id], { type: "application/json" }))
        fd.append("status", new Blob(["Recebido"], { type: "application/json" }))
        fd.append('date', new Blob([today], { type: "application/json" }))
        fd.append('user', new Blob([userData.name], { type: "application/json" }))
        await axiosInstance.patch("/rp/financeirorps", fd, { headers: headers })
        searchrpwfilter()
    }

    function setFilterandSearch(e) {
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


    function getRP(id) {
        axiosInstance.get(`/rp/financeirorps/${id}`, { headers: headers }).then((res) => setRPView(res.data))
    }

    function sortColumn(e) {
        if (Column !== e) {
            setColumn(e)
            setOrder(true)
        } else {
            setOrder(!Order)
        }
    }

    const pdfViewRef = useRef()
    const [PDFViewAnexos, setPDFViewAnexos] = useState(false)
    const [isClickingInside, setIsClickingInside] = useState(false)

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

    function showDetails() {
        setDetails(!Details)
    }

    function openDialogDevolucao() {
        document.getElementById("devolucaoDialog").showModal()
    }

    function closeModal() {
        document.getElementById("devolucaoDialog").close()
    }

    async function rejectRP(e, id) {
        e.preventDefault()
        let fd = new FormData()
        if (window.confirm(`Deseja rejeitar e solicitar alterações para a RP ${id}?`)) {
            let department = document.getElementById("dialog_select_department").value
            let reason = document.getElementById("dialog_reason").value
            fd.append('department', department)
            fd.append('reason', reason)
            await axiosInstance.patch(`/rp/reject/${id}`, fd, { headers: headers })
        }
        document.getElementById("devolucaoDialog").close()
        setTrigger(!trigger)
    }

    return (
        <div style={{ pointerEvents: LoadingAnimation ? 'none' : 'auto' }}>
            <div style={{ pointerEvents: PDFViewAnexos ? 'none' : 'auto' }} className={LoadingAnimation || PDFViewAnexos ? 'main_div_rp_loading' : 'main_div_rp'}>
                <Head title="Controle de RPs - Financeiro">/</Head>
                <div>
                    <div>
                        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: "2cm" }}>
                            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginBottom: "5px" }}>
                                <label style={{ color: "white" }}>Pesquisar por filtro</label>
                            </div>
                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                <form style={{ display: "flex", flexDirection: "row", justifyContent: "center" }} onSubmit={(e) => { e.preventDefault(); searchrpwfilter(); setRPs(null) }}>
                                    <div>
                                        <select className='RP_selection_filter' onChange={(e) => setFiltertype(e.target.value)}>
                                            <option>Favorecido</option>
                                            <option>Número da RP</option>
                                        </select>
                                    </div>
                                    <input type={"text"} onChange={(e) => { setSearch(e.target.value); setFiltered(false) }}></input>
                                    <button type={"submit"} style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                        <AiOutlineSearch></AiOutlineSearch>
                                    </button>
                                </form>
                                <div className='div_periodo'>
                                    <select className='RP_date_filter' onChange={(e) => setperiod(e.target.value)}>
                                        <option>Todo o período</option>
                                        <option>Próximos 7 dias</option>
                                        <option>Próximos 15 dias</option>
                                        <option>Próximos 30 dias</option>
                                        <option>Período informado</option>
                                    </select>
                                    <div>
                                        <Tooltip placement='right' title={"A data do período corresponde a data de vencimento para o pagamento da RP"} enterDelay={50} leaveDelay={50}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                                <IoIosInformationCircleOutline size={20} className='rp_date_filter_info'></IoIosInformationCircleOutline>
                                            </div>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                            {Period == 4 ?
                                <div className='rp_datainformada'>
                                    <div>
                                        <label>Data início:</label>
                                        <input id='startdaterp' onChange={(e) => { setInformedDate(e) }} style={{ marginLeft: '5px' }} type={"date"} min={"2000-01-01"} max={"2030-01-01"}></input>
                                    </div>
                                    <div>
                                        <label>Data fim:</label>
                                        <input id='enddaterp' onChange={(e) => setInformedDate(e)} style={{ marginLeft: '5px' }} type={"date"} min={"2000-01-01"} max={"2030-01-01"}></input>
                                    </div>
                                </div>
                                : null}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginBottom: "15px" }}>
                            <div style={{ width: "50%", display: "flex", flexDirection: "row", justifyContent: 'end' }}>
                                <label style={{ color: "white", marginRight: "5px" }}>Situação:</label>
                                <select onChange={(e) => { setFilterandSearch(e.target.value) }} style={{ width: "15%" }}>
                                    <option>Em aberto</option>
                                    <option>Recebido</option>
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
                            {Loading ? <div className='div_main_info_columns'><label className='div_info_columns_loading_label'>Carregando...</label></div> : RPs?.content?.map((rp, index) => (
                                <div className='div_main_info_column' key={index}>
                                    <div className={isMobile ? rp.status && rp.rejected && view[index] ? 'div_info_columns_rejected_opened' : rp.status && rp.rejected ? 'div_info_columns_rejected' : rp.status && view[index] ? "div_info_columns_canceled_opened" : rp.status ? "div_info_columns_canceled" : view[index] ? "div_info_columns_opened" : 'div_info_columns' : 'div_info_columns'}>
                                        <div className='div_info_column' onClick={isMobile ? () => { setRPID(rp.id); getSignature1(rp.rp_signature1); getSignature2(rp.rp_signature2); getSignatureContratos(rp.rp_signature_contratos); viewpdf(index) } : null} style={{ color: rp.status && rp.rejected ? "orange" : rp.status ? "red" : "white" }}>
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
                                                <button className='button_visualizarpdf' value={"Ver PDF"} onClick={async () => { setRPID(rp.id); await getSignature1(rp.rp_signature1); await getSignature2(rp.rp_signature2); await getSignatureContratos(rp.rp_signature_contratos); viewpdf(index); }}>{view[index] ? "Ocultar PDF" : "Ver PDF"}</button>
                                            </div>
                                            {/* {rp.financeirostatus != "Pago" ? <div onClick={() => { setSelectedRP(rp.id); openModal() }} style={{ marginTop: '4px', position: 'absolute', right: '40px', display: "flex", justifyContent: "center", alignItems: "center" }}><GiConfirmed className='pdf_confirm' size={20}></GiConfirmed></div>
                                                : <div style={{ marginTop: '4px', position: 'absolute', right: '40px', display: "flex", justifyContent: "center", alignItems: "center" }}><GiConfirmed className='pdf_confirmed' size={20}></GiConfirmed></div>} */}
                                        </div>
                                    </div>
                                    {
                                        view[index] ?
                                            !loadingRP ?
                                                <div style={{ position: 'relative', marginTop: "10px", marginBottom: "30px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", backgroundColor: "rgba(1, 1, 56, 0.397)", boxShadow: "5px 5px 5px 5px rgba(2, 0, 36, 0.63)", borderTop: "1px solid black", borderBottom: "1px solid black" }}>
                                                    <PDFViewer style={{ height: "80vh", width: "70%" }}>
                                                        <RPpdf assinatura1={signature1} assinatura2={signature2} assinaturaContratos={signatureContratos} rpaprovacaoOrcamento={"/assets/carimboOrcamento.png"} rplancamentocompras={rp.lancamentoCompras} rpdepartment={rp.department} documento={rp.documento} dataemissao={rp.dataemissao} datapagamento={rp.datapagamento} favorecido={rp.favorecido} centrodecustos={rp.centrodecustos?.name} debprojeto={rp.projeto?.name} rporcamento={rp.orcamento} rprubrica={rp.rubrica?.code + ' - ' + rp.rubrica?.name} rpclassefinanceira={rp.classefinanceira?.code + ' - ' + rp.classefinanceira?.name} rpitems={rp.rpitems} rpdesc={rp.desc} rptotal={rp.total} rppag={rp.pagamento} rpanexo={rp.anexo} rpanexos={RPView} rpbancon={rp.banco_n} rpbanconome={rp.banco_nome} rpagencian={rp.agencia_n} rpagencianome={rp.agencia_nome} rpccn={rp.cc_n} rpid={rp.id} rpclassificacao={rp.classificacao} rpstatus={rp.status} contaprovisao={rp.contaprovisao} contaexecucao={rp.contaexecucao}></RPpdf>
                                                    </PDFViewer>
                                                    <div onClick={() => openDialogDevolucao()} className='div_devolucaorp'>
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
                                                                    <div>
                                                                        <label style={{ fontSize: '14px', marginRight: '5px' }}>Setor para devolução:</label>
                                                                        <select id='dialog_select_department'>
                                                                            <option>{rp.department}</option>
                                                                            <option>ORCAMENTO</option>
                                                                        </select>
                                                                    </div>
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
                                                        <div className='div_downloadpdf'>
                                                            {rp ? <PDFDownload id={rp.id} assinatura1={signature1} assinatura2={signature2} assinaturaContratos={signatureContratos} rpaprovacaoOrcamento={rp.aprovacaoOrcamento ? "/assets/carimboOrcamento.png" : null} rplancamentocompras={rp.lancamentoCompras} rpdepartment={rp.department} documento={rp.documento} dataemissao={rp.dataemissao} datapagamento={rp.datapagamento} favorecido={rp.favorecido} centrodecustos={rp.centrodecustos?.name} debprojeto={rp.projeto?.name} rporcamento={rp.orcamento} rprubrica={rp.rubrica?.code + ' - ' + rp.rubrica?.name} rpclassefinanceira={rp.classefinanceira?.code + ' - ' + rp.classefinanceira?.name} rpitems={rp.rpitems} rpdesc={rp.desc} rptotal={rp.total} rppag={rp.pagamento} rpanexo={rp.anexo} rpanexos={RPView} rpbancon={rp.banco_n} rpbanconome={rp.banco_nome} rpagencian={rp.agencia_n} rpagencianome={rp.agencia_nome} rpccn={rp.cc_n} rpid={rp.id} rpclassificacao={rp.classificacao} rpstatus={rp.status} contaprovisao={rp.contaprovisao} contaexecucao={rp.contaexecucao} onDownloadComplete={() => confirmRP(rp.id)}></PDFDownload> : null}
                                                        </div>
                                                    </div>
                                                    {Details ?
                                                        <>
                                                            <label className='label_datacriacao'>{rp.dataProntoParaAprovacaoProjeto}</label>
                                                            <label className='label_datacriacao'>{rp.dataAprovacaoRH}</label>
                                                            <label className='label_datacriacao'>{rp.dataAprovacaoCompras}</label>
                                                            <label className='label_datacriacao'>{rp.dataAprovacaoAdministrativo}</label>
                                                            <label className='label_datacriacao'>{rp.dataAprovacaoGerenciaMatriz}</label>
                                                            <label className='label_datacriacao'>{rp.dataAprovacaoContratos}</label>
                                                            <label className='label_datacriacao'>{rp.dataAprovacaoOrcamento}</label>
                                                            <label className='label_datacriacao'>{rp.financeirorecebimento}</label>
                                                        </>
                                                        : null
                                                    }
                                                    {rp.rejectedreason ? <div className='div_rejectedreason'>
                                                        <label className='label_rejectedreason'>Alterações solicitadas: {rp.rejectedreason}</label>
                                                    </div> : null}
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
                                                            </div>))
                                                            : <div className='div_main_anexos_files'>
                                                                <label style={{ color: 'white' }}>Carregando anexos...</label>
                                                            </div>}
                                                    </div>
                                                    {/*{rp.valorfinal ? <label style={{ color: 'white' }}>Valor final - {rp.valorfinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</label> : null}
                                                    {rp.observacao ? <label style={{ color: 'white' }} >Obs.: {rp.observacao}</label> : null}
                                                    {rp.financeiropagamento ? <div>
                                                        <label style={{ color: 'white', marginTop: '1cm' }}>Comprovantes financeiro</label>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', marginBottom: '10px' }}>
                                                            {rp.rpfanexos ? rp.rpfanexos.map((anexo, index) => (
                                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', color: 'white', fontSize: '9px' }}>
                                                                    <label className='label_download_file' onClick={() => base64ToArrayBuffer(anexo.anexo, anexo.originalFilename, anexo.contentType)}>{anexo.originalFilename}</label>
                                                                </div>))
                                                                : null}
                                                        </div>
                                                    </div>
                                                        : null} */}
                                                </div>
                                                : "Carregando..."
                                            : null}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {pages()}
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
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
        </div >
    )
}