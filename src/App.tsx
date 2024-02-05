import { ThemeProvider } from "@/components/theme-provider";
import { useLocation, useRoutes } from "react-router-dom";
import { cloneElement } from "react";
import Header from "./Layout/Header";
import Game from "./Pages/Game";

export default function App(): JSX.Element | null {
  const element = useRoutes([
    {
      path: "/",
      element: <Header />,
      children: [
        {
          path: "/",
          element: <Game />,
        }
      ],
    },
  ]);

  const location = useLocation();
  if (!element) return null;

  return (
    <ThemeProvider>
      {cloneElement(element, { key: location.pathname })}
    </ThemeProvider>
  );
}