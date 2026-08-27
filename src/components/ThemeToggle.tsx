"use client";

import { IconMoon, IconSun } from "./icons";
import { useTheme } from "@/lib/theme";

export function ThemeToggle() {
  const { toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      className="grid h-8 w-8 place-items-center rounded-full text-mute transition hover:bg-hover hover:text-ink sm:h-9 sm:w-9"
      aria-label="Cambiar tema"
      title="Cambiar tema"
    >
      <IconMoon className="h-5 w-5 dark:hidden" />
      <IconSun className="hidden h-5 w-5 dark:block" />
    </button>
  );
}
