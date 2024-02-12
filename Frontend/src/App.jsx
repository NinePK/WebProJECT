import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
} from "react-router-dom";
import Home from "./pages/home";
import Login from "./component/login";
import Register from "./component/register";
import Bedroom from "./pages/bedroom/bedroom.jsx";
import Bathroom from "./pages/bathroom/bathroom.jsx";
import Kitchen from "./pages/kitchen/kitchen.jsx";
import Livingroom from "./pages/livingroom/livingroom.jsx";
import Workspace from "./pages/workspace/workspace.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/bedroom",
    element: <Bedroom />,
  },
  {
    path: "/bathroom",
    element: <Bathroom />,
  },
  {
    path: "/kitchen",
    element: <Kitchen />,
  },
  {
    path: "/livingroom",
    element: <Livingroom />,
  },
  {
    path: "/workspace",
    element: <Workspace />,
  },
]);

function App() {
  return (
    <div className="app">
      <div className="container">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
