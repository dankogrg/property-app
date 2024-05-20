"use client";

import { useGlobalContext } from "@/context/GlobalContext";
import { useState } from "react";
import { toast } from "react-toastify";

const Message = ({ message }) => {
    const [isRead, setIsread] = useState(message.read);
    const [deleted, setDeleted] = useState(false);

    const { setUnreadCount } = useGlobalContext();

    const handleReadClick = async () => {
        try {
            const res = await fetch(`/api/messages/${message._id}`, {
                method: "PUT",
            });

            if (res.status === 200) {
                const { read } = await res.json();
                setIsread(read);
                setUnreadCount((prevCount) =>
                    read ? prevCount - 1 : prevCount + 1
                );
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/messages/${message._id}`, {
                method: "DELETE",
            });

            if (res.status === 200) {
                setDeleted(true);
                if (!isRead) {
                    setUnreadCount((prevCount) => prevCount - 1);
                }

                toast.success("Message deleted");
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };

    return deleted ? null : (
        <div className="relative bg-white p-4 rounded-md shadow-md border border-gray-200">
            {!isRead && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-md">
                    New
                </div>
            )}
            <h2 className="text-xl mb-4">
                <span className="font-bold">Property Inquiry:</span>{" "}
                {message.property.name}
            </h2>
            <p className="text-gray-700">{message.body}</p>

            <ul className="mt-4">
                <li>
                    <strong>Name:</strong> {message.sender.username}
                </li>

                <li>
                    <strong>Reply Email:</strong>
                    <a
                        href={`mailto:${message.email}`}
                        className="text-blue-500"
                    >
                        {" "}
                        {message.email}
                    </a>
                </li>
                <li>
                    <strong>Reply Phone:</strong>
                    <a href={`tel:${message.phone}`} className="text-blue-500">
                        {" "}
                        {message.phone}
                    </a>
                </li>
                <li>
                    <strong>Received:</strong>{" "}
                    {new Date(message.createdAt).toLocaleString("hr")}
                </li>
            </ul>
            <button
                onClick={handleReadClick}
                className={`mt-4 mr-3 ${
                    isRead ? `bg-gray-500` : `bg-blue-500 text-white`
                }   py-1 px-3 rounded-md`}
            >
                {isRead ? "Mark as new" : "Mark as read"}
            </button>
            <button
                onClick={handleDelete}
                className="mt-4 bg-red-500 text-white py-1 px-3 rounded-md"
            >
                Delete
            </button>
        </div>
    );
};
export default Message;
