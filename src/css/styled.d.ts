import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    mainColor: string;
    darkColor: {
      darker: string;
      lighter: string;
    };
    textColor: string;
    opaqueColor: string;
  }
}
