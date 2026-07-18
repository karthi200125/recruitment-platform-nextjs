const UserAboutMeSkeleton = () => {
  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white overflow-hidden animate-pulse">

      {/* Header */}
      <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
        <div className="h-4 w-4 rounded bg-slate-200" />
        <div className="h-4 w-28 rounded bg-slate-200" />
      </div>

      <div className="space-y-5 p-5">

        {/* About text */}
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-slate-200" />
          <div className="h-4 w-full rounded bg-slate-100" />
          <div className="h-4 w-11/12 rounded bg-slate-100" />
          <div className="h-4 w-8/12 rounded bg-slate-100" />
        </div>

        {/* Show More */}
        <div className="h-4 w-20 rounded bg-slate-100" />

        {/* Divider */}
        <div className="h-px bg-slate-100" />

        {/* Skills */}
        <div className="space-y-3">

          <div className="h-4 w-20 rounded bg-slate-200" />

          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-8 rounded-full bg-slate-100"
                style={{
                  width: `${70 + (index % 3) * 20}px`,
                }}
              />
            ))}
          </div>

        </div>

      </div>

    </section>
  );
};

export default UserAboutMeSkeleton;