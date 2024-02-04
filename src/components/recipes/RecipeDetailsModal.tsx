import React, { useEffect, useState } from "react";
import styles from "./recipedetails.module.css";
import RecipeSteps from "./RecipeSteps";
import { AnimatePresence, motion } from "framer-motion";
import { render } from "react-dom";
import axios from "axios";

interface RecipeDetailsModalProps {
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  image: string;
  onClose: () => void;
  rating: number;
}

const RecipeDetailsModal: React.FC<RecipeDetailsModalProps> = ({
  title,
  description,
  ingredients,
  steps,
  image,
  onClose,
  rating,
}) => {
  const [activeTab, setActiveTab] = useState("preview");
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const tabOrder = ["ingredients", "preview"];
  const [direction, setDirection] = useState(0);
  const [lastTab, setLastTab] = useState("");
  const [username, setUsername] = useState("");
  const [ingredientsList, setIngredientsList] = useState<string[]>([]);
  const [stepsList, setStepsList] = useState<string[]>([]);
  const [ingredientStates, setIngredientStates] = useState(
    ingredients.map((ingredient) => ({
      name: ingredient,
      checked: false,
    }))
  );

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
    setIngredientStates(
      ingredients.map((ingredient) => ({
        name: ingredient,
        checked: false,
      }))
    );
  }, [ingredients]);

  useEffect(() => {
    setDirection(tabOrder.indexOf(activeTab));
  }, [activeTab, tabOrder]);

  const TabContent = ({ activeTab }: { activeTab: string }) => {
    switch (activeTab) {
      case "ingredients":
        return getIngredients();
      case "preview":
        return getPreview();
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
    } else if (currentTab === "ingredients" && nextTab === "preview") {
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

  const renderRating = () => {
    return [...Array(10)].map((_, i) => (
      <div
        style={{ cursor: "default" }}
        key={i}
        className={`${styles.diamond_only} ${
          i < rating ? styles.diamond_only : styles.diamond_white
        }`}
      ></div>
    ));
  };

  const renderRating2 = () => {
    return (
      <>
        <div>{rating} / 10</div>
        <div
          style={{ cursor: "default" }}
          className={`${styles.diamond_only} `}
        ></div>
      </>
    );
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
      </div>
    );
  };

  const getPreview = () => {
    return (
      <div>
        <div className="flex-none w-full relative">
          <img
            src={image ? image : "/assets/placeholder.png"}
            alt={title}
            className=" inset-0 w-full h-60	 object-cover rounded"
          />
        </div>
        <div className="flex flex-row items-center justify-between mb-6">
          <h5 className="font-semibold">{title}</h5>
          <div className={`${styles.ratingContainer}`}>{renderRating2()}</div>
        </div>
        <p className={`${styles.modalDescription}`}>{description}</p>
        <RecipeSteps steps={steps || []} />
      </div>
    );
  };

  const handleIngredientCheck = (index: number) => {
    const newIngredientStates = [...ingredientStates];
    newIngredientStates[index].checked = !newIngredientStates[index].checked;
    setIngredientStates(
      // sort ingredients from not checked to checked
      newIngredientStates.sort((a, b) =>
        a.checked === b.checked ? 0 : a.checked ? 1 : -1
      )
    );
  };

  const getIngredients = () => (
    <div>
      <h5 className="mb-6">Ingredients</h5>
      <ul className=" space-y-2">
        {ingredientStates.map((ingredient, index) => (
          <li key={index} className="flex items-center">
            <input
              id={`ingredient-checkbox-${index}`}
              type="checkbox"
              checked={ingredient.checked}
              onChange={() => handleIngredientCheck(index)}
              className="w-10 h-10" // Larger checkbox
            />
            <label
              htmlFor={`ingredient-checkbox-${index}`}
              className="ml-2 text-xl"
              style={{ userSelect: "none" }}
            >
              {" "}
              {/* Larger text */}
              {ingredient.name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <div className={`${styles.modalUser} flex flex-row`}></div>

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
