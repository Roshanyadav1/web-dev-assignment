import ProtectedRoute from "@/components/ProtectedRoute";
import "./globals.css";
import 'leaflet/dist/leaflet.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ProtectedRoute>
          {children}
        </ProtectedRoute>
      </body>
    </html>
  );
}
