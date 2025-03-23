import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Register from '../components/login-register/Register';
import Login from "../components/login-register/Login";

const SignUpSignInPage = () => {
    return (
        <div className='w-full min-h-screen bg-gray-100 flex items-center justify-center relative'>
            <Tabs defaultValue="signin" className="w-[90%] md:w-[400px] fixed bg-white p-4 rounded-xl">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="signin">
                    <Login />
                </TabsContent>
                <TabsContent value="signup">
                    <Register />
                </TabsContent>
            </Tabs>

        </div>
    )
}

export default SignUpSignInPage