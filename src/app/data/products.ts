export interface Product {
  serialNumber: number;
  name: string;
  image: string;
  alt: string;
  price: number;
}

export const products: Product[] = [
  {
    serialNumber: 1,
    name: "White Watch",
    image: "/products/product1.jpg",
    alt: "A Beautiful White Watch",
    price: 19.99,
  },
  {
    serialNumber: 2,
    name: "Black Headphones",
    image: "/products/product2.jpg",
    alt: "A Beautiful Black Headphones",
    price: 31.99,
  },
  {
    serialNumber: 3,
    name: "White Camera",
    image: "/products/product3.jpg",
    alt: "A Beautiful White Camera",
    price: 49.99,
  },
  {
    serialNumber: 4,
    name: "White Airpods",
    image: "/products/product4.jpg",
    alt: "A Beautiful White Airpods",
    price: 74.99,
  },
];
