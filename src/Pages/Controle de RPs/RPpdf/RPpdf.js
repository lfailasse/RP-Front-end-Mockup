import { Document, Page, Text, View } from "@react-pdf/renderer"

export const RPpdf = (props) => {

    function tipopag(e) {
        if (e === props.rppag) {
            return "X"
        }
    }

    return (
        <Document>
            <Page size={"A4"} border={"1px"}>
                <View style={{ padding: "10px" }}>
                    <Text style={{ textAlign: "center", fontSize: "10px", marginBottom: "15px" }}>
                        HTS TECNOLOGIA E RECURSOS HUMANOS
                    </Text>
                    <Text style={{ textAlign: "center", fontSize: "12px", fontWeight: "bold", marginBottom: "10px" }}>
                        REQUISIÇÃO DE PAGAMENTO
                    </Text>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", paddingLeft: "20px", paddingTop: "10px" }}>
                            <div style={{ borderLeft: "1px solid black", borderBottom: "1px solid black", height: "1cm", width: "4cm" }}>
                                <Text style={{ marginLeft: "10px", fontSize: "8px" }}>DATA DA SOLICITAÇÃO</Text>
                                <Text style={{ marginLeft: "10px", marginTop: "8px", fontSize: "10px" }}>{props.dataemissao}</Text>
                            </div>
                            <div style={{ borderLeft: "1px solid black", borderBottom: "1px solid black", height: "1cm", width: "4cm" }}>
                                <Text style={{ marginLeft: "10px", fontSize: "8px" }}>DEBITAR AO PROJETO</Text>
                                <Text style={{ marginLeft: "10px", marginTop: "8px", fontSize: "8px" }}>{props.debprojeto}</Text>
                            </div>
                            <div style={{ borderLeft: "1px solid black", borderBottom: "1px solid black", height: "1cm", width: "4cm" }}>
                                <Text style={{ marginLeft: "10px", fontSize: "8px" }}>CENTRO DE CUSTOS</Text>
                                <Text style={{ marginLeft: "10px", marginTop: "8px", fontSize: "8px" }}>{props.centrodecustos}</Text>
                            </div>
                            <div style={{ borderLeft: "1px solid black", borderBottom: "1px solid black", height: "1cm", width: "4cm" }}>
                                <Text style={{ marginLeft: "10px", fontSize: "8px" }}>DATA DE PAGAMENTO</Text>
                                <Text style={{ marginLeft: "10px", marginTop: "8px", fontSize: "10px" }}>{props.datapagamento}</Text>
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", paddingLeft: "20px", paddingTop: "10px" }}>
                            <div style={{ borderLeft: "1px solid black", borderBottom: "1px solid black", height: "1cm", width: "10cm" }}>
                                <Text style={{ marginLeft: "10px", fontSize: "8px" }}>NOME DO FAVORECIDO</Text>
                                <Text style={{ marginLeft: "10px", marginTop: "8px", fontSize: "11px" }}>{props.favorecido}</Text>
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
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", paddingLeft: "20px", paddingTop: "10px" }}>
                            <div style={{ height: "3.5cm", width: "10cm" }}>
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
                            </div>
                            <div style={{ height: "auto", width: "8cm" }}>
                                <Text style={{ marginLeft: "10px", fontSize: "8px", fontWeight: "bold", marginBottom: "10px" }}>DETALHAR PAGAMENTO</Text>
                                {props.rpitems.map((rpitems, i) =>
                                    <div key={rpitems.id} style={{ height: "auto", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                        <div style={{ display: "flex", flexDirection: "row" }}>
                                            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "20px", width: "6.5cm", marginBottom: "10px", borderLeft: "1px solid black", borderBottom: "1px solid black" }}>
                                                <Text style={{ marginLeft: "10px", fontSize: "8px" }}>{rpitems.name}</Text>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div style={{ height: "auto", width: "4cm" }}>
                                <Text style={{ marginLeft: "10px", fontSize: "8px", fontWeight: "bold", marginBottom: "10px" }}>VALOR</Text>
                                {props.rpitems.map((rpitems, i) =>
                                    <div key={rpitems.id} style={{ height: "auto", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                        <div style={{ display: "flex", flexDirection: "row" }}>
                                            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "20px", width: "3cm", marginBottom: "10px", borderLeft: "1px solid black", borderBottom: "1px solid black" }}>
                                                <Text style={{ marginLeft: "10px", fontSize: "8px" }}>{rpitems.valor ? rpitems.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : null}</Text>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", marginLeft: "16.75cm", marginBottom: "1cm" }}>
                            <Text style={{ marginLeft: "10px", fontSize: "8px", fontWeight: "bold", marginBottom: "10px" }}>TOTAL</Text>
                            <div style={{ padding: 0, display: "flex", justifyContent: "center", height: "18px", width: "3cm", borderLeft: "2px solid black", borderBottom: "2px solid black" }}>
                                <Text style={{ marginLeft: "10px", fontSize: "8px" }}>{props.rptotal ? props.rptotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : null}</Text>
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <div style={{ height: "3cm", width: "50%", display: "flex", flexDirection: "column", justifyContent: "space-between", paddingLeft: "20px", paddingTop: "10px" }}>
                                <Text style={{ marginLeft: "10px", fontSize: "8px" }}>DADOS PARA CRÉDITO EM C/C</Text>
                                <div>
                                    <Text style={{ marginLeft: "10px", fontSize: "8px" }}>BANCO: N° <Text style={{color: "red"}}>{props.rpbancon}</Text> - NOME: <Text style={{color: "red"}}>{props.rpbanconome?.toUpperCase()}</Text></Text>
                                </div>
                                <div>
                                    <Text style={{ marginLeft: "10px", fontSize: "8px" }}>AGÊNCIA: N° <Text style={{color: "red"}}>{props.rpagencian}</Text> - NOME: <Text style={{color: "red"}}>{props.rpagencianome?.toUpperCase()}</Text></Text>
                                </div>
                                <div>
                                    <Text style={{ marginLeft: "10px", fontSize: "8px" }}>C/C: N° <Text style={{color: "red"}}>{props.rpccn}</Text></Text>
                                </div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "row", width: "50%", paddingTop: "40px" }}>
                                <div style={{ display: "flex", height: "2cm", width: "8cm", borderLeft: "1px solid black", borderBottom: "1px solid black" }}>
                                    <div style={{ height: "3cm", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                        <Text style={{ marginLeft: "10px", fontSize: "8px" }}>EMITIDO POR:</Text>
                                        <Text style={{ marginLeft: "10px", fontSize: "8px" }}>DATA</Text>
                                    </div>
                                </div>
                                <div style={{ display: "flex", height: "2cm", width: "8cm", borderLeft: "1px solid black", borderBottom: "1px solid black" }}>
                                    <div style={{ height: "3cm", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                        <Text style={{ marginLeft: "10px", fontSize: "8px" }}>APROVADO POR:</Text>
                                        <Text style={{ marginLeft: "10px", fontSize: "8px" }}>DATA</Text>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <div style={{ height: "2.5cm", width: "50%", display: "flex", flexDirection: "column", justifyContent: "space-between", paddingLeft: "20px", paddingTop: "10px", marginTop: "20px" }}>
                            <Text style={{ marginLeft: "10px", fontSize: "8px" }}>PARA USO DA ÁREA FINANCEIRA</Text>
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <div style={{ display: "flex", height: "1.5cm", width: "6.5cm", borderLeft: "1px solid black", borderBottom: "1px solid black" }}>
                                    <Text style={{ marginLeft: "10px", fontSize: "8px" }}>BANCO:</Text>
                                </div>
                                <div style={{ display: "flex", height: "1.5cm", width: "6.5cm", borderLeft: "1px solid black", borderBottom: "1px solid black" }}>
                                    <Text style={{ marginLeft: "10px", fontSize: "8px" }}>AGÊNCIA:</Text>
                                </div>
                                <div style={{ display: "flex", height: "1.5cm", width: "6.5cm", borderLeft: "1px solid black", borderBottom: "1px solid black" }}>
                                    <Text style={{ marginLeft: "10px", fontSize: "8px" }}>C/C N°</Text>
                                </div>
                            </div>
                        </div>
                        <div style={{ alignSelf: "flex-end", marginLeft: "auto", marginTop: "1cm", display: "flex", height: "1.5cm", width: "6.5cm", borderLeft: "1px solid black", borderBottom: "1px solid black" }}>
                            <Text style={{ marginLeft: "10px", fontSize: "8px" }}>N° RP</Text>
                            <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "2cm"}}>
                            <Text style={{ fontSize: "8px"}}>{props.rpid}</Text>
                            </div>
                        </div>
                    </div>
                    <div style={{ width: "100%", marginTop: "50px" }}>
                        <hr style={{ border: "0.5px solid black" }}></hr>
                    </div>
                </View>
            </Page>
        </Document>
    )

}