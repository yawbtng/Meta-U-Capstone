import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../providers/supabaseClient";


const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
    const [session, setSession] = useState(undefined);


    // sign in
    const signInUser = async (email, password) => {
        try {
            const {data, error} = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                console.error(`Sign in error occured ${error}`)
                return { success: false, error: error.message}
            }
            console.log("sign-in success: ", data);
            return {success: true, data}
        } catch (error) {
            console.error(error)
            return { success: false, error: error.message };
        }
    }

    // sign up a new user
    const signUpNewUser = async (email, password, name) => {
        try {
            const {data, error} = await supabase.auth.signUp({
                email: email,
                password: password,
                optons: {
                    data: {
                        display_name: name,
                    }
                }
            });

            if (error) {
                console.log(`Error signing up: ${error.message}`)
                return {success: false, error}
            }
            return {success: true, data};
        } catch (error) {
            console.error(error)
            return {success: false, error: error.message}
        }

    }

    // sign out a user
    const signOut = () => {
        const {error} = supabase.auth.signOut();
        if (error) {
            console.error("An error occuered, ", error)
        }
    }



    useEffect(() => {
        supabase.auth.getSession().then(({data : {session} }) => {
            setSession(session);
        })
        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        })
    }, [])


    return (
        <AuthContext.Provider value={{session, signUpNewUser, signOut, signInUser}}>
            {children}
        </AuthContext.Provider>
    )
};

export const UserAuth = () => {
    return useContext(AuthContext)
}
