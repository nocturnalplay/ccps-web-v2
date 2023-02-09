import "@/styles/globals.scss";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import Head from "next/head";
import { StrictMode, useEffect, useState, createContext } from "react";
import Menu from "@/components/menu/menu";
import UserMenu from "@/components/menu/usermenu";

const theme = createTheme({
  palette: {
    primary: {
      main: "#00051d",
    },
  },
});
export const UserContext = createContext();

export default function App({ Component, pageProps }) {
  const [menustate, setstate] = useState(false);
  const [menu, setMenu] = useState();
  useEffect(() => {
    document.addEventListener("wheel", function (event) {
      if (document.activeElement.type === "number") {
        document.activeElement.blur();
      }
    });
    let path = window.location.pathname.split("/");
    if (path[1] == "ccps") {
      setstate(true);
    } else {
      setstate(false);
    }
  }, [Component]);
  return (
    <StrictMode>
      <ThemeProvider theme={theme}>
        <UserContext.Provider value={{ m: menu, sm: setMenu }}>
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <title>ccps salem city</title>
          </Head>
          <div className="body">
            {menustate && <Menu />}
            <div className="body-container">
              {menustate && <UserMenu />}
              <Component {...pageProps} />
            </div>
          </div>
        </UserContext.Provider>
      </ThemeProvider>
    </StrictMode>
  );
}
