import { mediaUrl } from "../api/axios";

export default function Avatar({ user, size = "h-11 w-11" }) {
  const src = mediaUrl(user?.avatar);
  return src ? (
    <img src={src} alt={user?.name || "User"} className={`${size} rounded-full object-cover ring-2 ring-white/10`} />
  ) : (
    <div className={`${size} grid place-items-center rounded-full bg-gradient-to-br from-sphere-sky to-sphere-mint font-extrabold text-sphere-ink ring-2 ring-white/10`}>
      {(user?.name || "?").slice(0, 1).toUpperCase()}
    </div>
  );
}
