import Head from '../../Components/Head'
import './Dashboard.css'
import { IoMdArrowBack } from "react-icons/io";

export const Dashboard = () => {

   
    

    return (
        <div>
            <Head title="Dashboard"></Head>
           
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2cm' }}>
                 
                <iframe src="https://analytics.htssolucoes.com.br/public/dashboard/d85892a5-62ac-47d7-bc43-0c1c8415e2f1" width="720" height="391"></iframe>                </div>
         
        </div>
    )
}