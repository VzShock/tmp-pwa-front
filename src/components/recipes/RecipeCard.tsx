"use client";
import styles from "./recipecard.module.css";

type RecipeCardProps = {
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  image: string;
  rating: number;
};

const RecipeCard: React.FC<RecipeCardProps> = ({
  title,
  description,
  ingredients,
  steps,
  image,
  rating,
}) => {
  // Function to generate the rating squares
  const renderRating = () => {
    // generate a random number
    const random = Math.floor(Math.random() * 5) + 1;

    return [...Array(10)].map((_, i) => (
      <div
        key={i}
        className={`${styles.diamond} ${
          i < rating ? styles.diamond : styles.diamond_white
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
          src={image ? image : "/assets/placeholder.png"}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover rounded-l"
        />
      </div>
      <div className="px-6 py-4 flex flex-col justify-between">
        <div>
          <div className="font-bold text-xl mb-2">{title}</div>
          {/*<div className="flex my-1">{renderRating()}</div>*/}
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
