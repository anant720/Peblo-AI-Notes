"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";
import toast from "react-hot-toast";

export function CreateNoteCard() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateNote = async () => {
    setIsCreating(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Untitled Note", content: "" }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/dashboard/notes/${data.note.id}`);
        toast.success("Note created");
        router.refresh();
      } else {
        toast.error("Failed to create note");
      }
    } catch (error) {
      console.error("Failed to create note:", error);
      toast.error("Failed to create note");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <button 
      onClick={handleCreateNote}
      disabled={isCreating}
      className="bg-gradient-to-br w-full h-full from-purple-600/20 to-pink-600/20 border border-purple-500/20 rounded-xl p-6 shadow-lg flex items-center justify-center cursor-pointer hover:from-purple-600/30 hover:to-pink-600/30 transition-all disabled:opacity-50"
    >
      <div className="flex flex-col items-center gap-2 text-purple-300">
        <PlusCircle size={28} className={isCreating ? "animate-spin" : ""} />
        <span className="font-medium">{isCreating ? "Creating..." : "Create New Note"}</span>
      </div>
    </button>
  );
}
