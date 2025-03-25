import { fetchAllTodo } from '@/api/ApiCalling';
import { useState, useEffect } from 'react';
import PendingTodo from './PendingTodo';
import CompleteTodo from './CompleteTodo';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const MainTodo = () => {
    const [todos, setTodos] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        priority: 'all', // Default to "all" to prevent filtering issues
        status: 'all',
        tag: '',
        sortBy: 'createdAt',
        order: 'desc',
    });

    const fetchTodos = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setError("User not authenticated.");
            setLoading(false);
            return;
        }
    
        try {
            // Remove unnecessary filters (API might not accept empty strings)
            const filterParams: any = {};
            if (filters.priority !== "all") filterParams.priority = filters.priority;
            if (filters.status !== "all") filterParams.status = filters.status;
            if (filters.tag) filterParams.tag = filters.tag;
            filterParams.sortBy = filters.sortBy;
            filterParams.order = filters.order;
    
            console.log("Fetching todos with filters:", filterParams); // Debugging log
    
            const response = await fetchAllTodo(token, filterParams);
            console.log("API Response:", response.data); // Debugging log
    
            setTodos(response.data.todos);
        } catch (error) {
            console.error("Fetch error:", error);
            setError("Failed to fetch todos.");
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        fetchTodos();
    }, [filters]); // Fetch todos when filters change

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    const pendingTodos = todos.filter(todo => todo.status === "Pending" || todo.status === "Overdue");
    const completedTodos = todos.filter(todo => todo.status === "Completed");

    // Function to handle export
    const handleExport = async (format: "json" | "csv") => {
        const token = localStorage.getItem("accessToken");
        if (!token) return alert("User not authenticated.");

        try {
            const response = await fetchAllTodo(token, { exportFormat: format });

            if (format === "csv") {
                const blob = new Blob([response.data], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "todos.csv";
                a.click();
            } else {
                const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "todos.json";
                a.click();
            }
        } catch (error) {
            console.error("Export failed:", error);
        }
    };

    return (
        <div className='w-full min-h-screen flex flex-col items-center px-4 mt-[80px]'>
            {/* Filter Options */}
            <div className="flex gap-4 mb-6 mt-8">
                <Select value={filters.priority} onValueChange={(value) => setFilters({ ...filters, priority: value })}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Overdue">Overdue</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                </Select>

                <Input
                    type="text"
                    placeholder="Filter by tag"
                    className="w-[200px]"
                    value={filters.tag}
                    onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
                />

                <Select value={filters.sortBy} onValueChange={(value) => setFilters({ ...filters, sortBy: value })}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="createdAt">Sort by Date</SelectItem>
                        <SelectItem value="priority">Sort by Priority</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={filters.order} onValueChange={(value) => setFilters({ ...filters, order: value })}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Order" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="desc">Descending</SelectItem>
                        <SelectItem value="asc">Ascending</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Export Buttons */}
            <div className="mb-6 flex gap-4">
                <Button className="bg-blue-500 text-white" onClick={() => handleExport("json")}>Export JSON</Button>
                <Button className="bg-green-500 text-white" onClick={() => handleExport("csv")}>Export CSV</Button>
            </div>

            {/* Todo Lists */}
            <div className='w-full flex items-center flex-wrap justify-evenly gap-8'>
                <PendingTodo todos={pendingTodos} />
                <CompleteTodo todos={completedTodos} />
            </div>
        </div>
    );
};

export default MainTodo;

