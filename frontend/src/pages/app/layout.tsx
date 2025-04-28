// src/layout/MarketingLayout.tsx
import React from "react";
import Navbar from "./Navbar";
interface Props { children: React.ReactNode }

export default function MarketingLayout({ children }: Props) {
  return (
    <div className="h-full dark:bg-[#1F1F1F]">
        <Navbar/>
      <main className="h-full pt-40">
        {children}
      </main>
    </div>
  );
}
