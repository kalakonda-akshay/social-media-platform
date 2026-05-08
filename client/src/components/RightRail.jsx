import { useEffect, useState } from "react";
import { FiActivity } from "react-icons/fi";
import api from "../api/axios";
import UserCard from "./UserCard";

export default function RightRail() {
  const [users, setUsers] = useState([]);
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    api.get("/users/suggested").then(({ data }) => setUsers(data));
    api.get("/posts/trending").then(({ data }) => setTrending(data));
  }, []);

  return (
    <aside className="hidden space-y-5 xl:block">
      <section className="glass rounded-lg p-4">
        <div className="mb-3 flex items-center gap-2 font-black">
          <FiActivity className="text-sphere-mint" /> Real-time pulse
        </div>
        <div className="space-y-3 text-sm text-slate-300">
          <p><span className="font-bold text-sphere-sky">{Math.max(trending.length * 7, 18)}</span> active conversations simulated</p>
          <p><span className="font-bold text-sphere-mint">Live</span> comment cards update after every reply</p>
        </div>
      </section>
      <section className="space-y-3">
        <h2 className="px-1 text-lg font-black">Suggested users</h2>
        {users.map((person) => <UserCard key={person._id} person={person} onFollow={(next) => setUsers((items) => items.map((item) => item._id === next._id ? next : item))} />)}
      </section>
      <section className="glass rounded-lg p-4">
        <h2 className="mb-3 text-lg font-black">Trending posts</h2>
        <div className="space-y-3">
          {trending.slice(0, 4).map((post) => (
            <div key={post._id} className="rounded-lg bg-white/5 p-3">
              <p className="text-sm font-bold">@{post.author.username}</p>
              <p className="line-clamp-2 text-sm text-slate-300">{post.text || "Shared media"}</p>
              <p className="mt-1 text-xs text-slate-500">{post.likes.length} likes · {post.comments.length} comments</p>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}
