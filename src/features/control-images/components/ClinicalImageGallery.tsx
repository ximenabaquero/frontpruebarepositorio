import { PencilSquareIcon, TrashIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { getImageUrl } from "../services/ClinicalImagesService";
import type { ClinicalImage } from "../types/ClinicalImage";

type Props = {
  images: ClinicalImage[];
  isAdmin: boolean;
  onEdit: (image: ClinicalImage) => void;
  onDelete: (id: number) => void;
};

export default function ClinicalImageGallery({ images, isAdmin, onEdit, onDelete }: Props) {
  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed border-gray-200 bg-white">
        <PhotoIcon className="h-12 w-12 text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">Aún no hay imágenes</p>
        {isAdmin && (
          <p className="text-sm text-gray-400 mt-1">Crea la primera haciendo clic en &quot;Nueva imagen&quot;</p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {images.map((image) => (
        <div
          key={image.id}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group"
        >
          <div className="grid grid-cols-2 gap-0.5 bg-gray-100">
            <div className="relative aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={getImageUrl(image.before_image)} alt={`${image.title} - Antes`} className="w-full h-full object-cover" />
              <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">ANTES</span>
            </div>
            <div className="relative aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={getImageUrl(image.after_image)} alt={`${image.title} - Después`} className="w-full h-full object-cover" />
              <span className="absolute top-2 left-2 bg-emerald-600/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">DESPUÉS</span>
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-gray-900 text-sm mb-0.5 truncate">{image.title}</h3>
            {image.description && (
              <p className="text-xs text-gray-500 line-clamp-2 mb-3">{image.description}</p>
            )}
            {isAdmin && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => onEdit(image)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                >
                  <PencilSquareIcon className="h-3.5 w-3.5" />
                  Editar
                </button>
                <button
                  onClick={() => onDelete(image.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition"
                >
                  <TrashIcon className="h-3.5 w-3.5" />
                  Eliminar
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
