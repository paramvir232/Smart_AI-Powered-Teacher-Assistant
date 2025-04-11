"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../../../components/ui/dropdown-menu";
import { PersonStandingIcon } from "lucide-react";
import React from "react";

export default function Navbar() {
  return (
    <>
      <div
        className="navbar-container p-2 flex items-center justify-between bg-muted/40 w-full border"
        style={{ background: "rgb(245, 246, 247)" }}
      >
        <div className="menu p-3 "></div>
        <div className="porfile pr-3 md:p-3.5  ">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-full">
                <PersonStandingIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  "use client";
                  sessionStorage.removeItem("teacherId");
                  sessionStorage.removeItem("collegeId");
                  sessionStorage.removeItem("studentId");
                  window.location.href = "/";
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
}
