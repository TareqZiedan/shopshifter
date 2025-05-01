import Products from "./components/Products";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-center text-2xl font-bold">Welcome to ShopShifter</h1>
      <Products />
    </main>
  );
}
