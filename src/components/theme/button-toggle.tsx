"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ComponentProps, FC } from 'react';
import { useTheme } from 'better-themes';

interface IProps extends Omit<ComponentProps<typeof Button>, 'onClick'> {}

export const ThemeButtonToggle: FC<IProps> = ({ ...btnProps }) => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      size="icon"
      variant="outline"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      {...btnProps}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}