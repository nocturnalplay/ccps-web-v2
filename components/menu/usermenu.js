import { useEffect, useState } from "react";
import Image from "next/image";

export default function Menu() {
  const menu = () => {
    let men = document.getElementById("menu");
    men.classList.toggle("menuactive");
  };
  return (
    <div className="user-menu">
      <div className="menu-icon">
        <Image
          src="/icons/menu.png"
          className="icon"
          width={35}
          height={35}
          alt="menu"
          onClick={menu}
        />
        <div className="search-icon">
          <input
            type="text"
            placeholder="search"
            onFocus={(e) => (e.target.style.width = "200px")}
            onBlur={(e) => (e.target.style.width = "100px")}
          />
          <Image
            src="/icons/search.png"
            className="icon"
            width={35}
            height={35}
            alt="search"
          />
        </div>
      </div>
      <div className="user-noti-icon">
        <Image
          src="/icons/notification.png"
          className="icon"
          width={35}
          height={35}
          alt="notification"
        />
        <Image
          src="/icons/user.png"
          className="icon"
          width={35}
          height={35}
          alt="user"
        />
      </div>
    </div>
  );
}
