export default function Loading() {
    return (
        <div className="flex h-[calc(100vh-70px)] w-full items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
        </div>
    );
}