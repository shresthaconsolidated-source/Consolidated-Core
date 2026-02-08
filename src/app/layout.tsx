import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DataProvider } from "@/context/DataContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Consolidated Core - Education Consultancy OS",
    description: "The Operating System Built for Nepal's Education Consultancies",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <DataProvider>
                    {children}
                </DataProvider>
            </body>
        </html>
    );
}
