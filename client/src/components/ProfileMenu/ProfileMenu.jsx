import React from 'react'
import {Avatar, Menu} from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { useAuth } from "../../context/auth";
import { toast } from "react-toastify";


const ProfileMenu = ({user, logout}) => {
  const [auth, setAuth] = useAuth();

    const navigate = useNavigate()
  return (
    <Menu>
        <Menu.Target>
            <Avatar src={user?.picture} alt='user image' radius={"xl"}/>
        </Menu.Target>
        <Menu.Dropdown>
            <Menu.Item onClick={()=> navigate("./favourites", {replace: true})}>
                Favourites
            </Menu.Item>

            <Menu.Item onClick={()=> navigate("/bookings", {replace: true})}>
                Bookings
            </Menu.Item>

            <Menu.Item onClick={()=>{
                // localStorage.clear();
                // logout()
                setAuth({
                    ...auth,
                    user: null,
                    token: "",
                  });
              
                  localStorage.removeItem("auth");
                  localStorage.clear();
              
                  toast.success("Logout Successfully");
                  navigate("/login", {replace: true})


                //   to="/login"
                    // className="dropdown-item"
             
            }}>
                Logout
            </Menu.Item>
        </Menu.Dropdown>
    </Menu>
  )
}

export default ProfileMenu