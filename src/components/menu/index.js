import "./style.css";
import { stack as Menu } from "react-burger-menu";

function SlideInMenu() {
  function showSettings(event) {
    event.preventDefault();
  }

  return (
    <div className="menu_container">
      <Menu pageWrapId="page-wrap" outerContainerId="outer-container">
        <a id="home" className="menu-item" href="/">
          Home
        </a>
        <a id="about" className="menu-item" href="/about">
          About
        </a>
        <a id="contact" className="menu-item" href="/contact">
          Contact
        </a>
        <a onClick={showSettings} className="menu-item--small" href="">
          Settings
        </a>
      </Menu>
    </div>
  );
}

export default SlideInMenu;
