import { motion } from "framer-motion";

export default function Loader({ fullscreen = false }) {
  return (
    <div className={`grid place-items-center ${fullscreen ? "min-h-screen" : "py-10"}`}>
      <motion.div
        className="h-12 w-12 rounded-full border-4 border-sphere-sky border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, ease: "linear", duration: 0.8 }}
      />
    </div>
  );
}
