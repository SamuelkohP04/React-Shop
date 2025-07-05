/**
 * v0 by Vercel.
 * @see https://v0.dev/t/jvOgkyh3xyN
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button"

export default function DeveloperCard() {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl dark:bg-gray-950">
        <img
          src="/placeholder.svg"
          alt="Product Image"
          width={600}
          height={400}
          className="w-full h-64 object-cover"
          style={{ aspectRatio: "600/400", objectFit: "cover" }}
        />
        <div className="p-4 space-y-2">
          <h3 className="text-xl font-semibold">Product Title</h3>
          <p className="text-gray-500 dark:text-gray-400">This is a description of the product.</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">$49.99</span>
            <Button>Add to Cart</Button>
          </div>
        </div>
      </div>
    </div>
  )
}