import React from "react";
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react";
import { UserAuth } from "../../context/AuthContext";

const SignIn = () => {
    const [name, setName] = useState("");
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
                navigate('/dashboard')
            }
        } catch (error) {
            setError("error occurred: ", error)
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <form onSubmit={handleSignIn}>
                <h2> Sign in!</h2>
                <p>
                    Don't have an account? <Link to="/signin">Sign In!</Link>
                </p>
                <div> 
                    <input onChange={(e) => setEmail(e.target.value)} type="email" id="" placeholder="email"/>
                    <input onChange={(e) => setPassword(e.target.value)} type="password" id="" placeholder="password"/>
                    <button type="submit" disabled={loading}>Sign In</button>
                    {error && <p>{error}</p>}
                </div>
            </form>
        </div>

    )
}

export default SignIn;