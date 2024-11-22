import LoginCard from "@/components/LoginCard";

function Login() {
    return (
        <div className="w-full h-screen flex justify-center items-center bg-neutral-200">
            <div className="w-1/2 flex justify-center items-center max-lg:w-full">
                <LoginCard />
            </div>
            <div className="w-1/2 flex justify-center items-center p-8 max-lg:hidden">
                <img className="w-full rounded object-cover" src="https://tinyrituals.co/cdn/shop/articles/StudioSession-35176-3_800x_bb5080f3-8fba-4706-b911-bbd8fc35ff32_1024x1024.webp?v=1725288340" />
            </div>
        </div>
    );
}

export default Login