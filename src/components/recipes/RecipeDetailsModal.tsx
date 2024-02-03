import React, { useEffect, useState } from "react";
import styles from "./recipedetails.module.css";
import RecipeSteps from "./RecipeSteps";
import { AnimatePresence, motion } from "framer-motion";
import { render } from "react-dom";
import axios from "axios";

interface RecipeDetailsModalProps {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  pictures: string[];
  userId: string;
  createdAt: string;
  onClose: () => void;
}

interface RecipeDetails {
  id: string;
  userId: string;
  title: string;
  description: string;
  createdAt: string;
  pictures: string[];
  ingredients: string[];
  steps: string[];
  evaluations: [
    {
      id: string;
      rating: number;
      comment: string;
      userId: string;
    }
  ];
}

const RecipeDetailsModal: React.FC<RecipeDetailsModalProps> = ({
  id,
  title,
  description,
  ingredients,
  steps,
  pictures,
  userId,
  createdAt,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState("preview");
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const tabOrder = ["ingredients", "preview", "reviews"];
  const [direction, setDirection] = useState(0);
  const [lastTab, setLastTab] = useState("");
  const [username, setUsername] = useState("");
  const [recipeDetails, setRecipeDetails] = useState<RecipeDetails | null>(
    null
  );
  const [ingredientsList, setIngredientsList] = useState<string[]>([]);
  const [stepsList, setStepsList] = useState<string[]>([]);

  const tabVariants = {
    hidden: {
      opacity: 0.75,
      x: direction === 1 ? -100 : 100,
    },
    visible: {
      opacity: 1,
      x: 0,
    },
    exit: {
      opacity: 0,
      x: direction === 1 ? 100 : -100,
    },
  };

  useEffect(() => {
    if (username === "" || recipeDetails === null) {
      getUser();
      getRecipeDetails();
    }
    setDirection(tabOrder.indexOf(activeTab));
  }, [activeTab, tabOrder]);

  const getUser = async () => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      console.log("Access token or created posts not found.");
      return;
    }

    try {
      const response = await axios.get(
        `http://victoire-rabeau.com:3000/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setUsername(response.data.username);
    } catch (error) {
      console.error("Error fetching recipe details:", error);
    }
  };

  const getRecipeDetails = async () => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      console.log("Access token not found.");
      return;
    }

    try {
      const response = await axios.get(
        `http://victoire-rabeau.com:3000/posts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setRecipeDetails(response.data);
    } catch (error) {
      console.error("Error fetching recipe details:", error);
    }
  };

  const TabContent = ({ activeTab }: { activeTab: string }) => {
    switch (activeTab) {
      case "ingredients":
        return getIngredients();
      case "preview":
        return getPreview();
      case "reviews":
        return getReviews();
      default:
        return null;
    }
  };

  const tabDirection = (currentTab: string, nextTab: string): number => {
    if (
      (currentTab === "" || currentTab === "preview") &&
      nextTab === "ingredients"
    ) {
      return 1;
    } else if (currentTab === "reviews" && nextTab === "preview") {
      return 1;
    } else if (currentTab === "reviews" && nextTab === "ingredients") {
      return 1;
    } else if (currentTab === "ingredients" && nextTab === "preview") {
      return -1;
    } else if (currentTab === "preview" && nextTab === "reviews") {
      return -1;
    } else if (currentTab === "ingredients" && nextTab === "reviews") {
      return -1;
    } else {
      return 0;
    }
  };

  const handleMouseEnter = (rating: number) => {
    setHoverRating(rating);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleClick = (rating: number) => {
    setSelectedRating(rating);
  };

  const renderRating = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <div
        style={{ cursor: "default" }}
        key={i}
        className={`${styles.diamond_only} ${
          i < rating ? styles.diamond_only : styles.diamond_white
        }`}
      ></div>
    ));
  };

  const renderEditRating = () => {
    return [...Array(5)].map((_, i) => (
      <div
        key={i}
        className={`${styles.diamond} ${
          (hoverRating > 0 && i < hoverRating) || i < selectedRating
            ? styles.diamondSelected
            : ""
        }`}
        onMouseEnter={() => handleMouseEnter(i + 1)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick(i + 1)}
      ></div>
    ));
  };

  const getTabsButtons = (tab: string) => {
    return (
      <div>
        <button
          onClick={() => setActiveTab("ingredients")}
          className={`${styles.tabButton} mr-2 ${
            tab === "ingredients" ? styles.activeTab : ""
          }`}
        >
          Ingredients
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`${styles.tabButton} mr-2 ${
            tab === "preview" ? styles.activeTab : ""
          }`}
        >
          Preview
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`${styles.tabButton} ${
            tab === "reviews" ? styles.activeTab : ""
          }`}
        >
          Reviews
        </button>
      </div>
    );
  };

  const getPreview = () => {
    return (
      <div>
        <h5>Preview</h5>

        <img
          src={pictures[0] || "/assets/placeholder.png"}
          alt={title}
          className={`${styles.modalImage}`}
        />
        <div className="flex flex-row items-center justify-between mb-6">
          <h5>{title}</h5>
          <div className={`${styles.ratingContainer}`}>
            {renderEditRating()}
          </div>
        </div>
        <p className={`${styles.modalDescription}`}>{description}</p>
        {recipeDetails && <RecipeSteps steps={recipeDetails.steps || []} />}
      </div>
    );
  };

  const getIngredients = () => {
    return (
      <div>
        <h5>Ingredients</h5>
        {/* print the list of ingredients with tailwind */}
        <ul className="max-w-md space-y-1 list-disc list-inside text-left">
          {recipeDetails &&
            recipeDetails.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
        </ul>
      </div>
    );
  };

  const getReviews = () => {
    // create a list of 5 ratings with a username
    const ratings = [
      { username: "username1", rating: 5 },
      { username: "username2", rating: 4 },
      { username: "username45", rating: 3 },
      { username: "username43", rating: 1 },
      { username: "username5", rating: 3 },
    ];

    return (
      <div>
        <h5>Reviews</h5>
        {ratings.map((rating, index) => (
          <div className="flex justify-between my-4">
            {rating.username}
            <div className="flex">{renderRating(rating.rating)}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <div className={`${styles.modalUser} flex flex-row`}>
            <p>By &nbsp;</p>
            <div className="font-semibold">{username || userId}</div>
          </div>

          <button
            onClick={onClose}
            className={`${styles.backButton} text-2xl font-bold hover:scale-110 transition-all`}
          >
            &times;
          </button>
        </div>
        <div className={styles.modalBody}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              custom={tabDirection(lastTab, activeTab)}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={tabVariants}
              transition={{ duration: 0.25 }}
            >
              <TabContent activeTab={activeTab} />
            </motion.div>
          </AnimatePresence>
        </div>
        <div style={{ height: "100%" }}></div>
        <div className={styles.modalTabs}>{getTabsButtons(activeTab)}</div>
      </div>
    </div>
  );
};

export default RecipeDetailsModal;
