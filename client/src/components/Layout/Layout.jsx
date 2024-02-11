import React, { useContext, useEffect } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
// import { useAuth } from "../../context/auth";
//  const [auth, setAuth] = useAuth();

const auth = localStorage.getItem("auth");

import UserDetailContext from "../../context/UserDetailContext";
import { useMutation } from "react-query";
import { createUser } from "../../utils/api";
import useFavourites from "../../hooks/useFavourites";
import useBookings from "../../hooks/useBookings";

const Layout = () => {

  useFavourites()
  useBookings()

  const { isAuthenticated, user, getAccessTokenWithPopup } = useAuth0();
  const { setUserDetails } = useContext(UserDetailContext);

  const { mutate } = useMutation({
    mutationKey: [auth?.user?.email],
    mutationFn: (token) => createUser(auth.user?.email, token),
  });

  useEffect(() => {
    const getTokenAndRegsiter = async () => {

      // const res = await getAccessTokenWithPopup({
      //   authorizationParams: {
      //     audience: "http://localhost:8000",
      //     scope: "openid profile email",
      //   },
      // });
      // localStorage.setItem("access_token", res);
      localStorage.setItem("access_token", auth.token);

      setUserDetails((prev) => ({ ...prev, token: auth.token }));
      mutate(res)
    };


    auth?.token && getTokenAndRegsiter();
  }, [auth?.token]);

  return (
    <>
      <div style={{ background: "var(--black)", overflow: "hidden" }}>
        <Header />
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
