import Loader from "@/components/Loader";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <Loader />
    </ProtectedRoute>
  );
}
 