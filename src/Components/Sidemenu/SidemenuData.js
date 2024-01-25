import * as FaIcons from "react-icons/ai";
import * as RiIcons from "react-icons/ri";

export const SidemenuData = [
    {
        title: 'Registro',
        path: '/registro',
        classname: 'menu_item',
        roles: [
            "ADMIN"
        ]
    },
    {
        title: 'Controle de RPs',
        classname: 'menu_item',
        iconClosed: <RiIcons.RiArrowDownSLine/>,
        iconOpened: <RiIcons.RiArrowUpSLine/>,
        children: [
            {
                title: 'Confecção de RPs',
                path: '/rp',
                classname: 'menu_subitem'
            },
            {
                title: 'Visualizar PDFs',
                path: '/controlerp',
                classname: 'menu_subitem'
            }
        ],
        roles: [
            "ADMIN",
            "USER"
        ]
    }
]