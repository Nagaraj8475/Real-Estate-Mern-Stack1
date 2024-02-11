import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    
      trim: true,
    },
    email: {
      type: String,
     
      unique: true,
    },
    image: {
        type: String,     
      },
      bookedVisits: [{
        type: Object,     
      }],
      favResidenciesID: [{
        type: String,     
      }],
      ownedResidencies: [{
        type: mongoose.Schema.Types.ObjectId,
		ref: "residency",    
      }],
  
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
     
    },
 
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);
