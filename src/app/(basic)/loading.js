"use client";

import { mirage } from "ldrs";
mirage.register();

export default function Loader() {
  return (
    <div className="flex items-center justify-center h-screen text-primary">
      <l-mirage
        size="75"
        speed="2.5"
        color="currentColor"
      ></l-mirage>
    </div>
  );
}


// "use client";

// export default function Loader() {
//   return (
//     <div className="flex items-center justify-center h-screen bg-white">
//       <img
//         src="/Gear.gif"
//         alt="Loading..."
//         className="w-20 h-20"
//       />
//     </div>
//   );
// }