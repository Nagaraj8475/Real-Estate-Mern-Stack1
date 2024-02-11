import mongoose from "mongoose";

const residencySchema = new mongoose.Schema(
  {
    title: {
      type: String,
    
    },
    description: {
      type: String,      
    },
    price: {
        type: Number,      
      },
      address: {
        type: String,     
      },
      city: {
        type: String,     
      },
      country: {
        type: String,     
      },
      image: {
        type: String,     
      },
      facilities: {
        type: Object,     
      },
      userEmail: {
        type: String,     
      },
      owner:{
        type: mongoose.Schema.Types.ObjectId,
		ref: "users",    
      },
      createdAt: {
		type: Date,default: Date.now
		
	},
    updatedAt: {
		type: Date,default: Date.now
		
	}

  

  },
  { timestamps: true }
);

export default mongoose.model("residency", residencySchema);
