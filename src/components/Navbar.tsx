import { useRouter } from "next/navigation";

import { auth } from "@/app/firebase/config";
import { db } from "@/app/firebase/config";
import { signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 

import { Button } from "./ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import CartCard from "./CartCard";

function Navbar({ cart, setCart }: { cart: Product[], setCart: any }) {
    const router = useRouter();

    function handleLogout(): void {
        signOut(auth)
            .then(() => {
                router.push("/login")
            });
    }

    async function handleCheckout(): Promise<void> {
        if (auth.currentUser) {
            await setDoc(doc(db, "users", auth.currentUser.uid), {
                cart: cart
            });
        }
    }
    
    if (auth.currentUser) {
        return (
            <div className="w-full h-20 flex justify-center bg-neutral-200">
                <div className="w-3/4 h-full flex justify-between items-center text-2xl font-bold max-lg:w-5/6">
                    LOGO
                    <Sheet>
                        <div className="flex gap-8 max-lg:gap-4">
                            <SheetTrigger className="flex items-center gap-4">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"/></svg>
                                <div className="w-8 h-8 flex justify-center items-center bg-white rounded-full text-base">{cart.length}</div>
                            </SheetTrigger>
                            <Button className="font-semibold" variant="link" onClick={handleLogout}>Logout</Button>
                        </div>
                        <SheetContent className="flex flex-col justify-between bg-neutral-200 overflow-scroll pb-0">
                            <SheetHeader className="flex flex-col gap-4">
                                <div>
                                    <SheetTitle className="text-2xl">Cart</SheetTitle>
                                    <SheetDescription>
                                        You have {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
                                    </SheetDescription>
                                </div>
                                {cart.map((product: Product) => {
                                    return (
                                        <CartCard key={product.id} product={product} setCart={setCart} />
                                    );
                                })}
                            </SheetHeader>
                            <div className="sticky bottom-0 bg-neutral-200 py-4">
                                <Button className="w-full bg-white text-black hover:bg-neutral-300" onClick={handleCheckout}>Checkout</Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-20 flex justify-center bg-neutral-200">
            <div className="w-3/4 h-full flex justify-between items-center text-2xl font-bold">
                LOGO
                <Sheet>
                    <div className="flex gap-8">
                        <Button className="font-semibold" variant="link" onClick={() => router.push("/login")}>Login</Button>
                    </div>
                    <SheetContent className="bg-neutral-200 overflow-scroll">
                        <SheetHeader className="flex flex-col gap-4">
                            <div>
                                <SheetTitle className="text-2xl">Cart</SheetTitle>
                                <SheetDescription>
                                    This action cannot be undone. This will permanently delete your account
                                    and remove your data from our servers.
                                </SheetDescription>
                            </div>
                            {cart.map((product: Product) => {
                                return (
                                    <CartCard key={product.id} product={product} setCart={setCart} />
                                );
                            })}
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}

export default Navbar