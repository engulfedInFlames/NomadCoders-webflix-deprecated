import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    mainColor: string;
    bgColor: string;
    textColor: string;
    opaqueColor: string;
  }
}
