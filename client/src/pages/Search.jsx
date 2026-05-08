import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import api from "../api/axios";
import UserCard from "../components/UserCard";
import { Header } from "./Feed";

export default function Search() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      api.get(`/users?search=${encodeURIComponent(query)}`).then(({ data }) => setUsers(data));
    }, 250);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <section className="space-y-5">
      <Header title="User Search" subtitle="Find people by name or username and grow your network." />
      <div className="glass flex items-center gap-3 rounded-lg p-3">
        <FiSearch className="text-xl text-sphere-sky" />
        <input className="w-full bg-transparent py-2 text-lg outline-none placeholder:text-slate-500" placeholder="Search users..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {users.map((person) => <UserCard key={person._id} person={person} onFollow={(next) => setUsers((items) => items.map((item) => item._id === next._id ? next : item))} />)}
      </div>
    </section>
  );
}
