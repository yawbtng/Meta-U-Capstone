import React from "react";
import { UserAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

const Dashboard = () => {
    const {session, signOut} = UserAuth();
    const navigate = useNavigate();


    const handleSignOut = async (e) => {
        e.preventDefault()
        try {
            await signOut();
            navigate("/")

        } catch( error) {
            console.error(error)
        }
    }


    return (
        <div>
            <h1 className="bg-blue-500">Dashboard</h1>
            <h2>Welcome, {session?.user?.email}</h2>
            <div className="flex justify-center">
                <button onClick={handleSignOut}
                className="m-10 border p-3 text-white">
                Sign out
                </button>
            </div>
        </div>

    )
}

export default Dashboard;
