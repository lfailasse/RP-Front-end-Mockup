import { useContext, useEffect, useRef, useState } from "react";
import axiosInstance from "../../Components/Axios/axios";
import Head from "../../Components/Head";
import { AuthContext } from "../../Components/Contexts/AuthContext";
import "./CenCProjetos.css";
import Select from "react-select";
import { FaArrowLeft } from "react-icons/fa";

export const CenCProjetos = () => {
    const { headers } = useContext(AuthContext);

    const [CurrentOption, setCurrentOption] = useState(null);

    const cencRef = useRef();
    const rubricaRef = useRef();
    const cfinanceiraRef = useRef();

    const [Projects, setProjects] = useState([]);
    const [Rubricas, setRubricas] = useState([]);
    const [classeFinanceira, setClasseFinanceira] = useState([]);
    const [CenC, setCenC] = useState([]);

    const [CurrentProject, setCurrentProject] = useState();
    const [CurrentRubrica, setCurrentRubrica] = useState();

    const [newProject, setNewProject] = useState(
        {
            name: ""
        }
    )

    const [newRubrica, setNewRubrica] = useState(
        {
            code: "",
            name: ""
        }
    )

    const [newClasseFinanceira, setNewClasseFinanceira] = useState(
        {
            code: "",
            name: ""
        }
    )

    const [newCentrodeCustos, setNewCentrodeCustos] = useState(
        {
            name: ""
        }
    )

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getProjects();
        getRubricas();
        getCenC();
        getCFinanceiras();
    }, [isLoading, setProjects, setRubricas, setClasseFinanceira, setCenC]);

    async function sendData(e) {
        e.preventDefault()
        if (CurrentOption == 0) {
            await axiosInstance.post("/projects", { name: newProject.name }, { headers: headers })
        } else if (CurrentOption == 1) {
            await axiosInstance.post(`/rubricas?projectid=${CurrentProject.id}`, { code: newRubrica.code, name: newRubrica.name.toUpperCase() }, { headers: headers })
        } else if (CurrentOption == 2) {
            await axiosInstance.post(`/classefinanceira?rubricaid=${CurrentRubrica.id}`, { code: newClasseFinanceira.code, name: newClasseFinanceira.name.toUpperCase() }, { headers: headers })
        } else if (CurrentOption == 3) {
            await axiosInstance.post(`/cenc?projectid=${CurrentProject.id}`, { id: newCentrodeCustos.id, name: newCentrodeCustos.name.toUpperCase() }, { headers: headers })
        }
        getProjects();
        getRubricas();
        getCenC();
        getCFinanceiras();
        update();
    }

    function update() {

    }

    useEffect(() => {
        if (CurrentProject) {
            setCurrentProject(Projects.find(project => project.id === CurrentProject.id))
        }
        if (CurrentRubrica) {
            setCurrentRubrica(Rubricas.find(rubricas => rubricas.id === CurrentRubrica.id))
        }
    }, [update])

    async function getProjects() {
        await axiosInstance
            .get("/projects", { headers: headers })
            .then((res) => setProjects(res.data));
    }

    async function getRubricas() {
        await axiosInstance
            .get("/rubricas", { headers: headers })
            .then((res) => setRubricas(res.data));
    }

    async function getCenC() {
        await axiosInstance
            .get("/cenc", { headers: headers })
            .then((res) => setCenC(res.data));
    }

    async function getCFinanceiras() {
        await axiosInstance
            .get("/classefinanceira", { headers: headers })
            .then((res) => setClasseFinanceira(res.data));
    }

    async function clearRubrica() {
        setCurrentRubrica(null)
        rubricaRef.current.clearValue();
    }

    async function clearCfinanceira() {
        cfinanceiraRef.current.clearValue();
    }

    async function clearCenC() {
        cencRef.current.clearValue();
    }

    function setNProject(e) {
        const project = { ...newProject }
        project[e.target.id] = e.target.value
        setNewProject(project)
    }

    function setNRubrica(e) {
        const rubrica = { ...newRubrica }
        rubrica[e.target.id] = e.target.value
        console.log(rubrica)
        setNewRubrica(rubrica)
    }

    function setNCentrodeCustos(e) {
        const cenc = { ...newCentrodeCustos }
        cenc[e.target.id] = e.target.value
        setNewCentrodeCustos(cenc)
    }

    function setNClasseFinanceira(e) {
        const cfinanceira = { ...newClasseFinanceira }
        cfinanceira[e.target.id] = e.target.value
        console.log(cfinanceira)
        setNewClasseFinanceira(cfinanceira)
    }

    return (
        <div className="container">
            <div className="head">
                <Head title="Listagens e vinculações" />
            </div>
            {CurrentOption == null ? (
                <div className="typeselect_div">
                    <div
                        className="typeselect_option_div"
                        onClick={() => setCurrentOption(0)}
                    >
                        <label className="typeselect_option_div_label">PROJETO</label>
                    </div>
                    <div
                        className="typeselect_option_div"
                        onClick={() => setCurrentOption(1)}
                    >
                        <label className="typeselect_option_div_label">RUBRICAS</label>
                    </div>
                    <div
                        className="typeselect_option_div"
                        onClick={() => setCurrentOption(2)}
                    >
                        <label className="typeselect_option_div_label">
                            CLASSES FINANCEIRAS
                        </label>
                    </div>
                    <div
                        className="typeselect_option_div"
                        onClick={() => setCurrentOption(3)}
                    >
                        <label className="typeselect_option_div_label">
                            CENTROS DE CUSTO
                        </label>
                    </div>
                </div>
            ) : (
                <div
                    className="div_backarrow"
                    onClick={() => {
                        setCurrentOption(null);
                        setCurrentProject();
                        setCurrentRubrica();
                    }}
                >
                    <FaArrowLeft size={"20px"} color="#FFFFFF" />
                </div>
            )}

            {CurrentOption != null && (
                <form onSubmit={(e) => { sendData(e) }}>
                    <div className="main_send">
                        <div className="main_send_div">
                            {CurrentOption !== 0 ?
                                <Select
                                    required
                                    id="projectselect"
                                    isClearable={false}
                                    isSearchable={true}
                                    className="select_list"
                                    placeholder={"Selecione um projeto"}
                                    options={Projects.sort((a, b) => a.name.localeCompare(b.name))}
                                    getOptionValue={(Projects) => Projects.id}
                                    getOptionLabel={(Projects) => Projects.name}
                                    onChange={(e) => {
                                        setCurrentProject(e);
                                        clearRubrica();
                                        clearCfinanceira();
                                        clearCenC();
                                    }}
                                />
                                : null}
                            {CurrentProject && CurrentOption == 2 && (
                                <Select
                                    ref={rubricaRef}
                                    id="rubricaselect"
                                    isClearable={false}
                                    isSearchable={true}
                                    className="select_list"
                                    getOptionLabel={(Rubricas) => Rubricas.code + " - " + Rubricas.name}
                                    getOptionValue={(Rubricas) => Rubricas.id}
                                    options={CurrentProject?.rubricas.sort((a, b) =>
                                        a.name.localeCompare(b.name)
                                    )}
                                    placeholder={"Selecione uma rubrica"}
                                    onChange={(e) => {
                                        setCurrentRubrica(e);
                                        clearCfinanceira();
                                    }}
                                />
                            )}
                            {CurrentOption == 0 || CurrentOption == 1 && CurrentProject || CurrentOption == 2 && CurrentRubrica || CurrentOption == 3 && CurrentProject ?
                                <div className="form_container">
                                    <div className="div_input">
                                        {CurrentOption != 0 && CurrentOption != 3 ?
                                            <>
                                                <label>CÓDIGO:</label>
                                                <input
                                                    id="code"
                                                    type="text"
                                                    className="form_input_id"
                                                    onChange={(e) => CurrentOption === 1 ? setNRubrica(e) : CurrentOption === 2 ? setNClasseFinanceira(e) : CurrentOption === 3 ? setNCentrodeCustos(e) : null}
                                                />
                                            </>
                                            : null}
                                        <label>NOME:</label>
                                        <input
                                            id="name"
                                            type="text"
                                            className="form_input_name"
                                            placeholder={CurrentOption === 0 ? "Insira o nome do projeto" : CurrentOption === 1 ? "Insira o nome da rubrica" : CurrentOption === 2 ? "Insira o nome da classe financeira" : "Insira o nome do centro de custo"}
                                            onChange={(e) => CurrentOption === 0 ? setNProject(e) : CurrentOption === 1 ? setNRubrica(e) : CurrentOption === 2 ? setNClasseFinanceira(e) : setNCentrodeCustos(e)}
                                        />
                                    </div>
                                    <button type="submit" className="form_button">
                                        Adicionar
                                    </button>
                                </div>
                                : null}
                        </div>
                        {CurrentOption === 0 ?
                            <>
                                <div className="div_showinfo">
                                    PROJETOS REGISTRADOS
                                </div>
                                <hr style={{ width: '100%', margin: '0', marginLeft: 'auto', marginRight: 'auto', marginTop: '5px', marginBottom: '5px', borderTop: '1px solid black' }} />
                                {Projects.map((project) => (
                                    <div>
                                        {project.name}
                                    </div>))}
                            </>
                            : CurrentOption === 1 && CurrentProject ?
                                <>
                                    <div className="div_showinfo">
                                        RUBRICAS REGISTRADAS
                                    </div>
                                    <hr style={{ width: '100%', margin: '0', marginLeft: 'auto', marginRight: 'auto', marginTop: '5px', marginBottom: '5px', borderTop: '1px solid black' }} />
                                    {CurrentProject?.rubricas?.map((rubricas) => (
                                        <div>
                                            {rubricas.code + ' - ' + rubricas.name}
                                        </div>))}
                                </>
                                : CurrentOption === 2 && CurrentRubrica ?
                                    <>
                                        <div className="div_showinfo">
                                            CLASSES FINANCEIRAS REGISTRADAS
                                        </div>
                                        <hr style={{ width: '100%', margin: '0', marginLeft: 'auto', marginRight: 'auto', marginTop: '5px', marginBottom: '5px', borderTop: '1px solid black' }} />
                                        {CurrentRubrica?.classefinanceira?.map((classefinanceira) => (
                                            <div>
                                                {classefinanceira.code + ' - ' + classefinanceira.name}
                                            </div>))}
                                    </>
                                    : CurrentOption === 3 && CurrentProject ?
                                        <>
                                            <div className="div_showinfo">
                                                CENTROS DE CUSTOS REGISTRADOS
                                            </div>
                                            <hr style={{ width: '100%', margin: '0', marginLeft: 'auto', marginRight: 'auto', marginTop: '5px', marginBottom: '5px', borderTop: '1px solid black' }} />
                                            {CurrentProject?.centrodecustos?.map((cenc) => (
                                                <div>
                                                    {cenc.name}
                                                </div>))}
                                        </>
                                        : null
                        }
                    </div>
                </form>
            )}
        </div>
    );
};
