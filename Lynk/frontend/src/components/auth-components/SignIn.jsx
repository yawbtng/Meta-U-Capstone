import React from "react";
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react";
import { UserAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { session, signInUser } = UserAuth();

    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true)

        try {
            const result = await signInUser(email, password)

            if (result.success) {
                navigate('/home')
            } else {
                setError(result.error)
            }
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-2">Welcome Back</h2>
            <p className="text-center text-sm text-gray-600 mb-6">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
            <form onSubmit={handleSignIn} className="space-y-4">
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
                  placeholder="Enter your password"
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
                Sign In
              </Button>
            </form>
          </div>
        </div>
    );
}

export default SignIn;
