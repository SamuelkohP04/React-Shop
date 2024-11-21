import { useRouter } from "next/navigation";

import { auth } from "@/app/firebase/config";

import { Button } from "./ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

function ProductCard({ product, cart, setCart }: { product: Product, cart: Product[], setCart: any }) {
    const { toast } = useToast()
    const router = useRouter();

    function handleAddCart(): void {
        if (auth.currentUser) {
            if (cart.some((cartProduct: Product) => cartProduct.id === product.id)) {
                product.amount += 1;
                setCart([...cart]);
                toast({
                    title: `Increased ${product.name} to ${product.amount}`
                });
            } else {
                setCart((cart: Product[]) => [...cart, product]);
                toast({
                    title: `Added ${product.name} to cart!`
                });
            }
        } else {
            router.push("/login");
        }
    }

    return (
        <Card className="w-1/4 flex flex-col bg-slate-100 border-0 rounded">
            <CardHeader>
                <img className="rounded" src="https://mooncatcrystals.com/cdn/shop/articles/Aura-and-Other-Treated-Crystals-Why-I-Love-Them-Now-Mooncat-Crystals-759.jpg?v=1727646557&width=2048" />
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>{product.desc}</CardDescription>
                </div>
                <div className="flex justify-between items-center">
                    <p>${product.price.toFixed(2)}</p>
                    <Button className="w-10 h-10 bg-white rounded-full hover:bg-neutral-200" onClick={handleAddCart}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"/></svg>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default ProductCard