"use client";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";

// Define your link types and links as you did before
interface NavProps {
  id: number;
  name: string;
  href: string;
}

// Student Links
export const studentLinks: NavProps[] = [
  {
    id: 4,
    name: "Home",
    href: "/dashboard/student",
  },
  {
    id: 0,
    name: "View Submissions",
    href: "/dashboard/student/submissions",
  },
  {
    id: 1,
    name: "View Profile",
    href: "/dashboard/student/profile",
  },

  {
    id: 3,
    name: "ChatBot",
    href: "/dashboard/student/chatbot",
  },
  {
    id: 4,
    name: "View MST",
    href: "/dashboard/student/viewmst",
  },
  {
    id: 5,
    name: "Calculate SGPA",
    href: "/dashboard/student/sgpa",
  },
  {
    id: 6,
    name: "Solve Quiz",
    href: "/dashboard/student/solvequiz",
  },
];

// Teacher Links
export const teacherLinks: NavProps[] = [
  {
    id: 4,
    name: "Home",
    href: "/dashboard/teacher",
  },
  {
    id: 0,
    name: "Upload Assignment",
    href: "/dashboard/teacher/assignments",
  },
  {
    id: 1,
    name: "View Students",
    href: "/dashboard/teacher/students",
  },
  {
    id: 2,
    name: "View Profile",
    href: "/dashboard/teacher/profile",
  },
  {
    id: 3,
    name: "ChatBot",
    href: "/dashboard/teacher/chatbot",
  },
  {
    id: 4,
    name: "Generate Quiz",
    href: "/dashboard/teacher/generatequiz",
  },
  {
    id: 5,
    name: "Upload Marks",
    href: "/dashboard/teacher/uploadMarks",
  },
  {
    id: 6,
    name: "SendEmail",
    href: "/dashboard/teacher/sendemail",
  },
  {
    id: 7,
    name: "Generate certificate",
    href: "/dashboard/teacher/addcertificate",
  },
];

interface DashboardLinksProps {
  role: "student" | "teacher";
}

export const DashboardLinks = ({ role }: DashboardLinksProps) => {
  const pathname = usePathname();
  const links = role === "student" ? studentLinks : teacherLinks;

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">
        {role === "student" ? "Student Dashboard" : "Teacher Dashboard"}
      </h2>
      {links.map((link) => (
        <Link
          key={link.id}
          href={link.href}
          className={cn(
            "flex items-center gap-3 p-3 rounded-md transition-all",
            pathname === link.href
              ? "bg-muted text-primary font-semibold"
              : "text-muted-foreground hover:text-primary hover:bg-muted"
          )}
        >
          <p className="text-lg">{link.name}</p>
        </Link>
      ))}
    </div>
  );
};
