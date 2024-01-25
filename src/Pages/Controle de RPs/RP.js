import { PDFViewer } from '@react-pdf/renderer'
import Head from '../../Components/Head'
import './RP.css'
import RPpdf from './RPpdf'
import { useContext, useEffect, useState } from 'react'
import Axios from 'axios'
import { AuthContext } from '../../Components/Contexts/AuthContext'
import { AiOutlineSearch, AiFillEdit } from 'react-icons/ai'
import { FaTrash } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { IoIosArrowBack } from 'react-icons/io'
import { MdBlock } from "react-icons/md";
import ReactPaginate from 'react-paginate'
import axiosInstance from '../../Components/Axios/axios'

export const RP = () => {

    const { headers } = useContext(AuthContext)

    const [RPs, setRPs] = useState([null])

    const [view, setView] = useState([false])

    const [NPages, setNPages] = useState([])

    const [CPage, setCPage] = useState(0)

    const [Search, setSearch] = useState("")

    const [Filtered, setFiltered] = useState(false)

    const [Loading, setLoading] = useState(false)

    const [Filtertype, setFiltertype] = useState("Número da RP")


    useEffect(() => {
        if (Filtered === false) {
            get()
        } else {
            searchrpwfilter()
        }
        pages()
    }, [CPage])

    async function get() {
        try {
            setLoading(true)
            await axiosInstance.get(`/rp?page=${CPage}`, { headers: headers }).then((res) => setRPs(res.data))
            setFiltered(false)
        } catch (e) {
            console.log(e)
        }
        setLoading(false)
    }

    async function searchrpwfilter() {
        if (Filtered === true) {
            try {
                setLoading(true)
                if (Filtertype === "Número da RP") {
                    await axiosInstance.get(`/rp/search?id=${Search.toUpperCase()}&page=${CPage}`, { headers: headers }).then((res) => setRPs(res.data))
                    setFiltered(true)
                } else if (Filtertype === "Favorecido") {
                    await axiosInstance.get(`/rp/search?fav=${Search.toUpperCase()}&id=&page=${CPage}`, { headers: headers }).then((res) => setRPs(res.data))
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
                    await axiosInstance.get(`/rp/search?id=${Search.toUpperCase()}&page=${0}`, { headers: headers }).then((res) => setRPs(res.data))
                    setFiltered(true)
                } else if (Filtertype === "Favorecido") {
                    await axiosInstance.get(`/rp/search?fav=${Search.toUpperCase()}&id=&page=${0}`, { headers: headers }).then((res) => setRPs(res.data))
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

    function cancelRP(e) {
        if (window.confirm(`Deseja cancelar esta RP? (${e})`)) {
            try {
                axiosInstance.patch(`/rp/cancel/${e}`, {}, { headers: headers })
                alert("Cancelada com sucesso!")
                if (Filtered === false) {
                    get()
                } else {
                    searchrpwfilter()
                }
                pages()
            } catch(e) {
                alert("Erro ao cancelar a RP")
            }
        }
    }

    return (
        <div style={{ marginBottom: "2cm" }}>
            <Head title="Controle de RPs">/</Head>
            <div>
                <div style={{ marginBottom: "2cm" }}>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginBottom: "5px" }}>
                        <label style={{ color: "white" }}>Pesquisar por filtro</label>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", marginBottom: "2cm" }}>
                        <div>
                            <select className='RP_selection_filter' onChange={(e) => setFiltertype(e.target.value)}>
                                <option>Número da RP</option>
                                <option>Favorecido</option>
                            </select>
                        </div>
                        <form style={{ display: "flex", flexDirection: "row", justifyContent: "center" }} onSubmit={(e) => { e.preventDefault(); searchrpwfilter(); setRPs(null) }}>
                            <input type={"text"} onChange={(e) => { setSearch(e.target.value); setFiltered(false) }}></input>
                            <button type={"submit"} style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                <AiOutlineSearch></AiOutlineSearch>
                            </button>
                        </form>
                    </div>
                    {Loading ? <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}><label style={{ color: "white", textAlign: "center" }}>Carregando...</label></div> : RPs?.content?.map((rp, index) => (
                        <div key={index}>
                            <div style={{display: "flex", flexDirection: "row", justifyContent: "center", textAlign: "left"}}>
                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                <div style={{ display: "flex", flexDirection: "row", width: "4cm", color: "white" }}>
                                    {rp.status ? <label style={{ width: "3cm", color: "red", textDecoration: "line-through" }}>{rp.id}</label> : <label style={{ width: "3cm" }}>{rp.id}</label>}
                                    <label style={{ width: "1cm", textAlign: "center" }}> - </label>
                                </div>
                                <button value={"Ver PDF"} onClick={() => { viewpdf(index) }}>{view[index] ? "Ocultar PDF" : "Ver PDF"}</button>
                            </div>
                            {rp.status ? <div style={{ width: "30px" }}></div> : <div onClick={() => cancelRP(rp.id)} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><MdBlock className='pdf_cancel' size={20}></MdBlock></div>}
                            </div>
                            {view[index] ?
                                <div style={{ marginTop: "10px", marginBottom: "30px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "90vh", backgroundColor: "rgba(1, 1, 56, 0.397)", boxShadow: "5px 5px 5px 5px rgba(2, 0, 36, 0.63)", borderTop: "1px solid black", borderBottom: "1px solid black" }}>
                                    <PDFViewer style={{ height: "80vh", width: "70%" }}>
                                        <RPpdf documento={rp.documento} dataemissao={rp.dataemissao} datapagamento={rp.datapagamento} favorecido={rp.favorecido} centrodecustos={rp.centrodecustos} debprojeto={rp.debprojeto} rpitems={rp.rpitems} rpdesc={rp.desc} rptotal={rp.total} rppag={rp.pagamento} rpanexo={rp.anexo} rpbancon={rp.banco_n} rpbanconome={rp.banco_nome} rpagencian={rp.agencia_n} rpagencianome={rp.agencia_nome} rpccn={rp.cc_n} rpid={rp.id}></RPpdf>
                                    </PDFViewer>
                                </div>
                                : null}
                        </div>
                    ))}
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
            <Link to={'/rp'}><div className='redirect_rps'><IoIosArrowBack size={'40px'}></IoIosArrowBack></div></Link>
        </div>
    )
}