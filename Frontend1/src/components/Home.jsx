import React from "react";
import { motion } from "framer-motion";
import homeImage from "../assets/home.jpg"; 

const categories = [
  { name: "Electronics", image: "https://source.unsplash.com/400x300/?electronics" },
  { name: "Groceries", image: "https://source.unsplash.com/400x300/?grocery" },
  { name: "Clothing", image: "https://source.unsplash.com/400x300/?clothes" },
  { name: "Furniture", image: "https://source.unsplash.com/400x300/?furniture" },
];

export default function HomePage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center text-white"
      style={{ backgroundImage: `url(${homeImage})` }}
    >
      <div className="backdrop-blur-sm bg-black/40 p-10 rounded-2xl max-w-5xl w-full text-center shadow-2xl">
        <motion.h1
          className="text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to One Desktop Solution
        </motion.h1>
        <motion.p
          className="text-lg mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Manage inventory, billing, returns & cloud sync — all in one app.
        </motion.p>

        <motion.div
          className="flex justify-center gap-6 flex-wrap mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold transition duration-300 shadow-lg">
            Get Started
          </button>
          <button className="bg-transparent border border-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-black transition duration-300">
            Learn More
          </button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              className="rounded-xl overflow-hidden shadow-lg bg-white text-black"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <img src={cat.image} alt={cat.name} className="h-40 w-full object-cover" />
              <div className="p-4 font-semibold text-center">{cat.name}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
