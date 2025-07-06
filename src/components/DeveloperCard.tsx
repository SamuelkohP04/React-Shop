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
    //description: string;
  };
}


export default function DeveloperCard({ developer }: DeveloperCardProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl 
      dark:bg-gray-950 ">
        <div className="flex-1 overflow-hidden">
        <img
          src={developer.imgSrc}
          alt="Product Image"
          width={600}
          height={600}
          className="w-full h-full object-cover"
          style={{ aspectRatio: "600/600", objectFit: "cover" }}
        />
        </div>
        <div className="p-4 space-y-2">
          <h4 className="text-xl font-semibold">{developer.title}</h4>
          <h2 className="text-lg text-gray-700 dark:text-gray-300">{developer.name}</h2>
          {/* <p className="text-gray-500 dark:text-gray-400">{developer.description}</p> */}

        </div>
      </div>
    </div>
  )
}