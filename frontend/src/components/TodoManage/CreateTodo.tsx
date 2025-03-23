import { createTodolist, searchUsers } from "@/api/ApiCalling";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { debounce } from "lodash";

const CreateTodo = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Low");
    const [status, setStatus] = useState<"Pending" | "Completed">("Pending");
    const [tag, setTag] = useState("");
    const [dueDate, setDueDate] = useState<Date | undefined>();
    const [mentions, setMentions] = useState<string[]>([]);
    const [mentionInput, setMentionInput] = useState("");
    const [userSuggestions, setUserSuggestions] = useState<{ id: string; username: string }[]>([]);

    const token = localStorage.getItem("accessToken") ?? "";

    const handleCreateTodo = async () => {
        try {
            const todoData = {
                title,
                description,
                priority,
                status,
                tag: tag.split(",").map((t) => t.trim()),
                mentions,
                dueDate: dueDate ? dueDate.toISOString() : "",
            };

            await createTodolist(todoData, token);
            alert("Todo Created Successfully!");
            console.log(createTodolist(todoData, token))
        } catch (error) {
            alert("Error creating todo");
        }
    };

    const handleSearchUsers = debounce(async (query: string) => {
        if (!query.trim()) {
            setUserSuggestions([]);
            return;
        }
        try {
            const users = await searchUsers(query);
            setUserSuggestions(users);
        } catch (error) {
            console.error("Error searching users:", error);
        }
    }, 300);

    const handleMentionSelect = (username: string) => {
        if (!mentions.includes(username)) {
            setMentions([...mentions, username]);
        }
        setMentionInput("");
        setUserSuggestions([]);
    };

    return (
        <form className="rounded-xl py-12 px-8 w-full flex flex-col gap-4" onSubmit={handleCreateTodo}>
            <div className="flex flex-col gap-2">
                <p className="text-[14px]">Title <span className="text-red-500">*</span></p>
                <Input
                    type="text"
                    value={title}
                    placeholder="Title"
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-[2.5rem] w-full rounded-xl" />
            </div>

            <div className="flex flex-col gap-2">
                <p className="text-[14px]">Description <span className="text-red-500">*</span></p>
                <Input type="text" value={description} placeholder="Description" onChange={(e) => setDescription(e.target.value)} className="h-[2.5rem] w-full rounded-xl" />
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-[14px]">Tag <span className="text-red-500">*</span></p>
                <Input type="text" value={tag} placeholder="Tags (comma-separated)" onChange={(e) => setTag(e.target.value)} className="h-[2.5rem] w-full rounded-xl" />
            </div>

            <div className="flex flex-col gap-2 relative">
                <p className="text-[14px]">Mentions</p>
                <Input
                    type="text"
                    value={mentionInput}
                    placeholder="Search & mention user"
                    onChange={(e) => {
                        setMentionInput(e.target.value);
                        handleSearchUsers(e.target.value);
                    }}
                    className="h-[2.5rem] w-full rounded-xl"
                />
                {userSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 w-full bg-white border shadow-lg rounded-xl z-10">
                        {userSuggestions.map((user) => (
                            <div
                                key={user.id}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleMentionSelect(`${user.username}`)}
                            >
                                {user.username}
                            </div>
                        ))}
                    </div>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                    {mentions.map((m, idx) => (
                        <span key={idx} className="bg-gray-200 px-2 py-1 rounded-lg text-sm">
                            {m}
                        </span>
                    ))}
                </div>
            </div>

            <div className="flex items-center flex-wrap gap-6">
                <div className="flex flex-col gap-2 w-[45%]">
                    <p className="text-[14px]">Priority <span className="text-red-500">*</span></p>
                    <Select onValueChange={(value) => setPriority(value as "Low" | "Medium" | "High")} value={priority}>
                        <SelectTrigger className="h-[2.5rem] w-full rounded-xl border px-3">
                            <SelectValue placeholder="Select Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-2 w-[45%]">
                    <p className="text-[14px]">Status <span className="text-red-500">*</span></p>
                    <Select onValueChange={(value) => setStatus(value as "Pending" | "Completed")} value={status}>
                        <SelectTrigger className="h-[2.5rem] w-full rounded-xl border px-3">
                            <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <p className="text-[14px]">Due Date <span className="text-red-500">*</span></p>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="h-[2.5rem] w-full rounded-xl border">
                            {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start">
                        <Calendar mode="single" selected={dueDate} onSelect={setDueDate} />
                    </PopoverContent>
                </Popover>
            </div>
            <Button type="submit" className="w-full h-[2.5rem] rounded-xl bg-blue-500 text-white text-[14px] hover:bg-blue-300">
                Submit
            </Button>
        </form>
    );
};

export default CreateTodo;
