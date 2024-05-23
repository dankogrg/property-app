"use server";

const { default: connectDB } = require("@/config/database");
const { default: Message } = require("@/models/Message");
const { getSessionUser } = require("@/utils/getSessionUser");
const { revalidatePath } = require("next/cache");

async function deleteMessage(messageId) {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.user) {
        throw new Error("User ID is required");
    }

    const { userId } = sessionUser;

    const message = await Message.findById(messageId);

    if (!message) throw new Error("Message Not Found");

    // Verify ownership
    if (message.recipient.toString() !== userId) {
        throw new Error("Unauthorized");
    }
    revalidatePath("/messages", "page");
    await message.deleteOne();
}

export default deleteMessage;
