import React from "react";

const LoadingSkeleton = () => {
  return (
    <div className="min-h-screen">
      <BannerSkeleton />
      <StorySectionSkeleton />
      <MissionVisionSkeleton />
      <FeaturesSkeleton />
      <TechnologySkeleton />
      <FounderSkeleton />
      <TeamSkeleton />
      <CTASkeleton />
    </div>
  );
};

// Skeleton Components
const BannerSkeleton = () => (
  <section className="relative bg-gradient-to-r from-primary via-primary to-red-600 py-16 overflow-hidden">
    <div className="absolute inset-0 bg-black/10"></div>
    <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>

    <div className="lg:container mx-auto px-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Content Skeleton */}
          <div className="flex-1 text-center lg:text-left animate-pulse">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <div className="skeleton bg-white/30 w-5 h-5 rounded-full"></div>
              <div className="skeleton bg-white/30 h-4 w-48 rounded"></div>
            </div>

            <div className="skeleton bg-white/30 h-16 w-3/4 rounded-lg mb-6 mx-auto lg:mx-0"></div>
            <div className="skeleton bg-white/30 h-6 w-full rounded mb-4"></div>
            <div className="skeleton bg-white/30 h-6 w-5/6 rounded mb-8"></div>

            {/* Stats Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-white">
                  <div className="skeleton bg-gray-300 w-6 h-6 mx-auto mb-2 rounded-full"></div>
                  <div className="skeleton bg-gray-300 h-7 w-12 mx-auto mb-1 rounded"></div>
                  <div className="skeleton bg-gray-300 h-4 w-16 mx-auto rounded"></div>
                </div>
              ))}
            </div>

            {/* Buttons Skeleton */}
            <div className="flex flex-wrap gap-4">
              <div className="skeleton bg-white/30 h-12 w-40 rounded-full"></div>
              <div className="skeleton bg-white/30 h-12 w-40 rounded-full"></div>
            </div>
          </div>

          {/* Right Illustration Skeleton */}
          <div className="flex-1 flex justify-center animate-pulse">
            <div className="relative">
              <div className="w-80 h-80 bg-white/10 backdrop-blur-sm rounded-3xl border-2 border-white/20 flex items-center justify-center">
                <div className="text-center p-8 w-full">
                  <div className="skeleton bg-white/30 w-16 h-16 rounded-full mx-auto mb-4"></div>
                  <div className="skeleton bg-white/30 h-6 w-32 mx-auto mb-2 rounded"></div>
                  <div className="skeleton bg-white/30 h-4 w-full rounded mb-1"></div>
                  <div className="skeleton bg-white/30 h-4 w-5/6 mx-auto rounded"></div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400/20 rounded-full backdrop-blur-sm border border-yellow-300/30"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-400/20 rounded-full backdrop-blur-sm border border-green-300/30"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const SectionHeaderSkeleton = ({ titleWidth = "w-48", descriptionWidth = "w-64" }) => (
  <div className="text-center md:mb-16 animate-pulse">
    <div className={`skeleton bg-gray-200 h-10 ${titleWidth} mx-auto mb-4 rounded`}></div>
    <div className="skeleton bg-primary h-1 w-20 mx-auto"></div>
    <div className={`skeleton bg-gray-200 h-4 ${descriptionWidth} mx-auto mt-4 rounded`}></div>
  </div>
);

const StorySectionSkeleton = () => (
  <section className="lg:container mx-auto px-6 py-5 lg:py-20">
    <SectionHeaderSkeleton titleWidth="w-32" descriptionWidth="w-96" />
    <div className="grid xl:grid-cols-2 gap-16 items-center">
      <div className="w-full lg:w-full lg:flex items-center justify-center animate-pulse">
        <div className="skeleton bg-gray-200 h-80 md:h-[400px] lg:h-[500px] w-full rounded-2xl"></div>
      </div>
      <div className="animate-pulse">
        <div className="skeleton bg-gray-200 h-8 w-3/4 rounded mb-6"></div>
        <div className="space-y-4 mb-6">
          <div className="skeleton bg-gray-200 h-4 w-full rounded"></div>
          <div className="skeleton bg-gray-200 h-4 w-full rounded"></div>
          <div className="skeleton bg-gray-200 h-4 w-5/6 rounded"></div>
          <div className="skeleton bg-gray-200 h-4 w-full rounded"></div>
          <div className="skeleton bg-gray-200 h-4 w-4/6 rounded"></div>
        </div>
        <div className="skeleton bg-gray-200 h-24 w-full rounded-xl"></div>
      </div>
    </div>
  </section>
);

const MissionVisionSkeleton = () => (
  <section className="py-20">
    <div className="lg:container mx-auto px-6">
      <SectionHeaderSkeleton titleWidth="w-56" />
      <div className="grid md:grid-cols-2 gap-10 animate-pulse">
        {[...Array(2)].map((_, index) => (
          <div key={index} className="p-8 rounded-2xl shadow-lg border border-gray-200">
            <div className="skeleton bg-gray-200 w-16 h-16 rounded-2xl mb-6"></div>
            <div className="skeleton bg-gray-200 h-7 w-40 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="skeleton bg-gray-200 h-4 w-full rounded"></div>
              <div className="skeleton bg-gray-200 h-4 w-full rounded"></div>
              <div className="skeleton bg-gray-200 h-4 w-3/4 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FeaturesSkeleton = () => (
  <section className="py-20">
    <div className="lg:container mx-auto px-6">
      <SectionHeaderSkeleton titleWidth="w-64" descriptionWidth="w-96" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="p-6 rounded-xl border border-gray-200">
            <div className="skeleton bg-gray-200 w-12 h-12 rounded-xl mb-4"></div>
            <div className="skeleton bg-gray-200 h-6 w-40 rounded mb-2"></div>
            <div className="space-y-2">
              <div className="skeleton bg-gray-200 h-4 w-full rounded"></div>
              <div className="skeleton bg-gray-200 h-4 w-5/6 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const TechnologySkeleton = () => (
  <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
    <div className="lg:container mx-auto px-6">
      <SectionHeaderSkeleton titleWidth="w-40" descriptionWidth="w-80" />
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center animate-pulse">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="p-6 bg-white/5 rounded-xl backdrop-blur-sm">
            <div className="skeleton bg-gray-400 h-8 w-24 mx-auto mb-2 rounded"></div>
            <div className="skeleton bg-gray-400 h-4 w-32 mx-auto rounded"></div>
          </div>
        ))}
      </div>
      <div className="mt-12 text-center animate-pulse">
        <div className="skeleton bg-gray-400 h-6 w-48 mx-auto rounded"></div>
      </div>
    </div>
  </section>
);

const FounderSkeleton = () => (
  <section className="py-20">
    <div className="lg:container mx-auto px-6">
      <SectionHeaderSkeleton titleWidth="w-56" descriptionWidth="w-96" />
      <div className="grid md:grid-cols-2 gap-10 items-center animate-pulse">
        <div className="border-2 border-gray-200 p-8 rounded-2xl shadow-md">
          <div className="flex items-center mb-6">
            <div className="skeleton bg-gray-200 w-20 h-20 rounded-full mr-6"></div>
            <div className="flex-1">
              <div className="skeleton bg-gray-200 h-7 w-40 rounded mb-2"></div>
              <div className="skeleton bg-gray-200 h-5 w-32 rounded mb-3"></div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="skeleton bg-gray-200 w-4 h-4 rounded"></div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-3 mb-6">
            <div className="skeleton bg-gray-200 h-4 w-full rounded"></div>
            <div className="skeleton bg-gray-200 h-4 w-full rounded"></div>
            <div className="skeleton bg-gray-200 h-4 w-3/4 rounded"></div>
          </div>
          <div className="flex space-x-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton bg-gray-200 w-10 h-10 rounded-full"></div>
            ))}
          </div>
        </div>
        <div>
          <div className="skeleton bg-gray-200 h-8 w-48 rounded mb-6"></div>
          <div className="space-y-4 mb-6">
            <div className="skeleton bg-gray-200 h-4 w-full rounded"></div>
            <div className="skeleton bg-gray-200 h-4 w-full rounded"></div>
            <div className="skeleton bg-gray-200 h-4 w-5/6 rounded"></div>
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center">
                <div className="skeleton bg-gray-200 w-5 h-5 mr-2 rounded"></div>
                <div className="skeleton bg-gray-200 h-4 w-40 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const TeamMemberSkeleton = ({ featured = false }) => (
  <div className={`group rounded-2xl overflow-hidden shadow-md border-2 ${featured ? 'border-primary' : 'border-gray-200'} animate-pulse`}>
    <div className="skeleton bg-gray-200 h-72 w-full"></div>
    <div className="p-6 text-center">
      {featured && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="skeleton bg-primary h-6 w-20 rounded-full"></div>
        </div>
      )}
      <div className="skeleton bg-gray-200 h-6 w-32 mx-auto mb-2 rounded"></div>
      <div className="skeleton bg-gray-200 h-4 w-40 mx-auto mb-4 rounded"></div>
      <div className="flex justify-center items-center space-x-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton bg-gray-200 w-6 h-6 rounded"></div>
        ))}
      </div>
    </div>
  </div>
);

const TeamSkeleton = () => (
  <section className="py-20">
    <div className="lg:container mx-auto px-6">
      <SectionHeaderSkeleton titleWidth="w-32" descriptionWidth="w-80" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <TeamMemberSkeleton featured={true} />
        {[...Array(5)].map((_, index) => (
          <TeamMemberSkeleton key={index} />
        ))}
      </div>
    </div>
  </section>
);

const CTASkeleton = () => (
  <section className="py-20 bg-gradient-to-r from-primary to-amber-600 text-white">
    <div className="max-w-4xl mx-auto px-6 text-center animate-pulse">
      <div className="skeleton bg-white/30 h-10 w-80 mx-auto mb-6 rounded"></div>
      <div className="space-y-3 mb-10">
        <div className="skeleton bg-white/30 h-5 w-full max-w-3xl mx-auto rounded"></div>
        <div className="skeleton bg-white/30 h-5 w-5/6 max-w-3xl mx-auto rounded"></div>
      </div>
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
        <div className="skeleton bg-white/30 h-12 w-48 rounded-full"></div>
        <div className="skeleton bg-white/30 h-12 w-48 rounded-full"></div>
      </div>
      <div className="skeleton bg-white/30 h-4 w-48 mx-auto rounded"></div>
    </div>
  </section>
);

export default LoadingSkeleton;