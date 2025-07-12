import { createContext, useEffect, useState, useContext } from "react";
import { signInUser as backendSignIn, 
    signUpNewUser as backendSignUp, 
    signOut as backendSignOut, 
    updateUserProfile, fetchUserProfile, 
    getSession, onAuthStateChange } from "../../../backend/index.js";


const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
    const [session, setSession] = useState(undefined);
    const [profile, setProfile] = useState(null)

    
    const signInUser = async (email, password) => {
        return await backendSignIn(email, password);
    }

    
    const signUpNewUser = async (email, password, name) => {
        return await backendSignUp(email, password, name);
    }

    
    const signOut = async () => {
        return await backendSignOut();
    }

    const updateProfile = async ({ email, password, name, avatarUrl, bio}) => {
        return await updateUserProfile({ 
            userId: session?.user?.id, 
            email, 
            password, 
            name, 
            avatarUrl, 
            bio 
        });
    }

    const fetchProfile = async (uid) => {
        const result = await fetchUserProfile(uid);
        if (result.success) {
            setProfile(result.data);
        }
    }

    useEffect(() => {
        const refresh = async (session) => {
            setSession(session);             
            if (session) fetchProfile(session.user.id);
        }

        getSession().then(({ data: { session }}) => refresh(session));

        const { data: { subscription } } = onAuthStateChange(
            (event, session) => {
            if (event === 'USER_UPDATED' ||
                event === 'TOKEN_REFRESHED' ||
                event === 'SIGNED_IN')
                refresh(session);

            if (event === 'SIGNED_OUT')
                setProfile(null);
            })

        return () => subscription.unsubscribe();
    }, [])



    return (
        <AuthContext.Provider value={{session, signUpNewUser, signOut, signInUser, updateProfile}}>
            {children}
        </AuthContext.Provider>
    )
};

export const UserAuth = () => {
    return useContext(AuthContext)
}
