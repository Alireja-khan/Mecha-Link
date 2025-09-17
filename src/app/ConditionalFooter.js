// components/ConditionalHeader.js
"use client";

import Footer from "./Components/Footer";
import { usePathname } from "next/navigation";

export default function ConditionalHeader() {
    const pathname = usePathname();
    if (pathname.startsWith("/dashboard")) return null;
    return <Footer />;
}
