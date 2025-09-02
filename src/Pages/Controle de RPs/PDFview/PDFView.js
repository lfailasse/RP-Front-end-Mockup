import RPpdf from '../RPpdf';
import './PDFView.css'
import { Document as Doc, Page as Pag, pdfjs } from 'react-pdf'
import { useEffect, useState } from 'react';
import { PDFDocument } from 'pdf-lib';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export const PDFView = (props) => {

    const [finalPDF, setFinalPDF] = useState()
    const [numPages, setNumPages] = useState();
    const [anexos, setAnexos] = useState([])

    const [currentPage, setCurrentPage] = useState(1)

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };


    useEffect(() => {
        const carregarPDFs = async () => {
            setNumPages(0);
            setFinalPDF(null);
            setAnexos([]);
            setCPage(1);
            setCurrentPage(1);

            if (props.rpanexos && props.rpanexos.length > 0) {
                const pdfBuffers = props.rpanexos
                    .filter(anexo => anexo.contentType === 'application/pdf')
                    .map(anexo => base64ToArrayBuffer(anexo.anexo));

                if (pdfBuffers.length > 0) {
                    try {
                        const combinedPdfBytes = await mergePdfs(pdfBuffers);
                        const pdfBlob = new Blob([combinedPdfBytes], { type: 'application/pdf' });
                        const pdfUrl = URL.createObjectURL(pdfBlob);
                        setAnexos(pdfUrl);
                    } catch (err) {
                        console.error("Erro ao juntar PDFs:", err);
                    }
                }
            }
        };

        carregarPDFs();
    }, [props.rpanexos]);


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
        if (finalPDF) {
            const pdfDoc = await PDFDocument.load(finalPDF);
            const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPages().map((_, index) => index));
            pages.forEach((page) => mergedPdf.addPage(page));
        }

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

    const [cPage, setCPage] = useState(1)

    useEffect(() => {
        setCurrentPage(cPage)
    }, [cPage])

    return (
        <dialog open style={{ zIndex: 11 }}>
            <div style={{ border: '2px solid gray', display: 'flex', height: '90vh', width: '100%', borderRadius: '5px', overflowY: 'scroll' }}>
                {anexos ?
                    <Doc loading={<div style={{ width: 300, color: 'black', textAlign: 'center' }}>Carregando PDF, aguarde...</div>} file={anexos} onLoadSuccess={onDocumentLoadSuccess}>
                        <Pag
                            pageNumber={currentPage}
                            scale={1}
                            loading={<div style={{ color: 'black' }}>Carregando...</div>}
                            style={{ position: 'relative' }}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            width={1000}
                        >
                            <div style={{ top: '0', width: '100%', position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {currentPage !== 1 ? <button style={{ marginRight: '10px' }} onClick={() => setCPage(cPage - 1)}>{'<'}</button> : null}
                                <label>Página atual - <input type='number' className='number_input_pag' style={{ width: '1cm', border: 'none' }} onKeyDown={(e) => { if (e.key === "Enter") { if (parseInt(e.target.value) > 0 && parseInt(e.target.value) <= numPages) { setCPage(parseInt(e.target.value)) } } }} defaultValue={currentPage}></input> / {numPages}</label>
                                {currentPage !== numPages ? <button style={{ marginLeft: '10px' }} onClick={() => setCPage(cPage + 1)}>{'>'}</button> : null}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {currentPage !== 1 ? <button style={{ marginRight: '10px' }} onClick={() => setCPage(cPage - 1)}>{'<'}</button> : null}
                                <label>Página atual - <input type='number' className='number_input_pag' style={{ width: '1cm', border: 'none' }} onKeyDown={(e) => { if (e.key === "Enter") { if (parseInt(e.target.value) > 0 && parseInt(e.target.value) <= numPages) { setCPage(parseInt(e.target.value)) } } }} defaultValue={currentPage}></input> / {numPages}</label>
                                {currentPage !== numPages ? <button style={{ marginLeft: '10px' }} onClick={() => setCPage(cPage + 1)}>{'>'}</button> : null}
                            </div>
                        </Pag>
                    </Doc>
                    : null}
            </div>
        </dialog>
    )
}