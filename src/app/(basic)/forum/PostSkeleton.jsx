const PostSkeleton = () => (
  <div className="bg-base-100 rounded-3xl p-6 border border-neutral shadow-xl animate-pulse">
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className="skeleton w-12 h-12 rounded-2xl bg-base-300"></div>
        <div className="space-y-2">
          <div className="skeleton h-4 w-32 bg-base-300 rounded"></div>
          <div className="skeleton h-3 w-24 bg-base-300 rounded"></div>
        </div>
      </div>
      <div className="skeleton w-20 h-6 bg-base-300 rounded-full"></div>
    </div>
    <div className="space-y-3 mb-6">
      <div className="skeleton h-4 w-full bg-base-300 rounded"></div>
      <div className="skeleton h-4 w-11/12 bg-base-300 rounded"></div>
      <div className="skeleton h-4 w-4/5 bg-base-300 rounded"></div>
    </div>
    <div className="flex gap-4">
      <div className="skeleton h-8 w-20 bg-base-300 rounded-xl"></div>
      <div className="skeleton h-8 w-20 bg-base-300 rounded-xl"></div>
      <div className="skeleton h-8 w-20 bg-base-300 rounded-xl"></div>
    </div>
  </div>
);

export default PostSkeleton;