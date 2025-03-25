import { useState, useEffect } from "react";
import { fetchNotes, addNote, deleteNote } from "@/api/ApiCalling";
import { Button } from "../ui/button";
import { MessageSquare, Trash2 } from "lucide-react";
import { TodoNotesProps, Note } from "@/lib/interface";

const TodoNotes: React.FC<TodoNotesProps> = ({ todoId, token }) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [newNote, setNewNote] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadNotes = async () => {
            try {
                const notesData = await fetchNotes(todoId, token);
                setNotes(notesData);
            } catch (error) {
                console.error("Error loading notes:", error);
            } finally {
                setLoading(false);
            }
        };
        loadNotes();
    }, [todoId]);

    const createrUser = localStorage.getItem('username') as string;

    const handleAddNote = async () => {
        if (!newNote.trim()) return;
        try {
            const addedNote = await addNote(todoId, newNote, token);
            setNotes((prevNotes) => (Array.isArray(prevNotes) ? [...prevNotes, addedNote] : [addedNote]));
            setNewNote("");
        } catch (error) {
            console.error("Error adding note:", error);
        }
    };


    const handleDeleteNote = async (noteId: string) => {
        try {
            await deleteNote(noteId, token);
            setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    };

    if (loading) return <p>Loading notes...</p>;

    return (
        <div className="p-4 border rounded-lg bg-white w-full overflow-y-scroll">
            <h3 className="font-semibold text-lg flex items-center gap-2">
                <MessageSquare size={20} /> Notes
            </h3>
            <ul className="mt-3 space-y-2">
                {notes.length > 0 ? (
                    notes.map((note) => (
                        <li key={note._id} className={`flex justify-between items-center p-2 shadow rounded-lg my-2
                        ${createrUser === note.createdBy.username ? 'bg-green-500 text-white' : 'text-black bg-gray-100'}`}>
                            <div className='flex flex-col gap-2 w-full'>
                                <p>{note.createdBy.username}</p>
                                <p>{note.content}</p>
                            </div>
                            <Button onClick={() => handleDeleteNote(note._id)} variant="destructive">
                                <Trash2 size={16} />
                            </Button>
                        </li>
                    ))
                ) : (
                    <p className="text-gray-500">No notes yet. Add one!</p>
                )}
            </ul>

            <div className="mt-3 flex gap-2">
                <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="border p-2 rounded-lg w-full"
                    placeholder="Add a note..."
                />
                <Button onClick={handleAddNote} className="bg-blue-500 text-white">Add</Button>
            </div>
        </div>
    );
};

export default TodoNotes;
