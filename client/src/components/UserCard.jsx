import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";

export default function UserCard({ person, onFollow }) {
  const { user, updateUser } = useAuth();
  const isFollowing = person.followers?.some((id) => (id._id || id) === user._id);

  const follow = async () => {
    const { data } = await api.put(`/users/${person._id}/follow`);
    updateUser(data.currentUser);
    onFollow?.(data.targetUser);
    toast.success(data.following ? `Following ${person.name}` : `Unfollowed ${person.name}`);
  };

  return (
    <div className="glass flex items-center justify-between gap-3 rounded-lg p-4">
      <Link to={`/profile/${person.username}`} className="flex min-w-0 items-center gap-3">
        <Avatar user={person} />
        <div className="min-w-0">
          <p className="truncate font-bold">{person.name}</p>
          <p className="truncate text-sm text-slate-400">@{person.username}</p>
          <p className="line-clamp-2 text-sm text-slate-300">{person.bio}</p>
        </div>
      </Link>
      {person._id !== user._id && (
        <button onClick={follow} className={isFollowing ? "btn-ghost shrink-0" : "btn-primary shrink-0"}>
          {isFollowing ? "Following" : "Follow"}
        </button>
      )}
    </div>
  );
}
