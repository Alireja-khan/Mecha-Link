import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";


export default function DashboardLayout({ children }) {
    return (
        <div className="flex h-screen">
            <Sidebar></Sidebar>

            <div className="flex-1 flex flex-col">
                <Topbar></Topbar>
                <div className="">
                    <main>{children}</main>
                </div>
            </div>

        </div>
    );
}
