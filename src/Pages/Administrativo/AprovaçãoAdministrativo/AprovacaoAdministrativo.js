import './AprovacaoAdministrativo.css'
import { useContext, useEffect, useRef, useState } from 'react'
import axiosInstance from '../../../Components/Axios/axios'
import { AuthContext } from '../../../Components/Contexts/AuthContext'
import { Tooltip } from '@mui/material'
import { PDFViewer } from '@react-pdf/renderer'
import RPpdf from '../../Controle de RPs/RPpdf'
import { GiConfirmed } from "react-icons/gi";
import { IoMdCloseCircleOutline, IoMdArrowBack, IoIosEye, IoIosEyeOff } from "react-icons/io";
import { AiFillPlusSquare, AiFillMinusSquare } from "react-icons/ai"
import Head from '../../../Components/Head'
import PDFDownload from '../../Controle de RPs/PDFDownload'
import { FourSquare } from 'react-loading-indicators'
import PDFView from '../../Controle de RPs/PDFview'
import { MdBlock } from 'react-icons/md'

export const AprovacaoAdministrativo = () => {

    const [signature1, setSignature1] = useState();
    const [signature2, setSignature2] = useState();

    const { headers, userData } = useContext(AuthContext)

    const [RPs, setRPs] = useState([])

    const [RPView, setRPView] = useState(false)
    const [view, setView] = useState([false])
    const [Loading, setLoading] = useState(false)

    const [Details, setDetails] = useState()

    const [PDFAnexos, setPDFAnexos] = useState(false)

    const [PDFViewAnexos, setPDFViewAnexos] = useState(false)

    const [requestID, setRequestID] = useState(0)

    const [LoadingAnimation, setLoadingAnimation] = useState(false)

    const [loadingAnexos, setLoadingAnexos] = useState(false)

    const [RPID, setRPID] = useState()
    const [trigger, setTrigger] = useState(false)

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

    useEffect(() => {
        getAllRP()
    }, [])

    async function getAllRP() {
        setLoading(true)
        await axiosInstance.get("/rp/administrativo/aprovacao", { headers: headers }).then((res) => setRPs(res.data))
        setLoading(false)
    }

    async function deleteAnexo(id, name) {
        if (window.confirm(`Deseja deletar o anexo ${name}?`)) {
            setLoadingAnimation(true)
            await axiosInstance.delete(`/rp/anexosrp/${id}`, { headers })
            setLoadingAnimation(false)
        }
        setTrigger(!trigger)
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


    async function aprovarRP(id) {
        if (window.confirm(`Deseja aprovar esta RP? (${id})`)) {
            await axiosInstance.patch(`/rp/administrativo/approve/${id}`, {}, { headers: headers })
            getAllRP()
        }
    }

    function openModal() {
        document.getElementById("modal_dialog").showModal()
    }

    function closeModal() {
        document.getElementById("modal_dialog").close()
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
        getAllRP()
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

    return (
        <div style={{ pointerEvents: LoadingAnimation ? 'none' : 'auto' }}>
            <div>
                <Head title="Aprovação de RPs - Administrativo"></Head>
            </div>
            <div className={LoadingAnimation || PDFViewAnexos ? 'main_div_rp_loading' : 'main_div_rp'} style={{ pointerEvents: PDFViewAnexos ? 'none' : 'auto', position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '90%', display: 'flex', flexDirection: 'row', textAlign: 'center', gap: '20px', justifyContent: 'center', marginBottom: '10px', marginTop: '1cm', color: 'white' }}>
                    <div className='div_column'><label id='count' style={{ fontWeight: 'bold' }}>NÚMERO DA RP</label></div>
                    <div className='div_column'><label id='dataemissao' style={{ fontWeight: 'bold' }}>DATA DE EMISSÃO</label></div>
                    <div className='div_column'><label id='datapagamento' style={{ fontWeight: 'bold' }}>DATA DE PAGAMENTO</label></div>
                    <div className='div_column'><label id='favorecido' style={{ fontWeight: 'bold' }} >FAVORECIDO</label></div>
                    <div className='div_column'><label id='projeto' style={{ fontWeight: 'bold' }} >PROJETO</label></div>
                    <div className='div_column'><label id='centrodecustos' style={{ fontWeight: 'bold' }} >CENTRO DE CUSTO</label></div>
                    <div className='div_column'><label id='rubrica' style={{ fontWeight: 'bold' }} >RUBRICA</label></div>
                    <div className='div_column'><label id='classefinanceira' style={{ fontWeight: 'bold' }} >CLASSE FINANCEIRA</label></div>
                    <div className='div_column'><label id='total' style={{ fontWeight: 'bold' }} >VALOR TOTAL</label></div>
                    <div style={{ width: '11%' }}><label style={{ fontWeight: 'bold' }}>VISUALIZAR PDF</label></div>
                </div>
                {Loading ? <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}><label style={{ textAlign: "center", color: 'white' }}>Carregando...</label></div> : RPs?.map((rp, index) => (
                    <div style={{ width: '90%' }} key={index}>
                        <div style={{ borderTop: '1px solid white', display: "flex", flexDirection: "row", justifyContent: "center", textAlign: "left" }}>
                            <div style={{ width: '100%', display: "flex", flexDirection: "row", justifyContent: 'center', textAlign: 'center', gap: '20px', color: rp.status && rp.rejected ? "orange" : rp.status ? "red" : "white" }}>
                                <div style={{ width: '11%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}><label>{rp.id}</label></div>
                                <div style={{ width: '11%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}><label>{rp.dataemissao}</label></div>
                                <div style={{ width: '11%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}><label>{rp.datapagamento}</label></div>
                                <Tooltip title={rp.favorecido} placement='top'><div style={{ width: '11%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}><label>{rp.favorecido ? rp.favorecido : "SEM FAVORECIDO"}</label></div></Tooltip>
                                <div style={{ width: '11%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}><label>{rp.projeto?.name}</label></div>
                                <div style={{ width: '11%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}><label>{rp.centrodecustos?.name}</label></div>
                                <Tooltip title={rp.rubrica?.code + ' - ' + rp.rubrica?.name} placement='top'><div style={{ width: '11%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}><label>{rp.rubrica?.code + ' - ' + rp.rubrica?.name}</label></div></Tooltip>
                                <Tooltip title={rp.classefinanceira?.code + ' - ' + rp.classefinanceira?.name} placement='top'><div style={{ width: '11%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}><label>{rp.classefinanceira?.code + ' - ' + rp.classefinanceira?.name}</label></div></Tooltip>
                                <div style={{ width: '11%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}><label>{rp.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</label></div>
                                <div style={{ width: '11%', display: "flex", flexDirection: "row", justifyContent: "center", alignItems: 'center', flexWrap: 'nowrap' }}>
                                    <button style={{ marginTop: '4px' }} value={"Ver PDF"} onClick={() => { setRPID(rp.id); viewpdf(index); getSignature1(rp.rp_signature1); getSignature2(rp.rp_signature2) }}>{view[index] ? "Ocultar PDF" : "Ver PDF"}</button>
                                </div>
                            </div>
                        </div>
                        {view[index] ?
                            <div className='div_pdfview_info'>
                                <PDFViewer style={{ height: "80vh", width: "70%" }}>
                                    <RPpdf assinatura1={signature1} assinatura2={signature2} rpaprovacaoOrcamento={rp.aprovacaoOrcamento ? "/assets/carimboOrcamento.png" : null} rplancamentocompras={rp.lancamentoCompras} rpdepartment={rp.department} documento={rp.documento} dataemissao={rp.dataemissao} datapagamento={rp.datapagamento} favorecido={rp.favorecido} centrodecustos={rp.centrodecustos?.name} debprojeto={rp.projeto?.name} rporcamento={rp.orcamento} rprubrica={rp.rubrica?.code + ' - ' + rp.rubrica?.name} rpclassefinanceira={rp.classefinanceira?.code + ' - ' + rp.classefinanceira?.name} rpitems={rp.rpitems} rpdesc={rp.desc} rptotal={rp.total} rppag={rp.pagamento} rpanexo={rp.anexo} rpanexos={RPView} rpbancon={rp.banco_n} rpbanconome={rp.banco_nome} rpagencian={rp.agencia_n} rpagencianome={rp.agencia_nome} rpccn={rp.cc_n} rpid={rp.id} rpclassificacao={rp.classificacao} rpstatus={rp.status} contaprovisao={rp.contaprovisao} contaexecucao={rp.contaexecucao}></RPpdf>
                                </PDFViewer>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                    <label className='label_datacriacao'>{rp.datacriacao}</label>
                                    {!Details ?
                                        <AiFillPlusSquare style={{ color: 'white', marginTop: '5px' }} onClick={() => { showDetails() }}></AiFillPlusSquare>
                                        :
                                        <AiFillMinusSquare style={{ color: 'white', marginTop: '5px' }} onClick={() => { showDetails() }}></AiFillMinusSquare>
                                    }
                                    <div className='div_downloadpdf'>
                                        {rp ? <PDFDownload assinatura1={signature1} assinatura2={signature2} rpaprovacaoOrcamento={rp.aprovacaoOrcamento ? "/assets/carimboOrcamento.png" : null} rplancamentocompras={rp.lancamentoCompras} rpdepartment={rp.department} documento={rp.documento} dataemissao={rp.dataemissao} datapagamento={rp.datapagamento} favorecido={rp.favorecido} centrodecustos={rp.centrodecustos?.name} debprojeto={rp.projeto?.name} rporcamento={rp.orcamento} rprubrica={rp.rubrica?.code + ' - ' + rp.rubrica?.name} rpclassefinanceira={rp.classefinanceira?.code + ' - ' + rp.classefinanceira?.name} rpitems={rp.rpitems} rpdesc={rp.desc} rptotal={rp.total} rppag={rp.pagamento} rpanexo={rp.anexo} rpanexos={RPView} rpbancon={rp.banco_n} rpbanconome={rp.banco_nome} rpagencian={rp.agencia_n} rpagencianome={rp.agencia_nome} rpccn={rp.cc_n} rpid={rp.id} rpclassificacao={rp.classificacao} rpstatus={rp.status} contaprovisao={rp.contaprovisao} contaexecucao={rp.contaexecucao}></PDFDownload> : null}
                                    </div>
                                </div>
                                {Details ?
                                    <>
                                        <label className='label_datacriacao'>{rp.dataAprovacaoRH}</label>
                                        <label className='label_datacriacao'>{rp.dataAprovacaoCompras}</label>
                                        <label className='label_datacriacao'>{rp.dataAprovacaoAdministrativo}</label>
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
                                            <div className='button_delete_anexo' onClick={() => { deleteAnexo(anexo.id, anexo.originalFilename) }}>
                                                <MdBlock size={12}></MdBlock>
                                            </div>
                                        </div>))
                                        : <div className='div_main_anexos_files'>
                                            <label style={{ color: 'white' }}>Carregando anexos...</label>
                                        </div>}
                                    <div className='div_addfiles'>
                                        <input className='input_files' id='files' type={'file'} multiple></input>
                                        <input onClick={() => { addFiles(rp.id) }} className='button_sendfiles' type={'button'} value="Enviar anexos"></input>
                                    </div>
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
                                {userData.role === "COORDENADOR ADMINISTRATIVO" ?
                                    <>
                                        <div className='confirm_icon' onClick={() => aprovarRP(rp.id)}>
                                            <GiConfirmed size={18}></GiConfirmed>
                                            <label>Aprovar</label>
                                        </div>
                                        <div className='reject_icon' onClick={() => openModal()}>
                                            <IoMdCloseCircleOutline size={20}></IoMdCloseCircleOutline>
                                            <label>Rejeitar</label>
                                        </div>
                                    </> : null}
                            </div>
                            : null}

                    </div>
                ))}
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
    )
}