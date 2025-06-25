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
            <h1>Dashboard</h1>
            <h2>Welcome, {session?.user?.email}</h2>
            <div>
                <p onClick={handleSignOut}> Sign out</p>
            </div>
        </div>

    )
}

export default Dashboard;