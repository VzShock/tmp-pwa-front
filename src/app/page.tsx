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
import { IoIosRefreshCircle } from "react-icons/io";

// Define a type for the recipe
type Recipe = {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  pictures: string[];
  userId: string;
  createdAt: string;
};

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  //router hook
  const router = useRouter();

  useEffect(() => {
    // Check for the presence of an access token in localStorage
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      // Redirect to the Login page if there is no access token
      router.push("/login");
    }

    // Fetch the user's recipes
    getMyRecipes();
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

  const getMyRecipes = async () => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      return;
    }

    try {
      const response = await axios.get(
        "http://victoire-rabeau.com:3000/posts",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = response.data.data;

      // setRecipes using the array in response.data so it's a map of recipes
      setRecipes(data);

      // setRecipes(response.data); // Update the recipes state with fetched data
      // sort the recipes by date created in descending order
      setRecipes((recipes) =>
        recipes.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    } catch (error) {
      console.error("Error fetching recipe details:", error);
    }
  };

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
          >
            <IoIosRefreshCircle
              onClick={getMyRecipes}
              style={{
                color: "#63a375",
                width: "40px",
                height: "40px",
                cursor: "pointer",
              }}
            />
          </motion.div>
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
