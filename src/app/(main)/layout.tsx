import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cookies } from "next/headers";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isAuthenticated = !!cookieStore.get('access')?.value;


  return (
    <>
      {isAuthenticated && <Navbar />}
      {children}
      {isAuthenticated && <Footer />}
    </>
  );
}