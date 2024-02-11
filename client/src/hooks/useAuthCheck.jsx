import {useAuth0} from '@auth0/auth0-react'
// import { useAuth } from "../context/auth";
//  const [auth, setAuth] = useAuth();

import { toast } from "react-toastify";


const authdata = localStorage.getItem("auth");
const useAuthCheck = () => {

    // const {isAuthenticated} = useAuth0()
    const validateLogin = () => {
        if(!authdata)
        {
            toast.error("you must be logged in", {position: "bottom-right"})
            return false
        } else return true
    }
  return (
    {
        validateLogin
    }
  )
}

export default useAuthCheck