import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiEdit3, FiLink, FiMapPin } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/Avatar";
import Loader from "../components/Loader";
import PostCard from "../components/PostCard";
import { Empty } from "./Feed";

export default function Profile() {
  const { username } = useParams();
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.get(`/users/${username}`), api.get(`/posts/user/${username}`)])
      .then(([userRes, postRes]) => {
        setProfile(userRes.data);
        setPosts(postRes.data);
      })
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) return <Loader />;
  if (!profile) return <Empty text="Profile not found." />;

  const isMe = user._id === profile._id;
  const isFollowing = profile.followers?.some((id) => (id._id || id) === user._id);

  const follow = async () => {
    const { data } = await api.put(`/users/${profile._id}/follow`);
    setProfile(data.targetUser);
    updateUser(data.currentUser);
    toast.success(data.following ? `Following ${profile.name}` : `Unfollowed ${profile.name}`);
  };

  return (
    <section className="space-y-5">
      <div className="glass overflow-hidden rounded-lg">
        <div className="h-36 bg-gradient-to-r from-sphere-sky/80 via-sphere-mint/60 to-sphere-rose/70" />
        <div className="p-5">
          <div className="-mt-16 flex flex-wrap items-end justify-between gap-4">
            <Avatar user={profile} size="h-28 w-28 text-4xl" />
            {isMe ? (
              <Link to="/profile/edit" className="btn-ghost"><FiEdit3 /> Edit profile</Link>
            ) : (
              <button onClick={follow} className={isFollowing ? "btn-ghost" : "btn-primary"}>{isFollowing ? "Following" : "Follow"}</button>
            )}
          </div>
          <h1 className="mt-4 text-3xl font-black">{profile.name}</h1>
          <p className="text-slate-400">@{profile.username}</p>
          <p className="mt-3 max-w-2xl leading-7 text-slate-200">{profile.bio}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-400">
            {profile.location && <span className="flex items-center gap-1"><FiMapPin /> {profile.location}</span>}
            {profile.website && <a className="flex items-center gap-1 text-sphere-sky" href={profile.website} target="_blank" rel="noreferrer"><FiLink /> {profile.website}</a>}
          </div>
          <div className="mt-5 flex gap-5 text-sm">
            <span><b>{profile.following?.length || 0}</b> following</span>
            <span><b>{profile.followers?.length || 0}</b> followers</span>
            <span><b>{posts.length}</b> posts</span>
          </div>
        </div>
      </div>
      {posts.length ? posts.map((post) => <PostCard key={post._id} post={post} onChange={(next) => setPosts((items) => items.map((item) => item._id === next._id ? next : item))} onDelete={(id) => setPosts((items) => items.filter((item) => item._id !== id))} />) : <Empty text="No posts on this profile yet." />}
    </section>
  );
}
