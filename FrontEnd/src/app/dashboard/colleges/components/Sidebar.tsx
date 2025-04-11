"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SideBarData } from "../data/SideBar";
import { GraduationCap, Menu } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const pathname = usePathname();

  const linkClasses = (href: string) => {
    console.log(href);
    const isActive = pathname === href || href === "/dashboard/colleges";

    return `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
      isActive
        ? "bg-muted text-primary"
        : "text-muted-foreground hover:text-primary hover:bg-muted"
    }`;
  };

  return (
    <div>
      {/* Mobile Sidebar (Sheet) */}
      <div className="p-3 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="border">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-[280px] p-4">
            <SheetHeader className="mb-6">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                <SheetTitle className="text-xl font-bold">EduFlow</SheetTitle>
              </div>
            </SheetHeader>

            <div className="space-y-2">
              <h2 className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                College Dashboard
              </h2>

              {SideBarData.map((data, index) => (
                <Link
                  key={index}
                  href={data.href}
                  className={linkClasses(data.href)}
                >
                  {data.value}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div
        className="hidden md:block w-[280px] p-4 border-r h-screen fixed top-0 left-0 "
        style={{ background: "rgb(245, 246, 247)" }}
      >
        <div className="flex items-center gap-2 mb-6">
          <GraduationCap className="h-5 w-5 text-primary" />
          <span className="text-xl font-bold">EduFlow</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
            College Dashboard
          </h2>

          {SideBarData.map((data, index) => (
            <Link
              key={index}
              href={data.href}
              className={linkClasses(data.href)}
            >
              {data.value}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
