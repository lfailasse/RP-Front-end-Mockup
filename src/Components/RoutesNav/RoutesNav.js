import { useContext, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './RoutesNav.css';
import { AuthProvider, AuthContext } from '../Contexts/AuthContext';
import { Login } from '../../Pages/Login/Login';

const Register = lazy(() => import('../../Pages/Login/Register'))
const Dashboard = lazy(() => import('../../Pages/Dashboard'))
const EmailResetPass = lazy(() => import('../../Pages/Login/EmailResetPass'))
const ResetPass = lazy(() => import('../../Pages/Login/ResetPass'))
const App = lazy(() => import('../../App'))
const Sidemenu = lazy(() => import('../Sidemenu'))
const RP = lazy(() => import('../../Pages/Controle de RPs'))
const ConfecRP = lazy(() => import('../../Pages/Confecção RP'))
const FinanceiroRP = lazy(() => import('../../Pages/Controle de RPs/FinanceiroRP'))
const ModeloRP = lazy(() => import('../../Pages/Controle de RPs/ModeloRP'))
const CenCProjetos = lazy(() => import('../../Pages/CenCProjetos'))
const Assinaturas = lazy(() => import('../../Pages/Assinaturas'))
const AprovacaoRH = lazy(() => import('../../Pages/RH/AprovaçãoRP'))
const AprovacaoOrcamento = lazy(() => import('../../Pages/Orcamento/AprovaçãoOrçamento'))
const AprovacaoCompras = lazy(() => import('../../Pages/Compras/AprovaçãoCompras'))
const AprovacaoContratos = lazy(() => import('../../Pages/Contratos/AprovaçãoContratos'))
const AprovacaoAdministrativo = lazy(() => import('../../Pages/Administrativo/AprovaçãoAdministrativo'))
const ControleRPAdministrativo = lazy(() => import('../../Pages/Administrativo/Controle de RPs'))
const ControleRPCompras = lazy(() => import('../../Pages/Compras/Controle de RPs'))
const ControleRPRH = lazy(() => import('../../Pages/RH/ControleRPRH'))



export const RoutesNav = () => {

    const Private = ({ children }) => {

        const { TestAuth } = useContext(AuthContext);

        if (TestAuth == "") {
            return <Navigate to="/login" />
        } else {

            return children;

        }

    }

    const LoginReturn = ({ children }) => {
        const { setTestAuth, setUserData } = useContext(AuthContext)
        setUserData("")
        setTestAuth(false)
        return children
    }

    const Menu = () => {
        const { TestAuth } = useContext(AuthContext)
        if (TestAuth == true) {
            return <Sidemenu />
        } else {
            return null;
        }
    }

    const Access = ({ children }) => {

        const { userData } = useContext(AuthContext)

        if (userData?.role != null) {
            if (userData?.role === "ADMIN") {
                return <>{children}</>
            } else {
                return <div style={{ height: '2cm', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>Indisponível para o seu grupo de permissões</div>
            }
        } else {
            return <div>false</div>
        }
    }

    const NotFound = () => {
        return <div className='router_notfound'><h1 style={{ color: "red" }}>Error 404</h1><h2 style={{ color: "black" }}>Page not found.</h2></div>
    }

    return (
        <Suspense fallback={<div className='loading'>Carregando...</div>}>
            <Router>
                <AuthProvider>
                        <Menu />
                        <Routes>
                            <Route exact path="/login" element={<LoginReturn><Login /></LoginReturn>}></Route>
                            <Route exact path="/registro" element={<Private><Access><Register /></Access></Private>}></Route>
                            <Route exact path="/reset" element={<LoginReturn><EmailResetPass /></LoginReturn>}></Route>
                            <Route exact path="/reset/:token" element={<LoginReturn><ResetPass /></LoginReturn>}></Route>
                            <Route exact path="" element={<Private><App /></Private>}></Route>
                            <Route exact path="/controleRP" element={<Private><RP /></Private>}></Route>
                            <Route exact path="/FinanceiroRP" element={<Private><FinanceiroRP /></Private>}></Route>
                            <Route exact path="/dashboard" element={<Private><Dashboard/></Private>}></Route>
                            <Route exact path="/cencprojetos" element={<Private><CenCProjetos/></Private>}></Route>
                            <Route exact path="/RP" element={<Private><ConfecRP /></Private>}></Route>
                            <Route exact path="/modelorp" element={<Private><ModeloRP/></Private>}></Route>
                            <Route exact path="/assinaturas" element={<Private><Assinaturas /></Private>}></Route>
                            <Route exact path="/RH/aprovacaoRP" element={<Private><AprovacaoRH /></Private>}></Route>
                            <Route exact path="/aprovacaoorcamento" element={<Private><AprovacaoOrcamento /></Private>}></Route>
                            <Route exact path="/aprovacaoadministrativo" element={<Private><AprovacaoAdministrativo /></Private>}></Route>
                            <Route exact path="/aprovacaocompras" element={<Private><AprovacaoCompras /></Private>}></Route>
                            <Route exact path="/aprovacaocontratos" element={<Private><AprovacaoContratos /></Private>}></Route>
                            <Route exact path="/RH/controleRP" element={<Private><ControleRPRH /></Private>}></Route>
                            <Route exact path="/Compras/ControleRP" element={<Private><ControleRPCompras /></Private>}></Route>
                            <Route exact path="/Administrativo/ControleRP" element={<Private><ControleRPAdministrativo /></Private>}></Route>
                            <Route path="*" element={<NotFound></NotFound>}></Route>
                        </Routes>
                </AuthProvider>
                <footer className='routesnav_footer' />
            </Router>
        </Suspense>
    )
}