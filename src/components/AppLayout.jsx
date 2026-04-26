import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { BottomNav } from "@/components/BottomNav";

export const AppLayout = () => (
  <SidebarProvider defaultOpen>
    <div className="min-h-screen flex w-full bg-background">
      <div className="hidden md:block">
        <AppSidebar />
      </div>
      {/* <div className="flex-1 flex flex-col min-w-0"> */}
      {/* <div className="flex-1 flex flex-col min-w-0 md:ml-64"> */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-[11rem]">
        <header className="h-14 flex items-center gap-3 border-b border-border bg-card/60 backdrop-blur px-4 md:px-8 sticky top-0 z-30">
          <SidebarTrigger className="hidden md:flex" />
          <div className="md:hidden flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
              T
            </div>
            <span className="font-bold">Trust Cash</span>
          </div>
        </header>
        <main className="flex-1 px-4 md:px-10 py-6 pb-24 md:pb-10 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  </SidebarProvider>
);

// import { SidebarInset } from "@/components/ui/sidebar";

// export const AppLayout = () => (
  // <SidebarProvider defaultOpen>
    
  //   <AppSidebar />

  //   <SidebarInset>
  //     <header className="h-14 flex items-center gap-3 border-b bg-card/60 backdrop-blur px-4 md:px-6 sticky top-0 z-30">
  //       <SidebarTrigger />
  //     </header>

  //     <main className="flex-1 px-4 md:px-8 py-6 pb-24 md:pb-10 max-w-[1400px] w-full mx-auto">
  //       <Outlet />
  //     </main>

  //     <div className="md:hidden">
  //       <BottomNav />
  //     </div>
  //   </SidebarInset>

  // </SidebarProvider>
  // <SidebarProvider defaultOpen>
  //   <AppSidebar />

  //   <SidebarInset>
  //     <header className="h-14 flex items-center gap-3 border-b px-4 sticky top-0 z-30">
  //       <SidebarTrigger />
  //     </header>

  //     <main className="flex-1 px-4 py-6 pb-24">
  //       <Outlet />
  //     </main>

  //     <div className="md:hidden">
  //       <BottomNav />
  //     </div>
  //   </SidebarInset>
  // </SidebarProvider>
// );



