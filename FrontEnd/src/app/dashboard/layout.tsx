import { ReactNode } from "react";
export default async function DashboardLayout({children}: {children : ReactNode}) {
        return (
        <>
                <main className="flex flex-col ">
                    {children}
              </main>
        </>
    )
}