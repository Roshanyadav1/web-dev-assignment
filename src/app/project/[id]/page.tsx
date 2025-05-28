'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProjectImages, uploadProjectImage, uploadProjectMedia, deleteProjectMedia, getProjectMedia, deleteAllProjectImages } from '@/lib/firebase';
import { ArrowLeft, ImagePlus, Video, Trash2, Loader2 } from 'lucide-react';

export default function ProjectPage() {
    const { id } = useParams();
    const router = useRouter();
    const projectId = id as string;

    const [images, setImages] = useState<{ id: string; url: string; name: string }[]>([]);
    const [videos, setVideos] = useState<{ id: string; url: string; name: string }[]>([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchMedia = async () => {
        try {
            setLoading(true);
            const [imgs, vids] = await Promise.all([
                getProjectImages(projectId),
                getProjectMedia(projectId),
            ]);
     console.log("Raw images data:", imgs);
        console.log("Raw videos data:", vids);
            setImages(imgs.map((img: any) => ({ id: img.id, url: img.url ?? '', name: img.name ?? '' })));
            setVideos(vids.map((vid: any) => ({ id: vid.id, url: vid.url ?? '', name: vid.name ?? '' })));
            setLoading(false);
        } catch (error) {
            setLoading(false);
            alert("Cought in error : ")            
        }
    };

    useEffect(() => {
        fetchMedia();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            if (type === 'image') await uploadProjectImage(projectId, file);
            if (type === 'video') await uploadProjectMedia(projectId, file);
            await fetchMedia();
        } catch (err) {
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };


    const handleDelete = async (type: 'image' | 'video', id: string, name: string) => {
        try {
            const fullStoragePath = `projects/${projectId}/${name}`;
            await deleteProjectMedia(projectId, id, fullStoragePath);
            await deleteAllProjectImages(projectId)
            await fetchMedia();
        } catch (err) {
            console.error("Delete failed:", err);
            alert('Delete failed');
        }
    };

    console.log(images , "images");
    

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => router.back()}
                    className="flex items-center space-x-2 text-blue-600 hover:underline"
                >
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>
                <div className="flex items-center gap-4">
                    <label className="cursor-pointer flex items-center gap-1 text-sm text-blue-600">
                        <ImagePlus size={18} /> Upload Image
                        <input type="file" accept="image/*" hidden onChange={(e) => handleFileUpload(e, 'image')} />
                    </label>
                    <label className="cursor-pointer flex items-center gap-1 text-sm text-blue-600">
                        <Video size={18} /> Upload Video
                        <input type="file" accept="video/*" hidden onChange={(e) => handleFileUpload(e, 'video')} />
                    </label>
                </div>
            </div>

            {(loading || uploading) && (
                <div className="flex justify-center items-center text-blue-600 gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    <span>{uploading ? 'Uploading...' : 'Loading media...'}</span>
                </div>
            )}

            {!loading && (
                <>
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
                                        <button
                                            className="absolute top-2 right-2 text-white bg-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100"
                                            onClick={() => handleDelete('image', img.id, img.name)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
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
                                        <button
                                            className="absolute top-2 right-2 text-white bg-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100"
                                            onClick={() => handleDelete('video', vid.id, vid.name)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
