import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { UserContext } from "@/pages/_app";

let menulist = [
  "dashboard",
  "petition",
  "dsr",
  "csr",
  "fir",
  "ncrp",
  "bank",
  "network",
  "social-media",
];

export default function Menu() {
  const me = useContext(UserContext);
  useEffect(() => {
    let path = window.location.pathname;
    path = path.split("/");
    if (path.length > 2) {
      me.sm((a) => path[2]);
    }
    document.body.addEventListener("click", (e) => {
      if (e.target.alt !== "menu") {
        if (document.body.clientWidth < 1000) {
          let m = document.getElementById("menu");
          if (m.classList.contains("menuactive")) {
            m.classList.remove("menuactive");
          }
        }
      }
    });
  }, []);
  return (
    <div className="menu-container" id="menu">
      <div className="menu-body">
        <div className="menu-head">
          <Image
            src="/logo.png"
            width="80"
            height="80"
            alt="logo"
            quality={100}
            priority
          />
          <span>ccpsslmc</span>
        </div>
        {menulist.map((a) => {
          let lnk = `${process.env.URL}/ccps/${a}`;
          return (
            <button
              key={a}
              className={`${a === me.m && "active"}`}
              onClick={() => me.sm(a)}
            >
              <Link href={lnk}>{a.split("-").join(" ")}</Link>
              {a === me.m && (
                <>
                  <b></b>
                  <b></b>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
