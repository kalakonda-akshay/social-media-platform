import { useEffect, useState } from "react";
import api from "../api/axios";
import Composer from "../components/Composer";
import Loader from "../components/Loader";
import PostCard from "../components/PostCard";
import RightRail from "../components/RightRail";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/posts/feed").then(({ data }) => setPosts(data)).finally(() => setLoading(false));
  }, []);

  const updatePost = (next) => setPosts((items) => items.map((item) => (item._id === next._id ? next : item)));
  const deletePost = (id) => setPosts((items) => items.filter((item) => item._id !== id));

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <section className="space-y-5">
        <Header title="Home Feed" subtitle="Live updates from people you follow." />
        <Composer onCreated={(post) => setPosts([post, ...posts])} />
        {loading ? <Loader /> : posts.length ? posts.map((post) => <PostCard key={post._id} post={post} onChange={updatePost} onDelete={deletePost} />) : <Empty text="Follow people or publish your first post to fill the feed." />}
      </section>
      <RightRail />
    </div>
  );
}

export function Header({ title, subtitle }) {
  return (
    <div className="glass rounded-lg p-5">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-sphere-mint">ConnectSphere</p>
      <h1 className="mt-1 text-3xl font-black text-white">{title}</h1>
      <p className="mt-1 text-slate-400">{subtitle}</p>
    </div>
  );
}

export function Empty({ text }) {
  return <div className="glass rounded-lg p-8 text-center text-slate-400">{text}</div>;
}
