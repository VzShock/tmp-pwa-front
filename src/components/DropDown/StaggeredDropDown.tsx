import React, { useEffect, useRef, useState } from "react";
import { FiEdit, FiChevronDown } from "react-icons/fi";
import { motion } from "framer-motion";

type StaggeredDropDownProps = {
    categories: string[];
    selectedCategories: string[];
    onCategorySelect: (category: string) => void;
};

const StaggeredDropDown: React.FC<StaggeredDropDownProps> = ({
                                                                 categories = [],
                                                                 selectedCategories = [],
                                                                 onCategorySelect,
                                                             }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Filter compatible categories (not already selected)
    const getCompatibleCategories = () => {
        const compatible = categories.filter(category => !selectedCategories.includes(category));
        return compatible;
    };


    const compatibleCategories = getCompatibleCategories();

    return (
        <div ref={dropdownRef} style={{ position: "relative" }}>


            <motion.div animate={open ? "open" : "closed"} className="relative">
                <button
                    onClick={() => setOpen((prev) => !prev)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-indigo-50 bg-indigo-500 hover:bg-indigo-500 transition-colors"
                >
                    <span className="font-medium text-sm">Categories</span>
                    <motion.span variants={iconVariants}>
                        <FiChevronDown/>
                    </motion.span>
                </button>

                <motion.ul
                    initial={wrapperVariants.closed}
                    animate={open ? "open" : "closed"}
                    variants={wrapperVariants}
                    style={{originY: "top", translateX: "-50%", zIndex: 9999}}
                    className="grid grid-cols-2 p-2 rounded-lg bg-white shadow-xl absolute top-[120%] left-[50%] w-56 overflow-hidden"
                >
                    {compatibleCategories.map((category) => (
                        <motion.li
                            key={category}
                            variants={itemVariants}
                            onClick={() => {
                                onCategorySelect(category);
                                setOpen(false);
                            }}
                            className="flex items-center gap-2 p-2 text-xs font-medium whitespace-nowrap rounded-md hover:bg-indigo-100 text-slate-700 hover:text-indigo-500 transition-colors cursor-pointer w-full"
                            style={{whiteSpace: 'nowrap', width: '100%'}}
                        >
                            <motion.span variants={actionIconVariants}>
                                <FiEdit/>
                            </motion.span>
                            <span>{category}</span>
                        </motion.li>
                    ))}
                </motion.ul>

            </motion.div>

            {/* Selected Categories Display */}
            <div className="selected-categories flex flex-wrap gap-2 mt-2">
                {selectedCategories.map(category => (
                    <button onClick={() => {
                        onCategorySelect(category);
                    }}>
                        <span key={category} className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-200 rounded">
                            {category}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default StaggeredDropDown;

// Animation variants...
const wrapperVariants = {
    open: {
        scaleY: 1,
        transition: {
            when: "beforeChildren",
            staggerChildren: 0.05,
        },
    },
    closed: {
        scaleY: 0,
        transition: {
            duration: 0, // Make disappearance instant
        },
    },
};

const iconVariants = {
    open: {rotate: 180},
    closed: { rotate: 0 },
};

const itemVariants = {
    open: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.1,
        },
    },
    closed: {
        opacity: 0,
        y: -15,
        transition: {
            duration: 0.1,
        },
    },
};

const actionIconVariants = {
    open: { scale: 1, y: 0 },
    closed: { scale: 0, y: -7 },
};
