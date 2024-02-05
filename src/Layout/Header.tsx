import { ModeToggle } from "@/components/mode-toggle";
import { Outlet } from "react-router-dom";

export default function Header(): JSX.Element {
  return (
    <>
      <header className="prose max-w-none flex justify-between items-center py-4 px-8">
        <h2 className="text-foreground mb-0">Gra w memory</h2>
        <ModeToggle />
      </header>
      <Outlet />
    </>
  );
}
