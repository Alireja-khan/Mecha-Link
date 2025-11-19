"use client";
import { 
  BarChart3, Clock, Flame, ThumbsUp, MessageSquare, Zap, 
  TrendingUp, Hash, Award, Users, Bookmark, Eye, Plus 
} from 'lucide-react';

export const ForumSidebar = ({ 
  currentUser, 
  stats, 
  popularCategories, 
  recentUsers, 
  topContributors,
  onCategorySelect, 
  selectedCategory,
  onCreatePost,
  onSortChange,
  activeSort
}) => {
  return (
    <div className="h-full flex flex-col">
      {/* Scrollable area with hidden scrollbar */}
      <div className="overflow-y-auto flex-1 space-y-6 
                      [-ms-overflow-style:none] 
                      [scrollbar-width:none]
                      [-webkit-overflow-scrolling:touch]
                      [&::-webkit-scrollbar]:hidden">
        {/* User Profile Card with Quick Actions */}
        <div className="bg-base-200 rounded-2xl p-6 border border-neutral/50 shadow-lg">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              {currentUser?.profileImage ? (
                <img
                  src={currentUser.profileImage}
                  alt={currentUser.name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-primary/20 shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {currentUser?.name?.charAt(0) || "U"}
                </div>
              )}
            </div>
            <h3 className="font-bold text-lg text-base-content mb-1">{currentUser?.name}</h3>
            <p className="text-sm text-base-content/60 capitalize mb-4">{currentUser?.role}</p>
            <button
              onClick={onCreatePost}
              className="w-full bg-primary text-primary-content py-3 rounded-xl font-semibold hover:bg-orange-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              New Post
            </button>
          </div>
        </div>

        {/* Quick Sort Options */}
        <QuickSortOptions activeSort={activeSort} onSortChange={onSortChange} />

        {/* Forum Statistics */}
        <ForumStats stats={stats} />

        {/* Popular Categories */}
        <PopularCategories 
          popularCategories={popularCategories}
          selectedCategory={selectedCategory}
          onCategorySelect={onCategorySelect}
        />

        {/* Top Contributors */}
        <TopContributors topContributors={topContributors} />

        {/* Recent Active Users */}
        {/* <RecentActiveUsers recentUsers={recentUsers} /> */}

        {/* Quick Actions */}
        {/* <QuickActions /> */}
      </div>
    </div>
  );
};

// Sub-components for sidebar
const QuickSortOptions = ({ activeSort, onSortChange }) => (
  <div className="bg-base-200 rounded-2xl p-6 border border-neutral/50 shadow-lg">
    <h3 className="font-bold text-lg text-base-content mb-4 flex items-center gap-2">
      <BarChart3 size={20} />
      Sort By
    </h3>
    <div className="space-y-2">
      {[
        { value: "latest", label: "Latest", icon: Clock },
        { value: "most-liked", label: "Most Liked", icon: ThumbsUp },
      ].map((sort) => (
        <button
          key={sort.value}
          onClick={() => onSortChange(sort.value)}
          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
            activeSort === sort.value
              ? 'bg-primary/10 text-primary border border-primary/20 shadow-md'
              : 'bg-base-200 text-base-content hover:bg-base-300'
          }`}
        >
          <sort.icon size={18} />
          <span className="text-sm font-medium">{sort.label}</span>
        </button>
      ))}
    </div>
  </div>
);

const ForumStats = ({ stats }) => (
  <div className="bg-base-200 rounded-2xl p-6 border border-neutral/50 shadow-lg">
    <h3 className="font-bold text-lg text-base-content mb-4 flex items-center gap-2">
      <TrendingUp size={20} />
      Forum Stats
    </h3>
    <div className="space-y-3">
      <div className="flex justify-between items-center p-2 bg-base-200 rounded-lg">
        <span className="text-base-content/60">Total Posts</span>
        <span className="font-semibold text-base-content">{stats.totalPosts}</span>
      </div>
      <div className="flex justify-between items-center p-2 bg-base-200 rounded-lg">
        <span className="text-base-content/60">Total Comments</span>
        <span className="font-semibold text-base-content">{stats.totalComments}</span>
      </div>
      <div className="flex justify-between items-center p-2 bg-base-200 rounded-lg">
        <span className="text-base-content/60">Active Users</span>
        <span className="font-semibold text-base-content">{stats.activeUsers}</span>
      </div>
      <div className="flex justify-between items-center p-2 bg-base-200 rounded-lg">
        <span className="text-base-content/60">Total Likes</span>
        <span className="font-semibold text-base-content">{stats.totalLikes || 0}</span>
      </div>
    </div>
  </div>
);

const PopularCategories = ({ popularCategories, selectedCategory, onCategorySelect }) => (
  <div className="bg-base-200 rounded-2xl p-6 border border-neutral/50 shadow-lg">
    <h3 className="font-bold text-lg text-base-content mb-4 flex items-center gap-2">
      <Hash size={20} />
      Popular Categories
    </h3>
    <div className="space-y-2">
      {popularCategories.map((category) => (
        <button
          key={category.value}
          onClick={() => onCategorySelect(category.value)}
          className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${
            selectedCategory === category.value
              ? 'bg-primary/10 text-primary border border-primary/20 shadow-md'
              : 'bg-base-200 text-base-content hover:bg-base-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${category.color.split(' ')[0]} shadow-lg`}></div>
            <span className="text-sm font-medium group-hover:text-base-content">{category.label}</span>
          </div>
          <span className="text-xs bg-base-200 px-2 py-1 rounded-full font-semibold shadow-lg">
            {category.count}
          </span>
        </button>
      ))}
    </div>
  </div>
);

const TopContributors = ({ topContributors }) => (
  <div className="bg-base-200 rounded-2xl p-6 border border-neutral/50 shadow-lg">
    <h3 className="font-bold text-lg text-base-content mb-4 flex items-center gap-2">
      <Award size={20} />
      Top Contributors
    </h3>
    <div className="space-y-3">
      {topContributors.map((user, index) => (
        <div key={`${user.id}-${index}`} className="flex items-center gap-3 p-2 bg-base-200 rounded-lg group hover:bg-base-300 transition-colors duration-200">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="relative">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-primary/20"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white text-xs font-bold">
                  {user.name?.charAt(0) || "U"}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-base-200"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-base-content truncate">{user.name.split(' ')[0]}</p>
              <p className="text-xs text-base-content/60">{user.postCount} posts</p>
            </div>
          </div>
          {index < 3 && (
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              index === 0 ? 'bg-yellow-500 text-white' :
              index === 1 ? 'bg-gray-400 text-white' :
              'bg-orange-500 text-white'
            }`}>
              {index + 1}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

// const RecentActiveUsers = ({ recentUsers }) => (
//   <div className="bg-base-200 rounded-2xl p-6 border border-neutral/50 shadow-lg">
//     <h3 className="font-bold text-lg text-base-content mb-4 flex items-center gap-2">
//       <Users size={20} />
//       Active Now
//     </h3>
//     <div className="grid grid-cols-4 gap-3">
//       {recentUsers.map((user) => (
//         <div key={user.id} className="text-center group cursor-pointer" title={user.name}>
//           <div className="relative inline-block">
//             {user.image ? (
//               <img
//                 src={user.image}
//                 alt={user.name}
//                 className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-primary transition-colors duration-200 shadow-lg"
//               />
//             ) : (
//               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform duration-200 shadow-lg">
//                 {user.name?.charAt(0) || "U"}
//               </div>
//             )}
//             <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-base-100 shadow-lg"></div>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// );

// const QuickActions = () => (
//   <div className="bg-base-200 rounded-2xl p-6 border border-neutral/50">
//     <h3 className="font-bold text-lg text-base-content mb-4">Quick Actions</h3>
//     <div className="space-y-2">
//       <button className="w-full flex items-center gap-3 p-3 bg-base-200 rounded-xl hover:bg-base-300 transition-colors duration-200 text-left group">
//         <Bookmark size={18} />
//         <span className="text-sm font-medium group-hover:text-base-content">Saved Posts</span>
//       </button>
//       <button className="w-full flex items-center gap-3 p-3 bg-base-200 rounded-xl hover:bg-base-300 transition-colors duration-200 text-left group">
//         <ThumbsUp size={18} />
//         <span className="text-sm font-medium group-hover:text-base-content">My Reactions</span>
//       </button>
//       <button className="w-full flex items-center gap-3 p-3 bg-base-200 rounded-xl hover:bg-base-300 transition-colors duration-200 text-left group">
//         <Eye size={18} />
//         <span className="text-sm font-medium group-hover:text-base-content">Viewed Posts</span>
//       </button>
//     </div>
//   </div>
// );

export default ForumSidebar;