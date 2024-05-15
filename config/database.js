import mongoose from "mongoose";

let connected = false;

const connectDB = async () => {
    mongoose.set("strictQuery", true);

    // if the database is already connected, don't connect agaisn
    if (connected) {
        console.log("MongoDB is already connected...");
        return;
    }

    // Connect to MongoDB
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        connected = true;
        console.log("MOngoDB connected...");
    } catch (error) {
        console.log(error);
    }
};

export default connectDB;
