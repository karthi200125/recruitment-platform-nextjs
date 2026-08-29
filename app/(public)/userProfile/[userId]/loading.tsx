import Loader from "@/components/loader/CustomLoader";

export default function Loading() {
    return (
        <div className="flex h-[calc(100vh-70px)] w-full items-center justify-center">
            <Loader />
        </div>
    );
}