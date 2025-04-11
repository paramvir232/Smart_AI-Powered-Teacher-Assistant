// components/LoginDialog.tsx
"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { TeacherLogin } from "./TeacherLogin";
import { StudentLogin } from "./StudentLogin";
import { CollegeLogin } from "./CollegeLogin";

interface LoginDialogProps {
  buttonLabel: string;
  buttonClassName?: string;
}

export function LoginDialog({ buttonLabel, buttonClassName = "" }: LoginDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={buttonClassName}>
          {buttonLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="flex justify-center items-center">
        <DialogHeader className="w-full">
          <DialogTitle className="text-center mb-2 text-2xl">Log In</DialogTitle>
          <DialogDescription className="flex flex-col items-center">
            <Tabs defaultValue="account" className="w-[100%] max-w-[400px]">
              <TabsList className="flex justify-center w-full mb-4">
                <TabsTrigger value="Teacher">Teacher</TabsTrigger>
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="College">College</TabsTrigger>
              </TabsList>
              <TabsContent value="Teacher">
                <TeacherLogin />
              </TabsContent>
              <TabsContent value="student">
                <StudentLogin />
              </TabsContent>
              <TabsContent value="College">
                <CollegeLogin/>
              </TabsContent>
            </Tabs>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
