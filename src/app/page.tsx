"use client";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import RecipeCard from "@/components/recipes/RecipeCard";
import { AnimatePresence, motion } from "framer-motion";
import RecipeDetailsModal from "@/components/recipes/RecipeDetailsModal";
import { SimpleFloatingNav } from "@/components/navbar/SimpleFloatingNav";
import StaggeredDropDown from "@/components/DropDown/StaggeredDropDown";

type Recipe = {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  image: string;
  createdAt: string;
  rating: number;
  categories: string[];
};

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [language, setLanguage] = useState("fr");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const filePath = `/assets/recipes_${language}.json`;
      const response = await fetch(filePath);
      const data: Recipe[] = await response.json(); // Specify the expected type
      setRecipes(
          data.map((recipe, index) => ({
            ...recipe,
            id: String(index),
          })).reverse()
      );

      // Extract unique categories
      const categories = Array.from(new Set(data.flatMap(recipe => recipe.categories)));
      setUniqueCategories(categories);
    };
    fetchRecipes();
  }, [language]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isModalOpen]);

  const openModalWithRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategories((prevCategories) =>
        prevCategories.includes(category)
            ? prevCategories.filter((cat) => cat !== category)
            : [...prevCategories, category]
    );
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearchTerm = recipe.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesCategories =
        selectedCategories.length === 0 ||
        selectedCategories.every((category) =>
            recipe.categories.includes(category)
        );
    return matchesSearchTerm && matchesCategories;
  });

  const recipeCards = filteredRecipes.map((recipe) => (
      <div key={recipe.id} className="flex justify-center pb-4">
        <div
            onClick={() => openModalWithRecipe(recipe)}
            className="cursor-pointer"
        >
          <RecipeCard {...recipe} />
        </div>
      </div>
  ));

  return (
      <div className="pt-24">
        <div className="container px-4">
          <SimpleFloatingNav
              setSearchTerm={setSearchTerm}
              searchTerm={searchTerm}
              language={language}
              setLanguage={setLanguage}
          />
          <div className="container mb-4 d-flex flex-column align-items-center justify-content-center">
            <div className="mb-4">
              <StaggeredDropDown
                  selectedCategories={selectedCategories}
                  categories={uniqueCategories}
                  onCategorySelect={handleCategoryClick}
              />
            </div>
            {/*<div className="d-flex flex-wrap justify-content-center">*/}
            {/*  {selectedCategories.map((category) => (*/}
            {/*      <button*/}
            {/*          key={category}*/}
            {/*          className={`btn btn-sm m-1`}*/}
            {/*          style={*/}
            {/*            selectedCategories.includes(category)*/}
            {/*                ? { backgroundColor: "#63a375", color: "white" }*/}
            {/*                : { backgroundColor: "#ff84e8", color: "white" }*/}
            {/*          }*/}
            {/*          onClick={() => handleCategoryClick(category)}*/}
            {/*      >*/}
            {/*        {category}*/}
            {/*      </button>*/}
            {/*  ))}*/}
            {/*</div>*/}
          </div>

          {recipes.length === 0 ||
              (filteredRecipes.length === 0 && (
                  <div className="ml-80 mr-80 h-16 bg-white flex italic text-neutral-500 items-center justify-center">
                    <p>No recipes yet.</p>
                  </div>
              ))}
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
                        {...selectedRecipe}
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
