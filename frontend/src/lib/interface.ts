export interface LoginUser{
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    userId: string;
    userEmail: string;
    username: string;
    displayname: string;
    profilePhoto: string;
}

export interface RegisterUser{
    profilePhoto: any;
    email: string;
    username: string;
    displayname: string;
    password: string;
    confirmPassword: string;
}

export interface RegisterResponse{
    _id: string;
    email: string;
}

export interface IMention{
    _id: string;
    username: string;
}

export interface IUser{
    _id: string;
    username:string;
    email: string;
}

export interface TodoDetail{
    _id: string;
    title: string;
    description: string;
    priority: "Low" | "Medium" | "High";
    status: "Pending" | "Completed" | "Overdue";
    tag: string[];
    mentions: IMention[];
    user: IUser;
    dueDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface createTodo{
    title: string;
    description: string;
    priority: "High" | "Medium" | "Low";
    status: "Pending" | "Completed" | "Overdue";
    tag: string[];
    mentions: string[];
    dueDate: string;
}

export interface TodoFormUpdate{
    existingTodo ?: TodoDetail;
    isUpdatingTodo?: boolean
}

export interface Note {
    _id: string;
    content: string;
    createdAt: string;
    createdBy: {
        _id: string;
        username: string;
    };
}


export interface TodoNotesProps {
    todoId: string;
    token: string;
}