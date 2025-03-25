import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOutUser } from "@/api/ApiCalling";
import { useNavigate } from 'react-router-dom';
import dumbpic from '../../asset/l60Hf.png'


const DropPicMenu = () => {

    const profilepic: any | null = localStorage.getItem('profilePhoto');
    const token = localStorage.getItem("accessToken");
    const navigate = useNavigate();

    const Logout = async () => {
        if (!token) {
            console.error("No token found, user might not be logged in.");
            return;
        }
        try {
            await LogOutUser(token);
            navigate('/')
        } catch (error) {
            console.error(error as string);
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className='w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border border-black'>
                    <img
                    //src={dumbpic}
                        src={profilepic === '' ? dumbpic : `http://localhost:5000${profilepic}`}
                        alt='Profile'
                        className='w-full h-full object-cover'
                    />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Button onClick={Logout}
                            className="w-full h-[2.5rem] flex items-center justify-center text-white bg-red-500 hover:bg-red-300 text-[14px]">
                            Logout
                        </Button>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DropPicMenu