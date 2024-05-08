import React from "react";
import "@/assets/styles/globals.css";

export const metadata = {
    title: "Property-app | Find The Perfect Rental",
    description: "Find your dream rental property",
    keywords: "rental, find rentals, find properties",
};

const MainLayout = ({ children }) => {
    return (
        <html lang="en">
            <body>
                <div>{children}</div>;
            </body>
        </html>
    );
};

export default MainLayout;
