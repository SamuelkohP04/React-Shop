/**
 * v0 by Vercel.
 * @see https://v0.dev/t/jvOgkyh3xyN
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button"

interface DeveloperCardProps {
  developer: {
    imgSrc: string;
    title: string;
    name: string;
    description: string;
  };
}


export default function DeveloperCard({ developer }: DeveloperCardProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl dark:bg-gray-950">
        <img
          src={developer.imgSrc}
          alt="Product Image"
          width={600}
          height={400}
          className="w-full h-64 object-cover"
          style={{ aspectRatio: "600/400", objectFit: "cover" }}
        />
        <div className="p-4 space-y-2">
          <h4 className="text-xl font-semibold">{developer.title}</h4>
          <h2 className="text-lg text-gray-700 dark:text-gray-300">{developer.name}</h2>
          <p className="text-gray-500 dark:text-gray-400">{developer.description}</p>

        </div>
      </div>
    </div>
  )
}