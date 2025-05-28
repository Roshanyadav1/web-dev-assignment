"use client";
import {
  useLoadScript,
  GoogleMap,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProjects } from "@/lib/firebase";
import { Loader2, ArrowLeft } from "lucide-react";

const libraries = ["places"] as const;

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

export default function MapPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const router = useRouter();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: libraries as any,
  });

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(console.error);
  }, []);

  if (loadError)
    return <div className="text-red-500">Error loading map</div>;

  if (!isLoaded)
    return (
      <div className="h-[90vh] flex justify-center items-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );

  return (
    <main className="h-screen p-4 flex flex-col gap-4">
      {/* Back button */}
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>

      {/* Map Container */}
      <div className="rounded-xl shadow-lg overflow-hidden flex-1">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={{ lat: 22.9734, lng: 78.6569 }}
          zoom={5}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            minZoom: 3,
            maxZoom: 15,
          }}
        >
          {projects.map((project) =>
            project.latitude && project.longitude ? (
              <MarkerF
                key={project.id}
                position={{ lat: project.latitude, lng: project.longitude }}
                onClick={() => setSelectedProject(project)}
                icon={{
                  url: lucideMapPinSvg,
                  scaledSize: new window.google.maps.Size(32, 32),
                  anchor: new window.google.maps.Point(16, 32),
                }}
              />
            ) : null
          )}

          {selectedProject && (
            <InfoWindowF
              position={{
                lat: selectedProject.latitude,
                lng: selectedProject.longitude,
              }}
              onCloseClick={() => setSelectedProject(null)}
            >
              <div className="text-sm">
                <strong>{selectedProject.title}</strong>
                <br />
                {selectedProject.location}
              </div>
            </InfoWindowF>
          )}
        </GoogleMap>
      </div>
    </main>
  );
}

const lucideMapPinSvg =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 10c0 6-9 12-9 12S3 16 3 10a9 9 0 0 1 18 0z"/>
  <circle cx="12" cy="10" r="3"/>
</svg>
`);
