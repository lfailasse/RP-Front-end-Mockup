import * as FaIcons from "react-icons/ai";
import * as RiIcons from "react-icons/ri";

export const SidemenuData = [
    {
        title: 'Geral',
        classname: 'menu_item',
        iconClosed: <RiIcons.RiArrowDownSLine />,
        iconOpened: <RiIcons.RiArrowUpSLine />,
        children: [
            {
                title: 'Visualizar RPs',
                path: '/controleRP',
                classname: 'menu_subitem',
                roles: [
                    "COORDENADOR COMPRAS",
                    "COORDENADOR RH",
                    "COORDENADOR ADMINISTRATIVO",
                    "ORCAMENTO",
                    "ADMIN"
                ]
            },
        ],
        departments: [
            "ADMIN",
            "ORCAMENTO",
            "ADMINISTRATIVO",
            "RH",
            "COMPRAS"
        ]
    },
    {
        title: 'Usuários e permissões',
        classname: 'menu_item',
        iconClosed: <RiIcons.RiArrowDownSLine />,
        iconOpened: <RiIcons.RiArrowUpSLine />,
        children: [
            {
                title: 'Registro',
                path: '/registro',
                classname: 'menu_subitem',
                roles: [
                    "ADMIN"
                ]
            },
            {
                title: 'Assinaturas',
                path: '/assinaturas',
                classname: 'menu_subitem',
                roles: [
                    "ADMIN"
                ]
            }
        ],
        departments: [
            "ADMIN"
        ]
    },
    {
        title: 'Administrativo',
        classname: 'menu_item',
        iconClosed: <RiIcons.RiArrowDownSLine />,
        iconOpened: <RiIcons.RiArrowUpSLine />,
        children: [
            {
                title: 'Requisição de pagamento',
                path: '/RP',
                classname: 'menu_subitem',
                roles: [
                    "COORDENADOR ADMINISTRATIVO",
                    "ADMINISTRATIVO",
                    "ADMIN"
                ]
            },
            {
                title: 'Visualizar RPs',
                path: '/Administrativo/controleRP',
                classname: 'menu_subitem',
                roles: [
                    "COORDENADOR ADMINISTRATIVO",
                    "ADMINISTRATIVO",
                    "ADMIN"
                ]
            },
            {
                title: 'Modelo de RPs',
                path: '/modeloRP',
                classname: 'menu_subitem',
                roles: [
                    "COORDENADOR ADMINISTRATIVO",
                    "ADMINISTRATIVO",
                    "ADMIN"
                ]
            },
            {
                title: 'Aprovação de RPs',
                path: '/aprovacaoAdministrativo',
                classname: 'menu_subitem',
                roles: [
                    "COORDENADOR ADMINISTRATIVO",
                    "ADMINISTRATIVO",
                    "ADMIN"
                ]
            }
        ],
        departments: [
            "ADMIN",
            "ADMINISTRATIVO"
        ]
    },
    {
        title: 'Financeiro',
        classname: 'menu_item',
        iconClosed: <RiIcons.RiArrowDownSLine />,
        iconOpened: <RiIcons.RiArrowUpSLine />,
        children: [
            {
                title: 'Financeiro - RP',
                path: '/financeiroRP',
                classname: 'menu_subitem',
                roles: [
                    "ADMIN",
                    "FINANCEIRO"
                ]
            }
        ],
        departments: [
            "ADMIN",
            "FINANCEIRO"
        ]
    },
    {
        title: 'Controladoria',
        classname: 'menu_item',
        iconClosed: <RiIcons.RiArrowDownSLine />,
        iconOpened: <RiIcons.RiArrowUpSLine />,
        children: [
            {
                title: 'Dashboard',
                path: '/dashboard',
                classname: 'menu_subitem',
                roles: [
                    "ORCAMENTO",
                    "ADMIN"
                ]
            },
            {
                title: 'Listagens e vinculações',
                path: '/cencprojetos',
                classname: 'menu_subitem',
                roles: [
                    "ORCAMENTO",
                    "ADMIN"
                ]
            }
        ],
        departments: [
            "ORCAMENTO",
            "ADMIN"
        ]
    },
    {
        title: 'RH',
        classname: 'menu_item',
        iconClosed: <RiIcons.RiArrowDownSLine />,
        iconOpened: <RiIcons.RiArrowUpSLine />,
        children: [
            {
                title: 'Aprovação de RPs',
                path: '/RH/aprovacaoRP',
                classname: 'menu_subitem',
                roles: [
                    "RH",
                    "COORDENADOR RH",
                    "ADMIN"
                ]
            },
            {
                title: 'Requisição de pagamento',
                path: '/rp',
                classname: 'menu_subitem',
                roles: [
                    "RH",
                    "COORDENADOR RH",
                    "ADMIN"
                ]
            },
            {
                title: 'Controle de RPs',
                path: '/RH/controleRP',
                classname: 'menu_subitem',
                roles: [
                    "RH",
                    "COORDENADOR RH",
                    "ADMIN"
                ]
            }
        ],
        departments: [
            "RH",
            "ADMIN",
        ]
    },
    {
        title: 'Compras',
        classname: 'menu_item',
        iconClosed: <RiIcons.RiArrowDownSLine />,
        iconOpened: <RiIcons.RiArrowUpSLine />,
        children: [
            {
                title: 'Requisição de pagamento',
                path: '/RP',
                classname: 'menu_subitem',
                roles: [
                    "COORDENADOR COMPRAS",
                    "COMPRAS",
                    "ADMIN"
                ]
            },
            {
                title: 'Controle de RPs',
                path: '/Compras/ControleRP',
                classname: 'menu_subitem',
                roles: [
                    "COORDENADOR COMPRAS",
                    "COMPRAS",
                    "ADMIN"
                ]
            },
            {
                title: 'Aprovação de RPs',
                path: '/aprovacaoCompras',
                classname: 'menu_subitem',
                roles: [
                    "COORDENADOR COMPRAS",
                    "COMPRAS",
                    "ADMIN"
                ]
            }
        ],
        departments: [
            "COMPRAS",
            "ADMIN",
        ]
    },
    {
        title: 'Orçamento',
        classname: 'menu_item',
        iconClosed: <RiIcons.RiArrowDownSLine />,
        iconOpened: <RiIcons.RiArrowUpSLine />,
        children: [
            {
                title: 'Aprovação de RPs',
                path: '/aprovacaoOrcamento',
                classname: 'menu_subitem',
                roles: [
                    "ORCAMENTO",
                    "ADMIN"
                ]
            }
        ],
        departments: [
            "ADMIN",
            "ORCAMENTO"
        ]
    },
    {
        title: 'Contratos',
        classname: 'menu_item',
        iconClosed: <RiIcons.RiArrowDownSLine />,
        iconOpened: <RiIcons.RiArrowUpSLine />,
        children: [
            {
                title: 'Aprovação de RPs',
                path: '/aprovacaoContratos',
                classname: 'menu_subitem',
                roles: [
                    "CONTRATOS",
                    "ADMIN"
                ]
            }
        ],
        departments: [
            "ADMIN",
            "CONTRATOS"
        ]
    }
]