import asyncHandler from "express-async-handler";

import { prisma } from "../config/prismaConfig.js";



import userModel from "../models/userModel.js";

import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    //validations
    if (!name) {
      return res.send({ error: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone no is Required" });
    }
    if (!address) {
      return res.send({ message: "Address is Required" });
    }
    if (!answer) {
      return res.send({ message: "Answer is Required" });
    }
    //check user
    const exisitingUser = await userModel.findOne({ email });
    //exisiting user


    if (exisitingUser) {
      return res.status(201).send({
        
        message: "Already Register please login",
      });
    }
    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();
 
    res.status(201).send({
      message: "User registered successfully",
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Errro in Registeration",
      error,
    });
  }
};

//POST LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};


export const createUser = asyncHandler(async (req, res) => {
  console.log("creating a user");

  let { email } = req.body;
  // const userExists =await userModel.findOne({email});

  const userExists = await prisma.user.findUnique({ where: { email: email } });
  if (!userExists) {
    const user = await prisma.user.create({ data: req.body });
    res.send({
      message: "User registered successfully",
      user: user,
    });
  } else res.status(201).send({ message: "User already registered" });
});

// function to book a visit to resd
export const bookVisit = asyncHandler(async (req, res) => {
  console.log(req.body)
  const { email1,id1, date } = req.body;
  const { id } = req.params;

  try {
    const alreadyBooked =await userModel.findOne({email:email1}).select({ bookedVisits: 1});
    // const alreadyBooked = await prisma.user.findUnique({      where: { email },      select: { bookedVisits: true }, });
console.log(alreadyBooked);
if(alreadyBooked!=null)
    {
console.log('1');

      if (alreadyBooked.bookedVisits.some((visit) => visit.id === id)) {
console.log('2');

      res
        .status(400)
        .json({ message: "This residency is already booked by you" });

        // res.status(400).send({
        //   message: "This residency is already booked by you",
        //   bookedVisits: alreadyBooked,
        // });
    }
    else {
console.log('3');

      await userModel.findOneAndUpdate({ email:email1 },   { $push: { bookedVisits: { id, date } } },);
    const alreadyBooked1 =await userModel.findOne({email:email1}).select({ bookedVisits: 1});


      // await prisma.user.update({where: { email: email },data: {bookedVisits: { push: { id, date } },},});
      res.send("your visit is booked successfully");
      // res.status(200).send({
      //   message: "your visit is booked successfully",
      //   bookedVisits: alreadyBooked1,
      // });
    } 
  }else {
console.log('4');
console.log(email1+"-----"+id+"------"+date)
// const a_update=await userModel.update({
//   "title": "this is a list",
//   "todo.completed": false,
//   "todo.description": "a normal task"
// },
// {
//   "$set": {
//     "todo.$.description": "new description"
//   }
// })
      const a_update=await userModel.findOneAndUpdate({ email:email1 },   { $push: { bookedVisits: [{ id, date }] } },);
      console.log('hi')

      console.log(a_update)
      const alreadyBooked2 =await userModel.findOne({email:email1}).select({ bookedVisits: 1});
      // await prisma.user.update({where: { email: email },data: {bookedVisits: { push: { id, date } },},});
      res.send("your visit is booked successfully");
      // res.send({
      //   message: "your visit is booked successfully",
      //   bookedVisits: alreadyBooked2,
      // });
    }
  } catch (err) {
    throw new Error(err.message);
  }
});

// funtion to get all bookings of a user
export const getAllBookings = asyncHandler(async (req, res) => {
  console.log("getAllBookings")
  const { email } = req.body;
  // console.log(req.body)

  try {
    // const bookings = await prisma.user.findUnique({     where: { email },select: { bookedVisits: true },  });
    const bookings = await userModel.findOne({email}).select({ bookedVisits: 1});
    console.log(bookings)

    res.status(200).send(bookings);
  } catch (err) {
    throw new Error(err.message);
  }
});

// function to cancel the booking
export const cancelBooking = asyncHandler(async (req, res) => {
  console.log(req.body)
  const email = req.body.email1;
  const { id } = req.params;

  console.log(email+"*********"+id)
  try {
    // const user = await prisma.user.findUnique({ where: { email: email },select: { bookedVisits: true }, });
    const user = await userModel.findOne({email}).select({ bookedVisits: 1 });

    console.log("user="+user)


    const index = user.bookedVisits.findIndex((visit) => visit.id === id);

    if (index === -1) {
      res.status(404).json({ message: "Booking not found" });
    } else {
      user.bookedVisits.splice(index, 1);
      // await prisma.user.update({where: { email },data: {bookedVisits: user.bookedVisits,},});
      await userModel.findOneAndUpdate({email},{bookedVisits: user.bookedVisits})

      res.send("Booking cancelled successfully");
    }
  } catch (err) {
    throw new Error(err.message);
  }
});

// function to add a resd in favourite list of a user
export const toFav = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { rid } = req.params;
console.log(email)
  try {
    // const user = await prisma.user.findUnique({where: { email },});
    const user= await userModel.findOne({email});
    console.log(user)
console.log("hi 1")
if(user.favResidenciesID==null){
  console.log("hi 4wwwwwwwwwww")
      const updateUser = await userModel.findOneAndUpdate({ email },   { $push: { favResidenciesID: rid } },
      
    );
    console.log("hi 5wwwwwwwwww")
    console.log(updateUser.favResidenciesID.length)

      res.send({ message: "Updated favorites", user: updateUser });
}
  else if (user.favResidenciesID.includes(rid)) {
      console.log("hi 2")
      let arr=user.favResidenciesID;
      arr = arr.filter(val => val !== rid);
      console.log("hi 2222222222222222")
      console.log(arr)
      // const updateUser = await prisma.user.update({where: { email },data: {favResidenciesID: {set: user.favResidenciesID.filter((id) => id !== rid),}, }, });
      // const updateUser = await userModel.findOneAndUpdate({ email },   { $pull: { favResidenciesID: { $in: favResidenciesID.map((id) =>  id ==rid) } } },)
      const up=await userModel.findOneAndUpdate({ email },{favResidenciesID:[]});
      console.log("hi 33333333333333333333")
      const updateUser=await userModel.findOneAndUpdate({ email },{favResidenciesID:arr});
      console.log(updateUser.favResidenciesID.length)

      console.log("hi 3")
      res.send({ message: "Removed from favorites", user: updateUser });
    } else {
      // const updateUser = await prisma.user.update({where: { email },data: {favResidenciesID: {push: rid,},},});
      console.log("hi 4")
      const updateUser = await userModel.findOneAndUpdate({ email },   { $push: { favResidenciesID: rid } },
      // function(err, result) {
      //   if (err) {
      //     res.send(err);
      //   } else {
      //     res.send(result);
      //   }
      // }
    );
    console.log(updateUser.favResidenciesID.length)

    console.log("hi 5")
      res.send({ message: "Updated favorites", user: updateUser });
    }
  } catch (err) {
    throw new Error(err.message);
  }
});

// function to get all favorites
export const getAllFavorites = asyncHandler(async (req, res) => {

  console.log("favResd")


  console.log(req.body)
  const { email } = req.body;
  try {
    const favResd = await userModel.findOne({email}).select({bookedVisits: 1,  favResidenciesID: 1})
    //   where: { email },
    //   select: { favResidenciesID: true },
    // });
    console.log(favResd)
    res.status(200).send(favResd);
  } catch (err) {
    throw new Error(err.message);
  }
});
