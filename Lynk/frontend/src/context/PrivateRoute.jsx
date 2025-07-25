import{ useEffect } from "react";
import { UserAuth } from "./AuthContext";
import { Navigate } from "react-router";
import { useLoading } from "./LoadingContext";
import PageLoader from "../components/ui/page-loader";

const PrivateRoute = ({children}) => {
    const {session} = UserAuth();
    const { setLoading, isLoading } = useLoading();

    // Set loading state based on session status
    useEffect(() => {
        setLoading('auth', session === undefined);
    }, [session, setLoading]);

    if (session === undefined) {
        return (
            <PageLoader 
                text="Checking authentication..." 
                showOverlay={true}
            />
        );
    }

    return <> {session ? <>{children}</> : <Navigate to="/signup"/>} </>

}

export default PrivateRoute;
