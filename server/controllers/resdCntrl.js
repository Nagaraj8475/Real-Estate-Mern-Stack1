import asyncHandler from "express-async-handler";

import { prisma } from "../config/prismaConfig.js";
import residencyModel from "../models/residencyModel.js";
import JWT from "jsonwebtoken";



export const createResidency = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    address,
    country,
    city,
    facilities,
    image,
    userEmail,
    // _id
  } = req.body.data;

  console.log(req.body.data);
  try {
    const residency = await new residencyModel({
     
        title,
        description,
        price,
        address,
        country,
        city,
        facilities,
        image,
        userEmail,
          owner:userEmail
        // owner:_id
        // owner: { connect: { email: userEmail } },
      
    });
    residency.save();
    res.send({ message: "Residency created successfully", residency });
  } catch (err) {
    if (err.code === "P2002") {
      throw new Error("A residency with address already there");
    }
    throw new Error(err.message);
  }
});

// function to get all the documents/residencies
export const getAllResidencies = asyncHandler(async (req, res) => {
  const residencies = await residencyModel.find().sort({createdAt:-1});
  console.log(residencies)

  res.send(residencies);
});

// function to get a specific document/residency
export const getResidency = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // const residency = await prisma.residency.findUnique({
      const residency = await residencyModel.findOne({_id:id});

      
    
    res.send(residency);
  } catch (err) {
    throw new Error(err.message);
  }
});
