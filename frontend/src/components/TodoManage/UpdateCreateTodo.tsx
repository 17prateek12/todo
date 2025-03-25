import { createTodolist, searchUsers, updateTodolist } from "@/api/ApiCalling";
import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { debounce } from "lodash";
import { createTodo, IMention, TodoFormUpdate } from "@/lib/interface";

const CreateTodo:React.FC<TodoFormUpdate> = ({existingTodo, isUpdatingTodo}) => {
    const [title, setTitle] = useState(existingTodo?.title || "");
    const [description, setDescription] = useState(existingTodo?.description || "");
    const [priority, setPriority] = useState<"Low" | "Medium" | "High">(existingTodo?.priority || "Low");
    const [status, setStatus] = useState<"Pending" | "Completed" | "Overdue">(existingTodo?.status || "Pending");
    const [tag, setTag] = useState(existingTodo?.tag.join(", ") || "");
    const [dueDate, setDueDate] = useState<Date | undefined>(existingTodo? new Date(existingTodo.dueDate) : undefined);
    const [dueTime, setDueTime] = useState<string | null>(existingTodo ? format(new Date(existingTodo.dueDate), "HH:mm") : "12:00");
    const [mentions, setMentions] = useState<IMention[]>(existingTodo?.mentions || []);
    const [mentionInput, setMentionInput] = useState("");
    const [userSuggestions, setUserSuggestions] = useState<{ id: string; username: string }[]>([]);

    const token = localStorage.getItem("accessToken") ?? "";

    useEffect(() => {
        if (existingTodo) {
          setTitle(existingTodo.title);
          setDescription(existingTodo.description);
          setPriority(existingTodo.priority);
          setStatus(existingTodo.status);
          setTag(existingTodo.tag.join(", "));
          setMentions(existingTodo.mentions);
          setDueDate(new Date(existingTodo.dueDate));
          setDueTime(format(new Date(existingTodo.dueDate), "HH:mm"));
        }
      }, [existingTodo]);

    const handleCreateTodo = async () => {
        try {

            const dueDateTime = dueDate
                ? new Date(`${format(dueDate, "yyyy-MM-dd")}T${dueTime}:00`)
                : null;

            const todoData: createTodo = {
                title,
                description,
                priority,
                status,
                tag: tag.split(",").map((t) => t.trim()),
                mentions: mentions.map((mention) => mention.username), 
                dueDate: dueDateTime ? dueDateTime.toISOString() : "",
            };

            if(isUpdatingTodo && existingTodo){
                await updateTodolist(todoData,token,existingTodo._id)
            }else{
                await createTodolist(todoData, token);
            alert("Todo Created Successfully!");
            }
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

    const handleMentionSelect = (user: { id: string; username: string }) => {
        if (!mentions.some((mention) => mention._id === user.id)) {
            setMentions([...mentions, { _id: user.id, username: user.username }]); // Ensure full IMention object
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
                                onClick={() => handleMentionSelect({ id: user.id, username: user.username })}
                            >
                                {user.username}
                            </div>
                        ))}
                    </div>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                    {mentions.map((m, idx) => (
                        <span key={idx} className="bg-gray-200 px-2 py-1 rounded-lg text-sm">
                            {m.username}
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
                            <SelectItem value="Overdue">Overdue</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <p className="text-[14px]">Due Date & Time <span className="text-red-500">*</span></p>
                <div className="flex gap-4">
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
                    <TimePicker
                        onChange={setDueTime}
                        value={dueTime}
                        className="h-[2.5rem] w-[8rem] rounded-xl border px-3"
                        disableClock
                        format="hh:mm a"
                    />
                </div>
            </div>
            <Button type="submit" className="w-full h-[2.5rem] rounded-xl bg-blue-500 text-white text-[14px] hover:bg-blue-300">
                Submit
            </Button>
        </form>
    );
};

export default CreateTodo;
