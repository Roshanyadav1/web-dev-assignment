"use client";

import { LocateFixedIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import Loader from "@/components/Loader";
import Search from "@/components/Search";
import { auth, getProjects } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import ProtectedRoute from "@/components/ProtectedRoute";

function Dashboard() {
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const queryHandler = (value: string) => {
    setQuery(value.toLowerCase());
  };

  useEffect(() => {
    const filteredProjects = allProjects.filter((project) =>
      project.title.toLowerCase().includes(query)
    );
    setProjects(filteredProjects);
  }, [query, allProjects]);

  useEffect(() => {
    setIsLoading(true);
    getProjects()
      .then((data) => setAllProjects(data))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch projects.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <Loader />;

  return (
    <ProtectedRoute>
      <main className="space-y-8 px-6 py-8 max-w-7xl mx-auto">
        <header className="flex flex-wrap justify-between items-center gap-4 px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>

          <div className="flex flex-wrap gap-4 items-center">
            <Link
              href="/map"
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              View on Map
            </Link>

            <Link
              href="/analytics"
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              Analytics
            </Link>

            <button
              onClick={async () => {
                try {
                  await signOut(auth);
                  toast.success("Logged out!");
                } catch (error) {
                  toast.error("Logout failed. Try again.");
                  console.error("Logout error:", error);
                }
              }}
              className="text-sm text-red-600 hover:underline font-medium"
            >
              Logout
            </button>
          </div>
        </header>

        <Search query={query} queryHandler={queryHandler} />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {projects.length === 0 && (
          <p className="text-center text-xl text-gray-500 mt-12">No projects available.</p>
        )}
      </main>
    </ProtectedRoute>

  );
}

function ProjectCard({ project }: { project: any }) {
  return (
    <Link href={`/project/${project.id}`} className="block">
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col h-full">
        <div className="flex justify-between items-center px-6 pt-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
            <div className="flex items-center text-gray-500 mt-1 space-x-2 text-sm">
              <LocateFixedIcon className="w-4 h-4" />
              <span>{project.location}</span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={project.imageUrl}
              alt="Project image"
              width={56}
              height={56}
              className="object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <div className="px-6 py-4 flex-grow">
          <p className="text-gray-700">Orders: <span className="font-medium">{project.numberOfOrders}</span></p>
          <p className="text-gray-700 mt-1">Last order: <span className="font-medium">{project.lastOrderDate}</span></p>
        </div>

        <footer className="px-6 py-4 border-t border-gray-200 flex gap-3 flex-wrap text-xs text-gray-600">
          <Badge label="Images" count={project.imageCount} />
          <Badge label="Videos" count={project.videoCount} />
          <Badge label="Pano" count={project.panoCount} />
        </footer>
      </div>
    </Link>
  );
}

function Badge({ label, count }: { label: string; count: number }) {
  return (
    <span className="flex items-center rounded bg-gray-100 px-2 py-1 space-x-1">
      <span className="bg-white rounded px-1 font-semibold text-gray-900">{count}</span>
      <span>{label}</span>
    </span>
  );
}

export default Dashboard