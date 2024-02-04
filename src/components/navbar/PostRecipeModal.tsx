import React, {
  useState,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import axios from "axios";
import styles from "./navbar.module.css";

interface RecipeStep {
  instruction: string;
}

interface RecipeIngredient {
  name: string;
}

const PostRecipeModal = ({
  setIsOpen,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState<RecipeStep[]>([{ instruction: "" }]);
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([
    { name: "" },
  ]);
  const [image, setImage] = useState<File | null>(null); // Change to single File state
  const [imageBase64, setImageBase64] = useState<string | null>(null); // State to hold base64 conversion

  const lastStepRef = useRef<HTMLInputElement>(null);
  const lastIngredientRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Whenever steps change, scroll the last step into view
    if (lastStepRef.current) {
      lastStepRef.current.scrollIntoView({ behavior: "smooth" });
    }
    if (lastIngredientRef.current) {
      lastIngredientRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [steps, ingredients]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]); // Only capture the first file
      toBase64(event.target.files[0]) // Convert this file to base64
        .then((base64) => setImageBase64(base64 as string))
        .catch((error) => console.error("Error converting file:", error));
    }
  };

  const addStep = () => {
    if (steps.length <= 9) {
      setSteps([...steps, { instruction: "" }]);
    } else {
      alert("You can't have more than 10 steps in a recipe");
    }
  };

  const addIngredient = () => {
    if (ingredients.length <= 9) {
      setIngredients([...ingredients, { name: "" }]);
    } else {
      alert("You can't have more than 10 ingredients in a recipe");
    }
  };

  const delStep = (index: number) => {
    // remove the last step if there is more than one step
    if (steps.length > 1) {
      const newSteps = [...steps];
      newSteps.pop();
      setSteps(newSteps);
    }
  };

  const delIngredient = (index: number) => {
    // remove the last ingredient if there is more than one ingredient
    if (ingredients.length > 1) {
      const newIngredients = [...ingredients];
      newIngredients.pop();
      setIngredients(newIngredients);
    }
  };

  const handleStepChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const newSteps = [...steps];
      newSteps[index].instruction = event.target.value;
      setSteps(newSteps);
    };

  const handleIngredientChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const newIngredients = [...ingredients];
      newIngredients[index].name = event.target.value;
      setIngredients(newIngredients);
    };

  // image to base64
  const toBase64 = (file: File) =>
    new Promise<string | ArrayBuffer | null>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  };

  const updateCreatedPosts = (newPostId: string) => {
    const createdPosts = JSON.parse(
      localStorage.getItem("created_posts") || "[]"
    );
    if (!createdPosts.includes(newPostId)) {
      createdPosts.push(newPostId);
      localStorage.setItem("created_posts", JSON.stringify(createdPosts));
    }
  };

  const clearFields = () => {
    // Clear fields function remains the same
    setTitle("");
    setDescription("");
    setSteps([{ instruction: "" }]);
    setIngredients([{ name: "" }]);
    setImage(null);
    setImageBase64(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="h-full bg-white p-4 rounded-lg max-w-lg w-full overflow-auto">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-0 right-0 mt-4 mr-4 text-2xl font-semibold text-gray-700 hover:text-gray-900"
          aria-label="Close"
        >
          &times; {/* You can replace this with an icon from an icon library */}
        </button>

        <h2 className="text-xl font-bold mb-4">Post a New Recipe</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label
              htmlFor="recipe-title"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Title
            </label>
            <input
              type="text"
              id="recipe-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg w-full"
              required
            />
          </div>

          <div className="mb-3">
            <label
              htmlFor="recipe-description"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Description
            </label>
            <textarea
              id="recipe-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg w-full"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Images
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border border-gray-300 p-2 rounded-lg w-full"
            />
          </div>

          {ingredients.map((ingredient, index) => (
            <div key={index} className="mb-3 flex flex-col">
              <label
                htmlFor={`ingredient-${index}`}
                className="mb-2 text-sm font-medium text-gray-900"
              >
                Ingredient {index + 1}
              </label>
              <div className="flex">
                <input
                  type="text"
                  id={`ingredient-${index}`}
                  value={ingredient.name}
                  onChange={handleIngredientChange(index)}
                  className="border border-gray-300 p-2 rounded-lg w-full mr-2"
                  required
                  ref={
                    index === ingredients.length - 1 ? lastIngredientRef : null
                  }
                />
                {ingredients.length > 1 &&
                  index !== 0 && ( // Only show the Del Step button for the last step if there's more than one step
                    <button
                      type="button"
                      onClick={() => delIngredient(index)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 px-4 rounded-lg ml-2"
                    >
                      X
                    </button>
                  )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addIngredient}
            className={`${styles.stepbutton} mb-6
              no-underline relative z-0 flex items-center gap-2 overflow-hidden whitespace-nowrap rounded-lg border-[1px] 
              px-4 py-1.5 font-medium 
              text-neutral-300 transition-all duration-300
                     
              hover:scale-105 hover:border-neutral-50 hover:font-bold
              hover:before:translate-y-[0%]
              active:scale-100 text-2xl`}
          >
            +
          </button>

          {steps.map((step, index) => (
            <div key={index} className="mb-3 flex flex-col">
              <label
                htmlFor={`step-${index}`}
                className="mb-2 text-sm font-medium text-gray-900"
              >
                Step {index + 1}
              </label>
              <div className="flex">
                <input
                  type="text"
                  id={`step-${index}`}
                  value={step.instruction}
                  onChange={handleStepChange(index)}
                  className="border border-gray-300 p-2 rounded-lg w-full mr-2"
                  required
                  ref={index === steps.length - 1 ? lastStepRef : null}
                />
                {steps.length > 1 &&
                  index !== 0 && ( // Only show the Del Step button for the last step if there's more than one step
                    <button
                      type="button"
                      onClick={() => delStep(index)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 px-4 rounded-lg ml-2"
                    >
                      X
                    </button>
                  )}
              </div>
            </div>
          ))}

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={addStep}
              className={`${styles.stepbutton}
              no-underline relative z-0 flex items-center gap-2 overflow-hidden whitespace-nowrap rounded-lg border-[1px] 
              px-4 py-1.5 font-medium 
              text-neutral-300 transition-all duration-300
                     
              hover:scale-105 hover:border-neutral-50 hover:font-bold
              hover:before:translate-y-[0%]
              active:scale-100 text-2xl`}
            >
              +
            </button>
            <button
              type="submit"
              className={`${styles.postbutton}
                no-underline relative z-0 flex items-center gap-2 overflow-hidden whitespace-nowrap rounded-lg border-[1px] 
                px-4 py-1.5 font-medium 
                text-neutral-300 transition-all duration-300
                       
                hover:scale-105 hover:border-neutral-50 hover:font-bold
                hover:before:translate-y-[0%]
                active:scale-100`}
            >
              Post Recipe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostRecipeModal;
