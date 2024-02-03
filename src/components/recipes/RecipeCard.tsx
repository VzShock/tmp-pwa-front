"use client";
import styles from "./recipecard.module.css";
import { useState } from "react";

// interface RecipeCardProps {
//   title: string;
//   user: string;
//   description: string;
//   imageUrl: string;
//   rating: number;
// }

type RecipeCardProps = {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  pictures: string[];
  userId: string;
  createdAt: string;
};

const RecipeCard: React.FC<RecipeCardProps> = ({
  id,
  title,
  description,
  ingredients,
  steps,
  pictures,
  userId,
  createdAt,
}) => {
  // Function to generate the rating squares
  const renderRating = () => {
    // generate a random number
    const random = Math.floor(Math.random() * 5) + 1;

    return [...Array(5)].map((_, i) => (
      <div
        key={i}
        className={`${styles.diamond} ${
          i < random ? styles.diamond : styles.diamond_white
        }`}
      ></div>
    ));
  };

  return (
    <div
      className={`${styles.recipecard} bg-white max-w-lg rounded overflow-hidden shadow-lg flex`}
    >
      <div className="flex-none w-48 relative">
        <img
          src={pictures[0] ? pictures[0] : "/assets/placeholder.png"}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover rounded-l"
        />
      </div>
      <div className="px-6 py-4 flex flex-col justify-between">
        <div>
          <div className="font-bold text-xl mb-2">{title}</div>
          <p className="text-gray-700 text-base">@{userId}</p>
          <div className="flex my-1">{renderRating()}</div>
        </div>
        <p className="text-gray-700 text-base overflow-ellipsis overflow-hidden">
          {description.length > 120
            ? `${description.substring(0, 120)}...`
            : description}
        </p>
      </div>
    </div>
  );
};

export default RecipeCard;
