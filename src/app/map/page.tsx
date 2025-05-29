"use client";
import {
  useLoadScript,
  GoogleMap,
  MarkerF,
} from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProjectImages, getProjectMedia, getProjects } from "@/lib/firebase";
import { Loader2, ArrowLeft} from "lucide-react";

const libraries = ["places"] as const;

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

export default function MapPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [images, setImages] = useState<{ id: string; url: string; name: string }[]>([]);
  const [videos, setVideos] = useState<{ id: string; url: string; name: string }[]>([]);
  const [, setLoading] = useState(true);
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


  // console.log(selectedProject , "the selected project");


  return (
    <main className="h-screen p-4 flex flex-col gap-4">
      {/* Back Button */}
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>

      {/* Map + Project Details Panel */}
      <div className="flex flex-1 rounded-xl shadow-lg overflow-hidden relative gap-4">
        {/* Map */}
        <div className="w-full h-full">
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
                  onClick={() => {
                    const fetchMedia = async () => {
                      try {
                        setSelectedProject(project)

                        setLoading(true);
                        const [imgs, vids] = await Promise.all([
                          getProjectImages(project.id),
                          getProjectMedia(project.id),
                        ]);
                        setImages(imgs.map((img: any) => ({ id: img.id, url: img.url ?? '', name: img.name ?? '' })));
                        setVideos(vids.map((vid: any) => ({ id: vid.id, url: vid.url ?? '', name: vid.name ?? '' })));
                        setLoading(false);
                      } catch (error) {
                        setLoading(false);
                        alert("Cought in error : ")
                      }
                    };
                    fetchMedia()
                  }}
                  icon={{
                    url: lucideMapPinSvg,
                    scaledSize: new window.google.maps.Size(32, 32),
                    anchor: new window.google.maps.Point(16, 32),
                  }}
                />
              ) : null
            )}
          </GoogleMap>
        </div>

        {/* Project Details Drawer */}
        {selectedProject && (
          <div className="absolute right-0 top-0 w-full max-w-md h-full bg-white border-l z-10 shadow-lg p-4 overflow-y-auto animate-slideIn">
            <div className="w-[250px] space-y-2 text-sm">
              <button onClick={() => setSelectedProject(null)} className="flex items-center space-x-2 text-blue-600 hover:underline">
                <ArrowLeft size={20} />
                <span>Back</span>
              </button>
              <img
                src={selectedProject.imageUrl}
                alt={selectedProject.title}
                className="w-full h-32 object-cover rounded-md"
              />
              <div className="space-y-1">
                <h3 className="font-semibold text-base">{selectedProject.title}</h3>
                <p className="text-gray-500 text-xs">📍 {selectedProject.location}</p>
                <p className="text-gray-700 text-sm">🛒 Orders: {selectedProject.numberOfOrders}</p>
                <p className="text-gray-700 text-sm">📅 Last Order: {selectedProject.lastOrderDate}</p>

                <div className="flex gap-2 text-xs mt-2 text-gray-600">
                  <span>🖼 {selectedProject.imageCount} Images</span>
                  <span>🎥 {selectedProject.videoCount} Videos</span>
                  <span>🌐 {selectedProject.panoCount} Panos</span>
                </div>
              </div>


              <div>
                <h2 className="text-lg font-semibold mb-2">Images</h2>
                {images.length === 0 ? (
                  <p className="text-gray-500 italic">No images uploaded yet.</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((img) => (
                      <div key={img.id} className="relative group">
                        <img
                          src={img.url}
                          alt={img.name}
                          className="rounded shadow transition duration-300 hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-lg font-semibold mt-8 mb-2">Videos</h2>
                {videos.length === 0 ? (
                  <p className="text-gray-500 italic">No videos uploaded yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {videos.map((vid) => (
                      <div key={vid.id} className="relative group">
                        <video
                          controls
                          src={vid.url}
                          className="rounded shadow w-full max-h-[300px] transition duration-300 hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <a
                href={`/project/${selectedProject.id}`} // Or external link
                className="inline-block w-full text-center mt-2 bg-blue-600 text-white text-sm py-1.5 rounded-md hover:bg-blue-700 transition"
              >
                View Project →
              </a>
            </div>
          </div>
        )}
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
