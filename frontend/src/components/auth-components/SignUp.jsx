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
            <form onSubmit={handleSignUp}>
                <h2> Sign up today!</h2>
                <p>
                    Already have an account? <Link to="/signin">Sign In!</Link>
                </p>
                <div>
                    <input onChange={(e) => setName(e.target.value)} type="text" placeholder="name"/> 
                    <input onChange={(e) => setEmail(e.target.value)} type="email" id="" placeholder="email"/>
                    <input onChange={(e) => setPassword(e.target.value)} type="password" id="" placeholder="password"/>
                    <button type="submit" disabled={loading}>Sign Up</button>
                    {error && <p>{error}</p>}
                </div>
            </form>
        </div>

    )
}

export default SignUp;