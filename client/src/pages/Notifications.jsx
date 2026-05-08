import { useEffect, useState } from "react";
import { FiBell, FiHeart, FiMessageCircle, FiUserPlus } from "react-icons/fi";
import api from "../api/axios";
import Avatar from "../components/Avatar";
import Loader from "../components/Loader";
import { timeAgo } from "../utils/time";
import { Empty, Header } from "./Feed";

const icons = { like: FiHeart, comment: FiMessageCircle, follow: FiUserPlus };

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/notifications").then(({ data }) => {
      setItems(data);
      api.put("/notifications/read");
    }).finally(() => setLoading(false));
  }, []);

  return (
    <section className="space-y-5">
      <Header title="Notifications" subtitle="A responsive activity center for likes, comments, and follows." />
      {loading ? <Loader /> : items.length ? (
        <div className="space-y-3">
          {items.map((item) => {
            const Icon = icons[item.type] || FiBell;
            return (
              <div key={item._id} className={`glass flex items-center gap-3 rounded-lg p-4 ${item.read ? "" : "ring-1 ring-sphere-sky/40"}`}>
                <div className="relative">
                  <Avatar user={item.sender} />
                  <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-sphere-sky text-sphere-ink"><Icon size={13} /></span>
                </div>
                <div>
                  <p className="font-semibold">{item.message}</p>
                  <p className="text-sm text-slate-400">{timeAgo(item.createdAt)}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : <Empty text="No notifications yet." />}
    </section>
  );
}
