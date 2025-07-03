import React from "react";
import { UserAuth } from "./AuthContext";
import { Navigate } from "react-router";

const PrivateRoute = ({children}) => {
    const {session} = UserAuth();

    if (session === undefined) {
        return <h1>Need to sign in</h1>
    }

    return <> {session ? <>{children}</> : <Navigate to="/signup"/>} </>

}

export default PrivateRoute;
