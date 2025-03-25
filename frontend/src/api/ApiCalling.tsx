import axios, { AxiosResponse } from "axios";
import { createTodo, LoginResponse, LoginUser, RegisterResponse, RegisterUser } from "@/lib/interface";

const API_URL = 'http://localhost:5000';


export const loginUserAPI = async (userData: LoginUser): Promise<LoginResponse> => {
    try {
        const response = await axios.post<LoginResponse>(`${API_URL}/api/user/login`, userData);
        const user = response.data;

        localStorage.setItem("accessToken", user.accessToken);
        localStorage.setItem("userId", user.userId);
        localStorage.setItem("userEmail", user.userEmail);
        localStorage.setItem("username", user.username);
        localStorage.setItem("displayname", user.displayname);
        localStorage.setItem("profilePhoto", user.profilePhoto);
        return user;
    } catch (error) {
        console.error("Error during login:", error);
        throw error as string || "An error occurred. Please try again.";
    }
};


export const RegisterUserAPI = async (userData: RegisterUser): Promise<RegisterResponse> => {
    try {
        const formData = new FormData();
        formData.append('email', userData.email);
        formData.append('username', userData.username);
        formData.append('displayname', userData.displayname);
        formData.append('password', userData.password);
        formData.append('confirmPassword', userData.confirmPassword);

        if (userData.profilePhoto instanceof File) {
            formData.append('profilePhoto', userData.profilePhoto);
        }
        const response = await axios.post<RegisterResponse>(
            `${API_URL}/api/user/register`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error during registration:', error);
        throw error as string || 'An error occurred. Please try again.';
    }
};


export const LogOutUser = async (token: string) => {
    try {
        await axios.post(`${API_URL}/api/user/logout`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("username");
        localStorage.removeItem("displayname");
        localStorage.removeItem("profilePhoto");
        console.log("User logged out successfully.");
    } catch (error) {
        console.error("Logout failed:", error);
    }
};


export const fetchAllTodo = async (
    token: string, 
    filters: { priority?: string; status?: string; tag?: string; sortBy?: string; order?: string; exportFormat?: string } = {}
) => {
    try {
        const queryParams = new URLSearchParams(filters as any).toString();
        const response = await axios.get(`${API_URL}/api/todos/todo?${queryParams}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.error('Error in fetching:', error);
        throw error as string;
    }
};



export const createTodolist = async(todoData: createTodo, token: string): Promise<AxiosResponse<any> | undefined> =>{
    try {
        return await axios.post(`${API_URL}/api/todos/create-todo`,todoData,{
            headers:{
                Authorization:`Bearer ${token}`
            },
        });
    } catch (error) {
        console.error(error)
    }
}


export const updateTodolist = async(todoData: createTodo, token: string, id:string): Promise<AxiosResponse<any> | undefined> =>{
    try {
        return await axios.patch(`${API_URL}/api/todos/todo/${id}`,todoData,{
            headers:{
                Authorization:`Bearer ${token}`
            },
        });
    } catch (error) {
        console.error(error)
    }
}


export const searchUsers = async (query:string) => {
    const response = await axios.get(`${API_URL}/api/user/search-user?query=${query}`);
    return response.data;
};


export const getTodoById = async (id: string, token: string) => {
    try {
        const response = await axios.get(`${API_URL}/api/todos/todo/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching todo:", error);
        return null;
    }
};


export const deleteTodo = async (id: string, token: string) => {
    try {
        const response = await axios.delete(`${API_URL}/api/todos/todo/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting todo:", error);
        return null;
    }
};


export const addNote = async (todoId: string, content: string, token:string) => {
    try {
        const response = await axios.post(`${API_URL}/api/todos/todo/${todoId}/notes`, { content }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.note;  
    } catch (error) {
        console.error("Error adding note:", error);
        throw error;
    }
};


export const fetchNotes = async (todoId: string, token:string) => {
    try {
        const response = await axios.get(`${API_URL}/api/todos/todo/${todoId}/notes`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error("Error fetching notes:", error);
        return [];
    }
};


export const deleteNote = async (noteId: string, token: string) => {
    try {
        await axios.delete(`${API_URL}/api/todos/todo/notes/${noteId}`,{
            headers: { Authorization: `Bearer ${token}` },
        });
        return true; // Indicate successful deletion
    } catch (error) {
        console.error("Error deleting note:", error);
        throw error;
    }
};
