import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-6xl font-bold">Welcome To MechaLink</h1>
        <p>👉 You only run create-react-app (or npm create vite@latest, npx next, etc.) if you are starting a brand new project.
          So for cloning and running an existing repo → just clone, install, and run.
          Do you want me to also show you what to do if the cloned repo uses Vite or Next.js instead of CRA?</p>

  
          <button>Hello world!</button>
          <button>Hello world!</button>
          <button>Hello world!</button>


          <button>Don't Click</button>
          <button className=" border-2 py-3 px-5">Click Me</button>
          <button onClick={alert("besi jore chap diye felechen")} className=" border-2 py-3 px-5">Jore click korun</button>

          <button>Click me!</button>
 main
      </main>
    </div>
  ); 
}
