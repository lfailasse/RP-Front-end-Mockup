import { useContext, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './RoutesNav.css';
import { AuthProvider, AuthContext } from '../Contexts/AuthContext';
import { Login } from '../../Pages/Login/Login';

const Register = lazy(() => import('../../Pages/Login/Register'))
const App = lazy(() => import('../../App'))
const Sidemenu = lazy(() => import('../Sidemenu'))
const RP = lazy(() => import('../../Pages/Controle de RPs'))
const ConfecRP = lazy(() => import('../../Pages/Confecção RP'))



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
        return <div className='router_notfound'><h1 style={{ color: "red" }}>Error 404</h1><h2 style={{ color: "white" }}>Page not found.</h2></div>
    }

    return (
        <Suspense fallback={<div className='loading'>Carregando...</div>}>
            <Router>
                <AuthProvider>
                    <Menu />
                    <Routes>
                        <Route exact path="/login" element={<LoginReturn><Login /></LoginReturn>}></Route>
                        <Route exact path="/registro" element={<Private><Access><Register /></Access></Private>}></Route>
                        <Route exact path="" element={<Private><App /></Private>}></Route>
                        <Route exact path="/controleRP" element={<Private><RP /></Private>}></Route>
                        <Route exact path="/RP" element={<Private><ConfecRP /></Private>}></Route>
                        <Route path="*" element={<NotFound></NotFound>}></Route>
                    </Routes>
                </AuthProvider>
                <footer className='routesnav_footer' />
            </Router>
        </Suspense>
    )
}