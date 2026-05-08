import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSave, FiUpload } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/Avatar";
import { Header } from "./Feed";

export default function EditProfile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: user.name || "",
    bio: user.bio || "",
    location: user.location || "",
    website: user.website || ""
  });
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => formData.append(key, value));
      if (avatar) formData.append("avatar", avatar);
      const { data } = await api.put("/users/profile", formData);
      updateUser(data);
      toast.success("Profile updated");
      navigate(`/profile/${data.username}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl space-y-5">
      <Header title="Edit Profile" subtitle="Keep your identity clear and easy to discover." />
      <form onSubmit={submit} className="glass space-y-4 rounded-lg p-5">
        <div className="flex items-center gap-4">
          <Avatar user={user} size="h-20 w-20 text-2xl" />
          <label className="btn-ghost cursor-pointer">
            <FiUpload /> Upload picture
            <input hidden type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files[0])} />
          </label>
          {avatar && <span className="text-sm text-slate-400">{avatar.name}</span>}
        </div>
        <input className="input" placeholder="Name" value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} />
        <textarea className="input resize-none" rows={4} placeholder="Bio" value={values.bio} onChange={(e) => setValues({ ...values, bio: e.target.value })} />
        <input className="input" placeholder="Location" value={values.location} onChange={(e) => setValues({ ...values, location: e.target.value })} />
        <input className="input" placeholder="Website" value={values.website} onChange={(e) => setValues({ ...values, website: e.target.value })} />
        <button disabled={loading} className="btn-primary w-full">
          <FiSave /> {loading ? "Saving..." : "Save profile"}
        </button>
      </form>
    </section>
  );
}
