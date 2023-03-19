import { createBrowserRouter } from "react-router-dom";
import Home from "./Home";
import Root from "./Root";
import Search from "./Search";
import Watch from "./Watch";

const myRouter = createBrowserRouter(
  [
    {
      path: "/",
      element: <Root />,
      children: [
        {
          path: "/",
          element: <Home />,
          errorElement: <h1>Page Not Found</h1>,
        },
        {
          path: "/movies/:movieId",
          element: <Home />,
          errorElement: <h1>Page Not Found</h1>,
        },
        {
          path: "/series",
          element: <span style={{ color: "white" }}>series</span>,
        },
        {
          path: "/trendings",
          element: <span style={{ color: "white" }}>trendings</span>,
        },
        {
          path: "/bookmarks",
          element: <span style={{ color: "white" }}>bookmarks</span>,
        },
        {
          path: "/by-langs",
          element: <span style={{ color: "white" }}>by-langs</span>,
        },
        {
          path: "/watch",
          element: <Watch />,
          errorElement: <h1>Page Not Found</h1>,
        },
        {
          path: "/search",
          element: <Search />,
          errorElement: <h1>Page Not Found</h1>,
        },
      ],
      errorElement: <h1>Page Not Found</h1>,
    },
  ],
  { basename: `${process.env.PUBLIC_URL}/` }
);

export default myRouter;
