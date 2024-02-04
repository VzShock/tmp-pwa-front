"use client";
import "bootstrap/dist/css/bootstrap.css";
import RecipeCard from "@/components/recipes/RecipeCard";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

//components
import RecipeDetailsModal from "@/components/recipes/RecipeDetailsModal";
import { SimpleFloatingNav } from "@/components/navbar/SimpleFloatingNav";
import axios from "axios";

// Define a type for the recipe
type Recipe = {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  image: string;
  createdAt: string;
  rating: number;
};

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  //router hook
  const router = useRouter();

  // const generateRandomRecipes = (): Recipe[] => {
  //   return Array.from({ length: 5 }).map((_, index) => ({
  //     id: String(index),
  //     title: `Random Recipe ${index + 1}`,
  //     description: "A delicious random recipe.",
  //     ingredients: ["Ingredient 1", "Ingredient 2"],
  //     steps: ["Step 1", "Step 2"],
  //     pictures: [
  //       "https://www.bienmanger.com/tinyMceData/images/contents/851/content_lg.jpg",
  //     ],
  //     createdAt: new Date().toISOString(),
  //   }));
  // };

  useEffect(() => {
    // Fetch recipes from the local JSON file
    const fetchRecipes = async () => {
      const response = await fetch("/assets/recipes.json");
      const data = await response.json();

      console.log(data);

      setRecipes(
        data.map((recipe: any, index: number) => ({
          ...recipe,
          id: String(index), // Assuming your JSON doesn't include an 'id' field
        }))
      );
    };

    fetchRecipes();
  }, []);

  const openModalWithRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const recipeCards =
    Array.isArray(recipes) &&
    recipes.map((recipe, index) => (
      <div key={recipe.id} className="flex justify-center pb-4">
        {" "}
        {/* Use recipe.id instead of index */}
        <div
          key={recipe.id + "-card"}
          onClick={() => openModalWithRecipe(recipe)}
          className="cursor-pointer"
        >
          <RecipeCard {...recipe} />{" "}
          {/* Ensure RecipeCard can handle this structure */}
        </div>
      </div>
    ));

  return (
    <div className="pt-24">
      <div className="container p-4">
        <SimpleFloatingNav />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <motion.div
            whileHover={{
              rotate: 3600,
              scale: 1.1,
              transition: {
                rotate: { duration: 20, ease: "linear" },
                scale: { duration: 0.3 },
              },
            }}
            style={{
              display: "inline-block", // Ensure the motion div wraps tightly around the icon
            }}
          ></motion.div>
        </div>

        {/* Display a message if there are no recipes */}
        {recipes.length === 0 && (
          <div className="flex italic text-neutral-500 items-center justify-center">
            <p>No recipes yet.</p>
          </div>
        )}

        <div className="">{recipeCards}</div>
        <AnimatePresence>
          {isModalOpen && selectedRecipe && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 z-50 flex justify-center items-start p-8 bg-slate-900/20 backdrop-blur-md overflow-y-auto"
            >
              <motion.div
                initial={{ scale: 0, rotate: "12.5deg" }}
                animate={{ scale: 1, rotate: "0deg" }}
                exit={{ scale: 0, rotate: "0deg" }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg bg-white rounded-lg shadow-xl overflow-y-auto h-full"
              >
                <RecipeDetailsModal
                  {...selectedRecipe} // TypeScript knows selectedRecipe is not null here
                  onClose={() => setIsModalOpen(false)}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
