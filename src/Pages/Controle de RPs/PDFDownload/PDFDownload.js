import { pdf, Image, Page, Text, View, Document } from "@react-pdf/renderer";
import { PDFDocument } from "pdf-lib";
import { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import './PDFDownload.css'

export const PDFDownload = (props) => {

    const [finalPDF, setFinalPDF] = useState()

    const [Paginas, setPaginas] = useState([])

    let RPItems = []
    RPItems = props.rpitems

    let itensPorPagina = 7
    const totalPages = Math.ceil(props.rpitems.length / itensPorPagina) || 1;

    useEffect(() => {

        const PaginasRender = () => {


            let paginas = [...Paginas]

            for (let page = 0; page < totalPages; page++) {
                let itensInicio = itensPorPagina * page
                let itensFinal = itensPorPagina + itensInicio
                let Itens = RPItems.slice(itensInicio, itensFinal)

                paginas.push(
                    <Page key={page} size={"A4"} border={"1px"} style={{ backgroundColor: status() }}>
                        <View style={{ position: 'relative', height: '100%' }}>
                            {props.rporcamento ?
                                <div>
                                    <div>
                                        <Image style={{ position: 'absolute', left: 10, top: '10cm', height: '4.5cm', width: '2cm' }} src="/assets/orcamento.png"></Image>
                                    </div>
                                    <div>
                                        <Text style={{ transform: "rotate(270deg)", position: 'absolute', left: '0.7cm', top: '12cm', fontSize: '13px', color: '#727272', textDecoration: 'underline' }}>{props.rporcamento}</Text>
                                    </div>
                                </div>
                                : null}
                            {props.rplancamentocompras ?
                                <div>
                                    <Image style={{ position: 'absolute', right: 0, top: '10cm', height: '4.5cm', width: '2.5cm' }} src="/assets/compras.png"></Image>
                                </div>
                                : null}
                            {props.rpaprovacaoOrcamento ?
                                <div>
                                    <Image style={{ position: 'absolute', right: 20, top: '2cm', height: '2.8cm', width: '3cm' }} src="/assets/carimboOrcamento.png"></Image>
                                </div>
                                : null}
                            {props.assinaturaContratos ?
                                <div>
                                    <Image style={{ position: 'absolute', left: 40, top: '26cm', height: '2.5cm', width: '4cm' }} src={props.assinaturaContratos}></Image>
                                </div>
                                : null}
                            <div style={{ position: 'relative', padding: "60px", paddingRight: '80x' }}>
                                <div style={{ marginLeft: '20px', display: 'flex', flexDirection: 'row', width: '100%', position: 'relative' }}>
                                    <div>
                                        <Image src="assets/ideias.jpg" style={{ position: 'absolute', height: '2cm', width: '2cm' }}></Image>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', marginTop: '10px' }}>
                                        <Text style={{ textAlign: "center", fontSize: "8px" }}>
                                            IDEIAS - INSTITUTO DE DESENVOLVIMENTO INSTITUCIONAL E AÇÃO SOCIAL
                                        </Text>
                                    </div>
                                </div>
                                <Text style={{ textAlign: "center", fontSize: "10px", fontWeight: "bold", marginTop: '10px', marginBottom: "20px" }}>
                                    REQUISIÇÃO DE PAGAMENTO - {props.rpid}
                                </Text>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", paddingLeft: "20px", paddingTop: "10px" }}>
                                        <div style={{ borderLeft: "1px solid black", borderBottom: "1px solid black", height: "1cm", width: "3.2cm" }}>
                                            <Text style={{ marginLeft: "5px", fontSize: "8px" }}>DATA DE EMISSÃO</Text>
                                            <Text style={{ marginLeft: "10px", marginTop: "8px", fontSize: "10px" }}>{props.dataemissao}</Text>
                                        </div>
                                        <div style={{ borderLeft: "1px solid black", borderBottom: "1px solid black", height: "1cm", width: "5cm" }}>
                                            <Text style={{ marginLeft: "10px", fontSize: "8px" }}>DEBITAR AO PROJETO</Text>
                                            <Text style={{ marginLeft: "10px", marginTop: "8px", fontSize: "8px" }}>{props.debprojeto}</Text>
                                        </div>
                                        <div style={{ borderLeft: "1px solid black", borderBottom: "1px solid black", height: "1cm", width: "5cm" }}>
                                            <Text style={{ marginLeft: "10px", fontSize: "8px" }}>CENTRO DE CUSTOS</Text>
                                            <Text style={{ marginLeft: "10px", marginTop: "8px", fontSize: "8px" }}>{props.centrodecustos}</Text>
                                        </div>
                                        <div style={{ borderLeft: "1px solid black", borderBottom: "1px solid black", height: "1cm", width: "4cm" }}>
                                            <Text style={{ marginLeft: "5px", fontSize: "8px" }}>DATA DE PAGAMENTO</Text>
                                            <Text style={{ marginLeft: "10px", marginTop: "8px", fontSize: "10px" }}>{props.datapagamento}</Text>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", paddingLeft: "20px", paddingTop: "10px" }}>
                                        <div style={{ borderLeft: "1px solid black", borderBottom: "1px solid black", height: "1cm", width: "10cm" }}>
                                            <Text style={{ marginLeft: "10px", fontSize: "8px" }}>NOME DO FAVORECIDO</Text>
                                            <Text style={{ marginLeft: "10px", marginTop: "8px", fontSize: "10px" }}>{props.favorecido}</Text>
                                        </div>
                                        <div style={{ borderLeft: "1px solid black", borderBottom: "1px solid black", height: "1cm", width: "8cm" }}>
                                            <Text style={{ marginLeft: "10px", fontSize: "8px" }}>CPF/CNPJ FAVORECIDO (CREDITO C/C)</Text>
                                            <Text style={{ marginLeft: "10px", marginTop: "8px", fontSize: "11px" }}>{props.documento}</Text>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", paddingLeft: "20px", paddingTop: "10px" }}>
                                        <div style={{ borderLeft: "1px solid black", borderBottom: "1px solid black", width: "10cm" }}>
                                            <Text style={{ marginLeft: "10px", fontSize: "8px", fontWeight: "bold", marginBottom: "10px" }}>DESCRIÇÃO</Text>
                                            <Text style={{ marginLeft: "10px", fontSize: "8px", width: 300 }}>{props.rpdesc}</Text>
                                        </div>
                                        <div style={{ borderLeft: "1px solid black", borderBottom: "1px solid black", height: "2cm", width: "8cm" }}>
                                            <Text style={{ marginLeft: "10px", fontSize: "8px" }}>RELACIONAR DOCUMENTOS ANEXOS</Text>
                                            <div style={{ display: "flex", flexDirection: "column", height: "2cm", justifyContent: "center", alignItems: "center" }}>
                                                <Text style={{ fontSize: "7.5px", textAlign: "center" }}>{props.rpanexo}</Text>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '10px', marginLeft: '20px', width: '96%', height: '50px', border: '1px solid black' }}>
                                        <div style={{ height: '50%', borderBottom: '1px solid black', display: 'flex', flexDirection: 'row' }}>
                                            <div style={{ borderRight: '1px solid black', width: '2cm', height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ fontSize: '8px' }}>RUBRICA:</Text>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ marginLeft: '5px', fontSize: '10px' }}>{props.rprubrica}</Text>
                                            </div>
                                            <div style={{ marginLeft: 'auto', borderLeft: '1px solid black', width: '1.5cm', height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ fontSize: '8px' }}>-</Text>
                                            </div>
                                        </div>
                                        <div style={{ height: '50%', display: 'flex', flexDirection: 'row' }}>
                                            <div style={{ borderRight: '1px solid black', width: '2cm', height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ fontSize: '8px' }}>CLASSE:</Text>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ marginLeft: '5px', fontSize: '10px' }}>{props.rpclassefinanceira}</Text>
                                            </div>
                                            <div style={{ marginLeft: 'auto', borderLeft: '1px solid black', width: '1.5cm', height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ fontSize: '8px' }}>-</Text>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", paddingLeft: "20px", paddingTop: "10px" }}>
                                        <div style={{ height: "auto", width: "10cm" }}>
                                            <Text style={{ marginLeft: "10px", fontSize: "8px", fontWeight: "bold" }}>FORMA DE PAGAMENTO</Text>
                                            <div style={{ height: "3.5cm", display: "flex", flexDirection: "column", justifyContent: "space-between", marginTop: "10px" }}>
                                                <div style={{ display: "flex", flexDirection: "row" }}>
                                                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "20px", width: "20px", border: "1px solid black" }}><Text style={{ fontSize: "14px" }}>{tipopag("PIX")}</Text></div>
                                                    <Text style={{ marginLeft: "10px", fontSize: "8px", alignSelf: "center" }}>PIX</Text>
                                                </div>
                                                <div style={{ display: "flex", flexDirection: "row" }}>
                                                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "20px", width: "20px", border: "1px solid black" }}><Text style={{ fontSize: "14px" }}>{tipopag("BOLETO")}</Text></div>
                                                    <Text style={{ marginLeft: "10px", fontSize: "8px", alignSelf: "center" }}>BOLETO</Text>
                                                </div>
                                                <div style={{ display: "flex", flexDirection: "row" }}>
                                                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "20px", width: "20px", border: "1px solid black" }}><Text style={{ fontSize: "14px" }}>{tipopag("CRÉDITO EM C/C")}</Text></div>
                                                    <Text style={{ marginLeft: "10px", fontSize: "8px", alignSelf: "center" }}>CRÉDITO EM C/C</Text>
                                                </div>
                                                <div style={{ display: "flex", flexDirection: "row" }}>
                                                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "20px", width: "20px", border: "1px solid black" }}><Text style={{ fontSize: "14px" }}>{tipopag("DINHEIRO")}</Text></div>
                                                    <Text style={{ marginLeft: "10px", fontSize: "8px", alignSelf: "center" }}>DINHEIRO</Text>
                                                </div>
                                            </div>
                                            <div style={{ paddingTop: '20px', height: '3cm' }}>
                                                <div>
                                                    <Text style={{ fontSize: '10px' }}>Conta provisão: R${props.contaprovisao}</Text>
                                                </div>
                                                <div>
                                                    <Text style={{ fontSize: '10px' }}>Conta execução: R${props.contaexecucao}</Text>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                <div style={{ height: "auto", width: "8cm" }}>
                                                    <Text style={{ marginLeft: "10px", fontSize: "8px", fontWeight: "bold", marginBottom: "10px" }}>DETALHAR PAGAMENTO</Text>
                                                    {Itens.map((rpitems, i) =>
                                                        <div key={rpitems.id} style={{ height: "auto", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "20px", width: "6.5cm", marginBottom: "5px", borderLeft: "1px solid black", borderBottom: "1px solid black" }}>
                                                                    <Text style={{ marginLeft: "10px", fontSize: "8px" }}>{rpitems.name}</Text>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div style={{ height: "auto", width: "4cm" }}>
                                                    <Text style={{ marginLeft: "10px", fontSize: "8px", fontWeight: "bold", marginBottom: "10px" }}>VALOR</Text>
                                                    {Itens.map((rpitems, i) =>
                                                        <div key={rpitems.id} style={{ height: "auto", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "20px", width: "3cm", marginBottom: "5px", borderLeft: "1px solid black", borderBottom: "1px solid black" }}>
                                                                    <Text style={{ marginLeft: "10px", fontSize: "8px" }}>{rpitems.valor ? rpitems.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : null}</Text>
                                                                </div>
                                                            </div>
                                                        </div>)}
                                                </div>
                                            </div>
                                            {page === totalPages - 1 ? <div style={{ height: 'auto', display: "flex", flexDirection: "row", justifyContent: 'flex-end', paddingTop: '0px', alignItems: 'center' }}>
                                                <Text style={{ fontSize: "8px", fontWeight: "bold", marginRight: '10px' }}>TOTAL</Text>
                                                <div style={{ padding: 0, display: "flex", justifyContent: "center", height: "18px", width: "3cm", borderLeft: "2px solid black", borderBottom: "2px solid black" }}>
                                                    <Text style={{ marginLeft: "10px", fontSize: "8px" }}>{props.rptotal ? props.rptotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : null}</Text>
                                                </div>
                                            </div> : null}
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                        <div style={{ height: "3cm", width: "50%", display: "flex", flexDirection: "column", justifyContent: "space-between", paddingLeft: "10px", paddingTop: "0px" }}>
                                            <Text style={{ marginLeft: "10px", fontSize: "8px" }}>DADOS PARA CRÉDITO EM C/C</Text>
                                            <div>
                                                <Text style={{ marginLeft: "10px", fontSize: "8px" }}>BANCO: N° <Text style={{ color: "red" }}>{props.rpbancon}</Text> - NOME: <Text style={{ color: "red" }}>{props.rpbanconome?.toUpperCase()}</Text></Text>
                                            </div>
                                            <div>
                                                <Text style={{ marginLeft: "10px", fontSize: "8px" }}>AGÊNCIA: N° <Text style={{ color: "red" }}>{props.rpagencian}</Text> - NOME: <Text style={{ color: "red" }}>{props.rpagencianome?.toUpperCase()}</Text></Text>
                                            </div>
                                            <div>
                                                <Text style={{ marginLeft: "10px", fontSize: "8px" }}>C/C: N° <Text style={{ color: "red" }}>{props.rpccn}</Text></Text>
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "row", width: "50%", paddingTop: "0px" }}>
                                            <div style={{ position: "relative", display: "flex", height: "2cm", width: "8cm", borderLeft: "1px solid black" }}>
                                                <div style={{ height: "3cm", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                                    <Text style={{ marginLeft: "10px", fontSize: "8px" }}>EMITIDO POR:</Text>
                                                    {props.assinatura2 != null ? <Image style={{ position: "absolute", marginLeft: '4px', marginTop: '10px', height: '2.5cm', width: '4cm' }} src={props.assinatura2}></Image> : null}
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", height: "2cm", width: "8cm", borderLeft: "1px solid black" }}>
                                                <div style={{ position: "relative", height: "3cm", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                                    <Text style={{ marginLeft: "10px", fontSize: "8px" }}>APROVADO POR:</Text>
                                                    {props.assinatura1 != null ? <Image style={{ position: "absolute", marginLeft: '4px', marginTop: '10px', height: '2.5cm', width: '4cm' }} src={props.assinatura1}></Image> : null}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ width: "100%", marginTop: "50px" }}>
                                    <hr style={{ border: "0.5px solid black" }}></hr>
                                </div>
                            </div>
                            <Text style={{ position: 'absolute', right: '20', bottom: '20', fontSize: '8px' }}>Página {page + 1}/{totalPages}</Text>
                        </View>
                    </Page >)

            }
            setPaginas(paginas)

        }
        PaginasRender()
    }, [])

    function tipopag(e) {
        if (e === props.rppag) {
            return "X"
        }
    }

    function status() {
        if (props.rpstatus !== true) {
            return "white"
        } else {
            return "#FFBFBF"
        }
    }

    const [trigger, setTrigger] = useState(false)


    let anexoList = [];

    async function downloadPDF() {
        if (props.rpanexos) {
            for (const anexo of props.rpanexos) {
                if (anexo.contentType === 'application/pdf') {
                    anexoList.push(base64ToArrayBuffer(anexo.anexo));
                }
            }
        }
        mergePdfs(anexoList).then((combinedPdfBytes) => {
            const pdfBlob = new Blob([combinedPdfBytes], { type: 'application/pdf' });
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(pdfBlob);
            downloadLink.download = `${props.id}`;
            downloadLink.click();
            if (props.onDownloadComplete) {
                setTimeout(() => {
                    props.onDownloadComplete()
                }, 1000)
            }
        });
    }

    function base64ToArrayBuffer(base64) {
        var binaryString = window.atob(base64);
        var binaryLen = binaryString.length;
        var bytes = new Uint8Array(binaryLen);
        for (var i = 0; i < binaryLen; i++) {
            var ascii = binaryString.charCodeAt(i);
            bytes[i] = ascii;
        }
        return bytes.buffer
    }

    const mergePdfs = async (pdfArrayBuffers) => {
        const mergedPdf = await PDFDocument.create();
        const blob = await pdf(<Document>{Paginas}</Document>).toBlob();
        const arrayBuffer = await blob.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPages().map((_, index) => index));
        pages.forEach((page) => mergedPdf.addPage(page));

        if (pdfArrayBuffers.length > 0) {
            for (const pdfBytes of pdfArrayBuffers) {
                const pdfDoc = await PDFDocument.load(pdfBytes);
                const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPages().map((_, index) => index));
                pages.forEach((page) => mergedPdf.addPage(page));
            }
        }
        const mergedPdfBytes = await mergedPdf.save();
        return mergedPdfBytes;
    };

    return (
        <div className="div_downloadpdf" onClick={() => downloadPDF()}>
            <label style={{ textWrap: 'nowrap' }}>Download PDF</label>
            <FiDownload size={18} className="download_button"></FiDownload>
        </div>
    )

}