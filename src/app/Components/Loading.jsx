
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