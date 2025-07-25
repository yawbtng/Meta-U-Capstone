import { Link, useNavigate } from "react-router-dom"
import { useState } from "react";
import { UserAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { cn } from "../../lib/utils";
import lynkLogo from "../..//lynk-logo.png";

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
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
                alert("Account created successfully✅")
                navigate("/signin")
                alert("You can now log in")
            } else {
                setError(result.error.message)
            }

            setLoading(false);
        } catch (error) {
          setError(error.message)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className={cn("flex flex-col gap-6 w-full max-w-4xl")}>
                <Card className="overflow-hidden p-0">
                    <CardContent className="grid p-0 md:grid-cols-2 h-[500px]">
                        <div className="relative">
                            <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-200"></div>
                            <div className="flex items-center justify-center p-8 h-full">
                                <img
                                    src={lynkLogo}
                                    alt="Lynk Logo"
                                    className="max-w-xs max-h-64 object-contain" />
                            </div>
                        </div>
                        
                        <form className="p-6 md:p-8" onSubmit={handleSignUp}>
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center text-center">
                                    <p className="text-2xl font-bold">Create an account</p>
                                    <p className="text-muted-foreground text-balance">
                                        Join Lynk and start building your network
                                    </p>
                                </div>
                                
                                <div className="grid gap-3">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input 
                                        id="name" 
                                        type="text" 
                                        placeholder="John Doe" 
                                        required 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                
                                <div className="grid gap-3">
                                    <Label htmlFor="email">Email</Label>
                                    <Input 
                                        id="email" 
                                        type="email" 
                                        placeholder="m@example.com" 
                                        required 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                
                                <div className="grid gap-3">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input 
                                            id="password" 
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Create a strong password" 
                                            required 
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                                                    <circle cx="12" cy="12" r="3"/>
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                                                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                                                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                                                    <line x1="2" x2="22" y1="2" y2="22"/>
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                
                                {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                                
                                <Button 
                                    type="submit" 
                                    className="w-full"
                                    disabled={loading}
                                >
                                    {loading ? "Creating account..." : "Create Account"}
                                </Button>

                                <div className="text-center text-sm">
                                    Already have an account?{" "}
                                    <Link to="/signin" className="underline underline-offset-4">
                                        Sign in
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default SignUp;
