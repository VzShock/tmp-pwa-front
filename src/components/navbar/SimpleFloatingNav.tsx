"use client";
import React from "react";
import "../../app/globals.css";
import styles from "./navbar.module.css";
import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";
import PostRecipeModal from "./PostRecipeModal";

interface NavLinkProps {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  language: string;
  setLanguage: Dispatch<SetStateAction<string>>;
}

export const SimpleFloatingNav = ({
  searchTerm,
  setSearchTerm,
  language,
  setLanguage,
}: NavLinkProps) => {
  // const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <nav
        className={`${styles.navbar_container} z-30 fixed left-[50%] top-8 flex  -translate-x-[50%] items-center  rounded-lg p-1 text-sm text-neutral-500`}
      >
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            setSearchTerm("");
          }}
        >
          <Logo />
        </div>

        <div className="flex items-center gap-6">
          {/* add an input for searching */}
          <input
            className="w-2/4 sm:w-100 form-control"
            type="text"
            placeholder="Search ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%", // Adjust this value as needed
              margin: "0 auto", // Center the input
            }}
          ></input>

          {/* <NavLink href="/">Home</NavLink>
          <NavLink href="/account">Account</NavLink>
          <MySaved isOpen={isOpen} setIsOpen={setIsOpen} /> */}
          {/* <NavLink href="/login">Disconnect</NavLink> */}
        </div>

        <div className="flex items-center gap-6 ml-6">
          <button
            onClick={() =>
              setLanguage((language) => (language === "en" ? "fr" : "en"))
            }
            // add style on hover scale 2
            className="hover:scale-105 transition-transform"
          >
            <img
              src={language === "en" ? "/assets/fr.png" : "/assets/en.png"}
              alt={language}
              className="w-12 h-12"
            />
          </button>
        </div>
      </nav>
      <SpringModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

const Logo = () => {
  return (
    <div className="flex flex-row items-center">
      <div className="ml-2 text-white text-xl">This is our Food.</div>

      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="ml-2 fill-neutral-50"
      >
        <path
          d="M32,13c0,0.552-0.447,1-1,1h-1.697L27,15.535V28c0,0.55-0.45,1-1,1H6c-0.55,0-1-0.45-1-1V15.535
	L2.697,14H1c-0.553,0-1-0.448-1-1s0.447-1,1-1h2c0.197,0,0.391,0.059,0.555,0.168L5,13h22l1.445-0.832
	C28.609,12.059,28.803,12,29,12h2C31.553,12,32,12.448,32,13z M5,11c0,0,0,0,0-1c0-0.79,2.503-2.199,7-2.759V6c0-1.299,1.03-2,2-2h4
	c0.97,0,2,0.701,2,2v1.241c4.497,0.56,7,1.969,7,2.759c0,1,0,1,0,1c0,0.55-0.45,1-1,1H6C5.45,12,5,11.55,5,11z M14,7.062
	C14.639,7.025,15.3,7,16,7s1.361,0.025,2,0.062V6h-4V7.062z"
        />
      </svg>
    </div>
  );
};

const SpringModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex justify-center items-start p bg-slate-900/20 backdrop-blur-md overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-lg shadow-xl overflow-y-auto h-full"
          >
            <PostRecipeModal setIsOpen={setIsOpen} />
            {/* <div className="relative z-10">
              <h3 className="text-3xl font-bold text-center mb-2">
                One more thing!
              </h3>
              <p className="text-center mb-6">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Id
                aperiam vitae, sapiente ducimus eveniet in velit.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded"
                >
                  Nah, go back
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-white hover:opacity-90 transition-opacity text-indigo-600 font-semibold w-full py-2 rounded"
                >
                  Understood!
                </button>
              </div>
            </div> */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const NavLink = ({ children, href }: NavLinkProps) => {
  return (
    <a
      onClick={() => {
        if (href === "/login") {
          localStorage.clear();
        }
      }}
      href={href}
      rel="nofollow"
      className="block overflow-hidden"
      style={{ color: "#fff", textDecoration: "none" }}
    >
      <motion.div
        whileHover={{ y: -20 }}
        transition={{ ease: "backInOut", duration: 0.5 }}
        className="h-[20px]"
      >
        <span className="flex h-[20px] items-center">{children}</span>
        <span className="flex h-[20px] items-center text-neutral-50">
          {children}
        </span>
      </motion.div>
    </a>
  );
};

const MySaved = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <a
      style={{ cursor: "pointer" }}
      onClick={() => {
        setIsOpen(true);
      }}
      className={`${styles.mysaved}
      no-underline relative z-0 flex items-center gap-2 overflow-hidden whitespace-nowrap rounded-lg border-[1px] 
          px-4 py-1.5 font-medium 
         text-neutral-300 transition-all duration-300
          
          before:absolute before:inset-0
          before:-z-10 before:translate-y-[200%]
          before:scale-[2.5]
          before:rounded-[100%] before:bg-neutral-50
          before:transition-transform before:duration-1000
          before:content-[""]
  
          hover:scale-105 hover:border-neutral-50 hover:font-bold
          hover:before:translate-y-[0%]
          active:scale-100`}
    >
      Post
    </a>
  );
};
