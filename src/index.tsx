import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import myRouter from "./routes/Router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/*
 QueryClient로 생성된 Client 인스턴스는 React 앱 내에서 데이터의 fetching, caching, updating 등을 관리하는 컨트롤러이다.
 Mutation은 일반적으로 API 호출을 통해 서버 측 데이터를 변형하는 행위나 작용을 의미하며, 기본적으로 CRUD의 CUD를 포함한다.
 Mutation과 Query와의 차이점은 Query는 주로 데이터를 가지고 오거나(fetch), 읽는 것(read)을 의미하며, Mutation은 데이터를 수정한다.
*/

const myClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={myClient}>
      <RouterProvider router={myRouter} />
    </QueryClientProvider>
  </React.StrictMode>
);
