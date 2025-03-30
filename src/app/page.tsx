import Navigation from "./components/Navigation";
import Products from "./components/Products";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen p-8">
        <h1 className="text-center text-2xl font-bold">
          Welcome to ShopShifter
        </h1>
        <Products />
      </main>
      <Footer />
    </>
  );
}
