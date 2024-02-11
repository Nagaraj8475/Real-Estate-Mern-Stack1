import React, { useContext, useState,useEffect } from "react";
import UserDetailContext from "../../context/UserDetailContext.js";


import SearchBar from "../../components/SearchBar/SearchBar";
import useProperties from "../../hooks/useProperties";
import { PuffLoader } from "react-spinners";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import "../Properties/Properties.css";
import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";

const Bookings = () => {
  const { data, isError, isLoading } = useProperties();
console.log(data);

  const [filter, setFilter] = useState("");
  const [bookdata, setBookdata] = useState([]);
  const {
    userDetails: { token, bookings },
    setUserDetails,
  } = useContext(UserDetailContext);


  ///////////////////
  const getOrders = async () => {
    const token=JSON.parse(localStorage.getItem("auth")).token
   const email= JSON.parse(localStorage.getItem("auth")).user.email

   console.log(email+"------"+token)
    try {
      const  book_arr  = await axios.post(
        `http://localhost:8000/api/user/allBookings`,
        {
          email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
const bookdt=book_arr.data.bookedVisits
 
console.log(book_arr.data.bookedVisits)
    
        localStorage.setItem("bookings_store", JSON.stringify( {
          bookdt
        }));
      
  
      setUserDetails((prev) => ({
        ...prev,
  
        bookings: 
      
  
  
          bookdt
        ,
      }));

      setBookdata(book_arr.data.bookedVisits);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
     getOrders();
  }, []);

  /////////////////

  if (isError) {
    return (
      <div className="wrapper">
        <span>Error while fetching data</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="wrapper flexCenter" style={{ height: "60vh" }}>
        <PuffLoader
          height="80"
          width="80"
          radius={1}
          color="#4066ff"
          aria-label="puff-loading"
        />
      </div>
    );
  }
  return (
    <div className="wrapper">
      <div className="flexColCenter paddings innerWidth properties-container">
        <SearchBar filter={filter} setFilter={setFilter} />

        <div className="paddings flexCenter properties">
          {
            // data.map((card, i)=> (<PropertyCard card={card} key={i}/>))  //done by sir
            data
              .filter((property) =>
              bookdata?.map((booking) => booking.id).includes(property._id)  //done by me
              )
            // data
            // .filter((property) =>
            //   bookings.map((booking) => booking.id).includes(property.id)
            // )

              .filter(
                (property) =>
                  property.title.toLowerCase().includes(filter.toLowerCase()) ||
                  property.city.toLowerCase().includes(filter.toLowerCase()) ||
                  property.country.toLowerCase().includes(filter.toLowerCase())
              )
              .map((card, i) => (
                <PropertyCard card={card} key={i} />
              ))
          }
        </div>
      </div>
    </div>
  );
};

export default Bookings;
