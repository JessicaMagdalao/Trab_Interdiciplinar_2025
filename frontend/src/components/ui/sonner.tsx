import * as React from "react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

interface CustomToasterProps extends ToasterProps {}

export function Toaster(props: CustomToasterProps) {
  const { theme } = useTheme();

  // Garantir que o theme seja um valor aceito pelo Sonner
  const safeTheme: "light" | "dark" | "system" | undefined =
    theme === "light" || theme === "dark" || theme === "system"
      ? theme
      : "system";

  return (
    <Sonner
      theme={safeTheme}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
}
