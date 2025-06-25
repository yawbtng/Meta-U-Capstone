import React from "react";
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react";
import { UserAuth } from "../../context/AuthContext";

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
                navigate('/home')
            }
        } catch (error) {
            setError("error occurred: ", error)
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-1">
            <form onSubmit={handleSignUp}>
                <h2 className="text-xl font-bold mb-6 text-center"> Sign up today!</h2>

                <p className="mb-4 text-center">
                    Already have an account? <Link to="/signin">Sign In!</Link>
                </p>

                <div className="flex flex-col justify-between gap-y-3">
                    <input
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="name"
                    />

                    <input
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="email"
                    />

                    <input
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="password"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className={`p-2 bg-sky-500 hover:bg-sky-700 rounded ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                    >
                        Sign Up
                    </button>
                    {error && <p className="text-red-500">{error}</p>}
                </div>
            </form>
        </div>

    )
}

export default SignUp;
