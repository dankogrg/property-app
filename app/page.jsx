import FeaturedProperties from "@/components/FeaturedProperties";
import Hero from "@/components/Hero";
import HomeProperties from "@/components/HomeProperties";
import Infoboxes from "@/components/Infoboxes";

const HomePage = () => {
    return (
        <div>
            <Hero />
            <Infoboxes />
            <FeaturedProperties />
            <HomeProperties />
        </div>
    );
};

export default HomePage;
