import { useState } from "react";
import { FiImage, FiSend, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../api/axios";
import Avatar from "./Avatar";
import { useAuth } from "../context/AuthContext";

export default function Composer({ onCreated }) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !media) return toast.error("Add text or media first");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("text", text);
      if (media) formData.append("media", media);
      const { data } = await api.post("/posts", formData);
      setText("");
      setMedia(null);
      onCreated?.(data);
      toast.success("Post published");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not publish post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="glass rounded-lg p-4">
      <div className="flex gap-3">
        <Avatar user={user} />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          maxLength={800}
          className="input resize-none"
          placeholder="What is happening in your sphere?"
        />
      </div>
      {media && (
        <div className="mt-3 flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
          <span className="truncate">{media.name}</span>
          <button type="button" onClick={() => setMedia(null)} className="rounded-md p-1 hover:bg-white/10" aria-label="Remove media">
            <FiX />
          </button>
        </div>
      )}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <label className="btn-ghost cursor-pointer">
          <FiImage /> Add media
          <input hidden type="file" accept="image/*,video/*" onChange={(e) => setMedia(e.target.files[0])} />
        </label>
        <button disabled={loading} className="btn-primary">
          <FiSend /> {loading ? "Publishing..." : "Publish"}
        </button>
      </div>
    </form>
  );
}
