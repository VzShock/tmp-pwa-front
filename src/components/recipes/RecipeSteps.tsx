import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { motion } from "framer-motion";
import styles from "./recipesteps.module.css";

interface RecipeStepsProps {
  steps: string[];
}

const RecipeSteps: React.FC<RecipeStepsProps> = ({ steps }) => {
  const tmpSteps = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae quam vitae mauris ",
    "t ultricies. Sed vitae nisl nec nunc ultricies elementum. Nulla facilisi. Donec ultricies",
    "mauris eget ligula aliquet, eget porta ante ultrices. Sed nec nulla vitae quam aliquam",
  ];

  return (
    <div className="px-4 py-2">
      <div className="mx-auto max-w-3xl">
        <h3 className="mb-4 text-center text-xl font-semibold">
          Scroll to see the steps
        </h3>
        {steps.map((step, index) => (
          <div key={index} className="">
            <Question title={"Step nº" + (index + 1)}>
              <p>{step}</p>
            </Question>
          </div>
        ))}
      </div>
    </div>
  );
};

const Question = ({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: JSX.Element;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <motion.div
      animate={open ? "open" : "closed"}
      className="border-b-[1px] border-b-slate-300"
    >
      <button
        onClick={() => setOpen((pv) => !pv)}
        className="flex w-full items-center justify-between gap-4 py-6"
      >
        <motion.span
          variants={{
            open: {
              color: "rgba(3, 6, 23, 0)",
            },
            closed: {
              color: "rgba(3, 6, 23, 1)",
            },
          }}
          className={`${styles.title} bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-left text-lg font-medium`}
        >
          {title}
        </motion.span>
        <motion.span
          variants={{
            open: {
              rotate: "180deg",
              color: "rgb(124 58 237)",
            },
            closed: {
              rotate: "0deg",
              color: "#030617",
            },
          }}
        >
          <FiChevronDown className="text-2xl" />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: open ? "fit-content" : "0px",
          marginBottom: open ? "24px" : "0px",
        }}
        className="overflow-hidden text-slate-600"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default RecipeSteps;
