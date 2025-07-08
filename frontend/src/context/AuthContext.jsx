import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../providers/supabaseClient";


const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
    const [session, setSession] = useState(undefined);
    const [profile, setProfile] = useState(null)


    
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
            return {success: true, data}
        } catch (error) {
            console.error(error)
            return { success: false, error: error.message };
        }
    }

    
    const signUpNewUser = async (email, password, name) => {
        try {
            const {data, error} = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
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


    
    const signOut = () => {
        const {error} = supabase.auth.signOut();
        if (error) {
            console.error("An error occuered, ", error)
        }
    }

    const updateProfile = async ({ email, password, name, avatarUrl, bio}) => {

        const { data: authUser, error: authErr } =
            await supabase.auth.updateUser({
                ...(email ? { email } : {}),
                ...(password ? { password } : {}),

                data: {
                    ...(name && { display_name: name }),
                }
            })

        if (authErr) throw authErr


        const { error: profileErr } = await supabase
            .from('user_profiles')
            .update({
                ...(name && { name }),
                ...(avatarUrl && { avatar_url: avatarUrl }),
                ...(bio && { bio }),
                email: authUser.user.email
            })
            .eq('id', authUser.user.id)
        if (profileErr) throw profileErr
    }

        const fetchProfile = async (uid) => {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', uid)
                .single()

            if (!error) {
                setProfile(data)
            }
        }



        useEffect(() => {
            const refresh = async (session) => {
                setSession(session)             
                if (session) fetchProfile(session.user.id)
            }

            supabase.auth.getSession().then(({ data: { session }}) => refresh(session))

            const { data: { subscription } } = supabase.auth.onAuthStateChange(
                (event, session) => {
                if (event === 'USER_UPDATED' ||
                    event === 'TOKEN_REFRESHED' ||
                    event === 'SIGNED_IN')
                    refresh(session)

                if (event === 'SIGNED_OUT')
                    setProfile(null)
                })

            return () => subscription.unsubscribe()
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
