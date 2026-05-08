import { useNavigate } from "react-router-dom";
import Composer from "../components/Composer";
import { Header } from "./Feed";

export default function CreatePost() {
  const navigate = useNavigate();
  return (
    <section className="mx-auto max-w-3xl space-y-5">
      <Header title="Create Post" subtitle="Share a thought, image, or video with your network." />
      <Composer onCreated={() => navigate("/")} />
    </section>
  );
}
