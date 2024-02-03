"use client";

import "bootstrap/dist/css/bootstrap.css";
import RecipeCard from "@/components/recipes/RecipeCard";
import { SimpleFloatingNav } from "@/components/navbar/SimpleFloatingNav";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  // Sample user data (replace with your actual user data)
  const [userData, setUserData] = useState({
    username: "",
  });

  useEffect(() => {
    setUserData({ username: localStorage.getItem("username") ?? "" });
  }, [userData]);

  // Sample function to delete the user account (replace with your actual logic)
  const deleteAccount = () => {
    // Add logic here to delete the user account
    console.log("Account deleted");
  };

  return (
    <section className="vh-100">
      <SimpleFloatingNav />
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-12 col-xl-4">
            <div className="card" style={{ borderRadius: "15px" }}>
              <div className="card-body text-center">
                <div className="mt-3 mb-4">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp"
                    className="rounded-circle img-fluid mx-auto"
                    style={{ width: "100px" }}
                  />
                </div>
                <h4 className="mb-2">{userData.username}</h4>
                <div className="mb-4 pb-2">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-floating"
                  >
                    <i className="fab fa-facebook-f fa-lg"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-floating"
                  >
                    <i className="fab fa-twitter fa-lg"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-floating"
                  >
                    <i className="fab fa-skype fa-lg"></i>
                  </button>
                </div>
                <div className="d-flex justify-content-between text-center mt-5 mb-2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
