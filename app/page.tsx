import { Passowrd } from "@/app/passowrd";
import { Pativales } from "./pativales";
import MemeGenerator from "./meme";

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24">
        <Pativales />
        <MemeGenerator />
        <Passowrd />
      </main>
    </>
  );
}
