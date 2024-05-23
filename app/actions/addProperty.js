"use server";
import cloudinary from "@/config/cloudinary";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function addProperty(formData) {
    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
        throw new Error("User ID is required");
    }

    const { userId } = sessionUser;

    // Access all values from amenities and images
    const amenities = formData.getAll("amenities");

    const images = formData
        .getAll("images")
        .filter((image) => image.name !== "");

    //Create propertyData object for database
    const propertyData = {
        type: formData.get("type"),
        name: formData.get("name"),
        description: formData.get("description"),
        location: {
            street: formData.get("location.street"),
            city: formData.get("location.city"),
            state: formData.get("location.state"),
            zipcode: formData.get("location.zipcode"),
        },
        beds: formData.get("beds"),
        baths: formData.get("baths"),
        square_feet: formData.get("square_feet"),
        amenities,
        rates: {
            weekly: formData.get("rates.weekly"),
            monthly: formData.get("rates.monthly"),
            nightly: formData.get("rates.nightly"),
        },
        seller_info: {
            name: formData.get("seller_info.name"),
            email: formData.get("seller_info.email"),
            phone: formData.get("seller_info.phone"),
        },
        owner: userId,
    };

    // Upload images to Cloudinary
    const imageUrls = [];

    for (const image of images) {
        const imageBuffer = await image.arrayBuffer();
        const imageArray = Array.from(new Uint8Array(imageBuffer));
        const imageDAta = Buffer.from(imageArray);

        // Convert the image data to base64
        const imageBase64 = imageDAta.toString("base64");

        // Make request to upload to Cloudinary
        const result = await cloudinary.uploader.upload(
            `data:image/png;base64,${imageBase64}`,
            { folder: "property-app" }
        );

        imageUrls.push(result.secure_url);
    }

    propertyData.images = imageUrls;

    const newProperty = new Property(propertyData);

    await newProperty.save();

    // Revalidate the cache
    revalidatePath("/", "layout");

    redirect(`/properties/${newProperty._id}`);
}

export default addProperty;
