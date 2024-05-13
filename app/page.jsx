import Hero from "@/components/Hero";
import HomeProperties from "@/components/HomeProperties";
import Infoboxes from "@/components/Infoboxes";
import React from "react";

const HomePage = () => {
    return (
        <div>
            <Hero />
            <Infoboxes />
            <HomeProperties />
        </div>
    );
};

export default HomePage;
