import {
    createBrowserRouter,
  } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Blogs from "../Page/Blogs/Blogs";
import Login from "../Page/Login/Login";
import Signup from "../Page/Signup/Signup";

export const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout/>,
      children: [
        {
            path: "/",
            element: <Blogs/>
        },
        {
          path: "/login",
          element: <Login/>
        },
        {
          path: "/signup",
          element: <Signup/>
        }
      ]
    },
  ]);