import React from "react";
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react";
import { UserAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { session, signUpNewUser } = UserAuth();

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true)

        try {
            const result = await signUpNewUser(email, password, name)

            if (result.success) {
                alert("Account created successfully✅")
                navigate("/signin")
                alert("You can now log in")
            } else {
                setError(result.error.message)
            }



            setLoading(false);
        } catch (error) {
            console.log(error)
        }
    }



    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-2">Sign up today!</h2>
            <p className="text-center text-sm text-gray-600 mb-6">
              Already have an account?{" "}
              <Link to="/signin" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Create a password"
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 text-white rounded-md
                  ${loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-500"}`}
              >
                Sign Up
              </Button>
            </form>
          </div>
        </div>
      );
}

export default SignUp;
