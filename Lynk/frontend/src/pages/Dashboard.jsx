import React from "react";
import { UserAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"



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
            <nav className="inline-flex justify-center my-5 w-max">

                <Button onClick={() => navigate("/all-contacts")}
                className="bg-black text-white mx-2 ">
                    All Connections
                </Button>

                <Button onClick={() => navigate("/add-contact")}
                className="bg-black text-white mx-2">
                    Add Connection
                </Button>

                <Button onClick={() => navigate("/settings")}
                className="bg-black text-white mx-2">
                    Settings
                </Button>
            </nav>

            <h1 className="bg-blue-500">Dashboard</h1>
            <h2>Welcome, {session?.user?.user_metadata?.display_name}</h2>


            <div className="flex justify-center">
                <Button onClick={handleSignOut}
                className="m-10 border p-3 text-white bg-black">
                Sign out
                </Button>
            </div>
        </div>

    )
}

export default Dashboard;
