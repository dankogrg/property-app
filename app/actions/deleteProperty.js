"use server";
import connectDB from "@/config/database";
import { getSessionUser } from "@/utils/getSessionUser";
import cloudinary from "@/config/cloudinary";
import Property from "@/models/Property";
import { revalidatePath } from "next/cache";

async function deleteProperty(propertyId) {
    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
        throw new Error("User ID is required");
    }

    const { userId } = sessionUser;

    await connectDB();

    const property = await Property.findById(propertyId);

    if (!property) throw new Error("Property Not Found");

    // Verify ownership
    if (property.owner.toString() !== userId) {
        throw new Error("Unauthorized");
    }
    // Extract public id's from image url in DB
    const publicIds = property.images.map((imageUrl) => {
        const parts = imageUrl.split("/");
        return parts.at(-1).split(".").at(0);
    });

    // Delete images from cloudinary
    if (publicIds.length > 0) {
        for (let publicId of publicIds) {
            await cloudinary.uploader.destroy("property-app/" + publicId);
        }
    }

    await property.deleteOne();

    revalidatePath("/", "layout");
}

export default deleteProperty;
