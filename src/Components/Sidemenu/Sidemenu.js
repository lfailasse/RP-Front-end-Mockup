import { useContext, useState, useEffect, useRef } from 'react';
import { FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Sidemenu.css'
import { SidemenuData } from './SidemenuData';
import { AuthContext } from '../Contexts/AuthContext';
import secureLocalStorage from 'react-secure-storage';

export function Sidemenu() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { setTestAuth } = useContext(AuthContext);

  const [Opened, setOpened] = useState([(false)])

  let sidebarref = useRef();

  const { userData } = useContext(AuthContext)


  const handleClick = () => setSidebarOpen(!sidebarOpen);

  const handleClickOutside = (e) => {
    if (!sidebarref?.current.contains(e?.target)) {
      setSidebarOpen(false);
    }
  };

  const logout = () => {
    setTestAuth(false);
    secureLocalStorage.removeItem("user");
    secureLocalStorage.removeItem("logged");
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", function(e){
      if(e.key == "Escape"){
        setSidebarOpen(false)
      }
    })
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });

  function open(i) {
    const open = [...Opened]
    for (const [index, value] of open.entries()) {
      if(index !== i){
        open[index] = false
      }
    }
    open[i] = !open[i]
    setOpened(open)
  }

  return (
    <div className="div_sidebar_menu">
      <div ref={sidebarref}>
        <Link to="#" onClick={handleClick} className="sidebar_menu">
          <FaBars
            className="sidebar_menu_icon"
          />
        </Link>
        <nav
          className={sidebarOpen ? "nav_sidebar active" : "nav_sidebar"}
        >
          <div>
            <div className='div_row'>
              <Link className='div_img' to="/"><img src='../../../assets/github.png' alt='igedes' className='div_sidebar_menu_head_img'></img></Link>
            </div>
          </div>
          <span className='menu_logout' onClick={logout}>Logout</span>
          <hr className='hr_sidemenu' />
          <div className='div_links'>
            <ul className="menu_ul">
              {SidemenuData.sort(function (a, b) {return a.title.localeCompare(b.title)}).map((item, index) => (item.departments?.includes(userData.department) ? <Link onClick={() => open(index)} className='menu_item_link' key={index} to={item.path}><li className={item.classname}><div className='div_item'><div className='div_item_text'>{item.title}</div><div className='div_item_icon'>{item.children && Opened[index] ? item.iconOpened : item.children ? item.iconClosed : null}</div></div></li>{item.children && Opened[index] ? item.children.map((submenu) => (submenu.roles?.includes(userData.role) ? <Link className={submenu.classname} to={submenu.path}><ul className='submenu_list'><li className='submenu_list_item'>{submenu.title}</li></ul></Link> : null)) : null}</Link> : null))}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  )
}