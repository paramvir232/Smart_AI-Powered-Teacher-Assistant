declare module "sonner" {
    import * as React from "react";
  
    export interface ToasterProps extends React.HTMLAttributes<HTMLDivElement> {
      theme?: "light" | "dark" | "system";
    }
  
    export const Toaster: React.FC<ToasterProps>;
    export const toast: (message: string, options?: any) => void;
  }
  