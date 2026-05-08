import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import Loader from "../components/Loader";
import PostCard from "../components/PostCard";
import { Empty, Header } from "./Feed";

export default function Explore() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("latest");

  useEffect(() => {
    api.get("/posts/explore").then(({ data }) => setPosts(data)).finally(() => setLoading(false));
  }, []);

  const shown = useMemo(() => {
    if (mode === "trending") return [...posts].sort((a, b) => b.likes.length + b.comments.length - (a.likes.length + a.comments.length));
    return posts;
  }, [posts, mode]);

  return (
    <section className="space-y-5">
      <Header title="Explore" subtitle="Discover conversations across the whole network." />
      <div className="glass flex gap-2 rounded-lg p-2">
        {["latest", "trending"].map((item) => (
          <button key={item} onClick={() => setMode(item)} className={`flex-1 rounded-lg px-4 py-2 font-bold capitalize ${mode === item ? "bg-sphere-sky text-sphere-ink" : "text-slate-300 hover:bg-white/10"}`}>{item}</button>
        ))}
      </div>
      {loading ? <Loader /> : shown.length ? shown.map((post) => <PostCard key={post._id} post={post} onChange={(next) => setPosts((items) => items.map((item) => item._id === next._id ? next : item))} onDelete={(id) => setPosts((items) => items.filter((item) => item._id !== id))} />) : <Empty text="No posts yet." />}
    </section>
  );
}
