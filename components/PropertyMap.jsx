"use client";
import "mapbox-gl/dist/mapbox-gl.css";
import pin from "@/assets/images/pin.svg";
import { useEffect, useState } from "react";
import { fromAddress, setDefaults } from "react-geocode";
import Spinner from "./Spinner";
import { Map, Marker } from "react-map-gl";
import Image from "next/image";

const PropertyMap = ({ property }) => {
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const [viewport, setViewport] = useState({
        latitude: 0,
        longitude: 0,
        zoom: 12,
        width: "100%",
        height: "500px",
    });
    const [loading, setLoading] = useState(true);

    setDefaults({
        key: process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY,
        language: "en",
        region: "hr",
    });

    useEffect(() => {
        const fetchCords = async () => {
            const res = await fromAddress(
                `${property.location.street} ${property.location.city} ${property.location.state} ${property.location.zipcode}`
            );
            const { lat, lng } = res.results[0].geometry.location;
            setLat(lat);
            setLng(lng);
            setViewport({
                ...viewport,
                latitude: lat,
                longitude: lng,
            });
            setLoading(false);
        };

        fetchCords();
    }, []);

    if (loading) {
        return <Spinner loading={loading} />;
    }

    return (
        !loading && (
            <Map
                mapboxAccesToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                mapLib={import("mapbox-gl")}
                initialViewState={{
                    longitude: lng,
                    latitude: lat,
                    zoom: 15,
                }}
                style={{ width: "100%", height: 500 }}
                mapStyle="mapbox://styles/mapbox/streets-v9"
            >
                <Marker longitude={lng} latitude={lat} anchor="bottom">
                    <Image src={pin} alt="location" width={40} height={40} />
                </Marker>
            </Map>
        )
    );
};
export default PropertyMap;