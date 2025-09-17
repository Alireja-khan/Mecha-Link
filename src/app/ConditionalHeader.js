// components/ConditionalHeader.js
"use client";

import Header from "./Components/Header";
import { usePathname } from "next/navigation";

export default function ConditionalFooter() {
    const pathname = usePathname();
    if (pathname.startsWith("/dashboard")) return null;
    return <Header />;
}
