"use client"
import dynamic from "next/dynamic";

const MapWithSearch = dynamic(() => import("./MapWithSearch"), {
  ssr: false,
});

export default function Map() {
  return <MapWithSearch />;
}
