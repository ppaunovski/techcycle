"use client";
import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {RegisterRequest} from "@/app/auth/register.request";
import {LoginRequest} from "@/app/auth/login.request";


const Page = () => {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [registrationError, setRegistrationError] = useState('');

    const [registerRequest, setRegisterRequest] = useState<RegisterRequest>({
        firstName: '',
        lastName: '',
        email: '',
        registerPassword: '',
        confirmPassword: '',
    });

    const [loginRequest, setLoginRequest] = useState<LoginRequest>({
        username: '',
        password: '',
    })

    const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRegisterRequest({
            ...registerRequest,
            [name]: value,
        });
    };

    const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginRequest({
            ...loginRequest,
            [name]: value,
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log(loginRequest)
        
        const resp = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginRequest)
        })
        console.log(resp)
        if (!resp.ok) {
            setLoginError(() => "Something went wrong");
        }
        const res = await resp.json()
        console.log(res)
        localStorage.setItem("token", res.token);
        localStorage.setItem("username", res.username);
        localStorage.setItem("firstName", res.firstName);
        localStorage.setItem("lastName", res.lastName);
        localStorage.setItem("cartId", res.cartId);
        console.log(res)
        console.log('Login submitted');
        router.push('/');
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        console.log(registerRequest)
        
        const resp = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({...registerRequest, cartId: localStorage.getItem('cartId')})
        });
        console.log(resp)
        if (!resp.ok) {
            setRegistrationError(() => "Something went wrong");
        }
        const res = await resp.json()
        console.log(res);
        console.log('Registration submitted');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>

                    {/* Login Tab */}
                    <TabsContent value="login">
                        <form onSubmit={handleLogin}>
                            <CardHeader>
                                <CardTitle>Welcome Back</CardTitle>
                                <CardDescription>
                                    Sign in to access your account
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {loginError && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{loginError}</AlertDescription>
                                    </Alert>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            className="pl-10"
                                            required
                                            name={'username'}
                                            value={loginRequest.username}
                                            onChange={handleLoginInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            className="pl-10 pr-10"
                                            required
                                            name={'password'}
                                            value={loginRequest.password}
                                            onChange={handleLoginInputChange}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" className="rounded border-gray-300" />
                                        <span>Remember me</span>
                                    </label>
                                    <a href="#" className="text-blue-600 hover:text-blue-500">
                                        Forgot password?
                                    </a>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" className="w-full">
                                    Sign In
                                </Button>
                            </CardFooter>
                        </form>
                    </TabsContent>

                    {/* Register Tab */}
                    <TabsContent value="register">
                        <form onSubmit={handleRegister}>
                            <CardHeader>
                                <CardTitle>Create Account</CardTitle>
                                <CardDescription>
                                    Sign up to start shopping
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {registrationError && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{registrationError}</AlertDescription>
                                    </Alert>
                                )}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <Input
                                                id="firstName"
                                                placeholder="First name"
                                                className="pl-10"
                                                required
                                                name={'firstName'}
                                                value={registerRequest.firstName}
                                                onChange={handleRegisterInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <Input
                                                id="lastName"
                                                placeholder="Last name"
                                                className="pl-10"
                                                required
                                                name={'lastName'}
                                                value={registerRequest.lastName}
                                                onChange={handleRegisterInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="registerEmail">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <Input
                                            id="registerEmail"
                                            type="email"
                                            placeholder="Enter your email"
                                            className="pl-10"
                                            required
                                            name={'email'}
                                            value={registerRequest.email}
                                            onChange={handleRegisterInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="registerPassword">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <Input
                                            id="registerPassword"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Create a password"
                                            className="pl-10 pr-10"
                                            required
                                            name={'registerPassword'}
                                            value={registerRequest.registerPassword}
                                            onChange={handleRegisterInputChange}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <Input
                                            id="confirmPassword"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Confirm your password"
                                            className="pl-10 pr-10"
                                            required
                                            name={'confirmPassword'}
                                            value={registerRequest.confirmPassword}
                                            onChange={handleRegisterInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" className="rounded border-gray-300" required />
                                    <span className="text-sm">
                    I agree to the{" "}
                                        <a href="#" className="text-blue-600 hover:text-blue-500">
                      Terms of Service
                    </a>{" "}
                                        and{" "}
                                        <a href="#" className="text-blue-600 hover:text-blue-500">
                      Privacy Policy
                    </a>
                  </span>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" className="w-full">
                                    Create Account
                                </Button>
                            </CardFooter>
                        </form>
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    );
};

export default Page;