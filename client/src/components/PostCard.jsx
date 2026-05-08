import { useState } from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiMessageCircle, FiSend, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api, { mediaUrl } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { timeAgo } from "../utils/time";
import Avatar from "./Avatar";

export default function PostCard({ post, onChange, onDelete }) {
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [open, setOpen] = useState(false);
  const liked = post.likes?.some((like) => (like._id || like) === user._id);

  const toggleLike = async () => {
    const { data } = await api.put(`/posts/${post._id}/like`);
    onChange?.(data);
  };

  const addComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    const { data } = await api.post(`/posts/${post._id}/comments`, { text: comment });
    onChange?.({ ...post, comments: [...(post.comments || []), data] });
    setComment("");
    setOpen(true);
  };

  const remove = async () => {
    await api.delete(`/posts/${post._id}`);
    toast.success("Post deleted");
    onDelete?.(post._id);
  };

  return (
    <motion.article layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-lg p-4 shadow-glow">
      <header className="flex items-start justify-between gap-3">
        <Link to={`/profile/${post.author.username}`} className="flex min-w-0 items-center gap-3">
          <Avatar user={post.author} />
          <div className="min-w-0">
            <p className="truncate font-bold">{post.author.name}</p>
            <p className="truncate text-sm text-slate-400">@{post.author.username} · {timeAgo(post.createdAt)}</p>
          </div>
        </Link>
        {post.author._id === user._id && (
          <button onClick={remove} className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-sphere-rose" aria-label="Delete post">
            <FiTrash2 />
          </button>
        )}
      </header>

      {post.text && <p className="mt-4 whitespace-pre-wrap leading-relaxed text-slate-100">{post.text}</p>}

      {post.media && (
        <div className="mt-4 overflow-hidden rounded-lg border border-white/10 bg-sphere-ink">
          {post.mediaType === "video" ? (
            <video src={mediaUrl(post.media)} className="max-h-[520px] w-full object-cover" controls />
          ) : (
            <img src={mediaUrl(post.media)} alt="Post media" className="max-h-[520px] w-full object-cover" />
          )}
        </div>
      )}

      <div className="mt-4 flex items-center gap-3 border-y border-white/10 py-3">
        <button onClick={toggleLike} className={`btn-ghost px-3 py-2 ${liked ? "text-sphere-rose" : ""}`}>
          <FiHeart className={liked ? "fill-current" : ""} /> {post.likes?.length || 0}
        </button>
        <button onClick={() => setOpen((value) => !value)} className="btn-ghost px-3 py-2">
          <FiMessageCircle /> {post.comments?.length || 0}
        </button>
      </div>

      {(open || post.comments?.length > 0) && (
        <div className="mt-4 space-y-3">
          {(post.comments || []).slice(-4).map((item) => (
            <div key={item._id} className="flex items-start gap-3">
              <Avatar user={item.author} size="h-8 w-8" />
              <div className="max-w-[85%] rounded-lg rounded-tl-sm bg-white/8 px-3 py-2">
                <p className="text-sm font-bold">{item.author.name}</p>
                <p className="text-sm text-slate-200">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={addComment} className="mt-4 flex gap-2">
        <input value={comment} onChange={(e) => setComment(e.target.value)} className="input py-2" placeholder="Reply with something thoughtful..." />
        <button className="btn-primary px-3" aria-label="Send comment">
          <FiSend />
        </button>
      </form>
    </motion.article>
  );
}
