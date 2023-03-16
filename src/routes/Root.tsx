import { Outlet } from "react-router-dom";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import Header from "../components/Header";
import { darkTheme } from "../css/theme";

const GlobalStyle = createGlobalStyle`
${reset};
  *{
    box-sizing: border-box;
  }
  a{
    text-decoration: none;
    color:inherit;
  }
  body{
    font-family: 'Noto Sans KR', sans-serif;
    min-height:100vh;
    background-color: ${(props) => props.theme.bgColor};
    font-weight: 400;
    color: ${(props) => props.theme.textColor};
  }
`;

function Root() {
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <GlobalStyle />
        <Header />
        <Outlet />
      </ThemeProvider>
    </>
  );
}

export default Root;
