"use client";
import { Search, Filter, Image as ImageIcon, MessageSquare, Hash, X, ChevronDown, ChevronUp } from 'lucide-react';
import { CATEGORIES, CATEGORY_COLORS } from "@/lib/forumConstants";
import PostSkeleton from './PostSkeleton';
import MarkdownEditor from '@/app/Components/MarkdownEditor';
import PostCard from '@/app/Components/PostCard';

export const ForumContent = ({
  currentUser,
  posts,
  loading,
  newPostContent,
  setNewPostContent,
  showPostForm,
  setShowPostForm,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters,
  uploadedImages,
  setUploadedImages,
  activeSort,
  setActiveSort,
  stats,
  pagination,
  handleCreatePost,
  loadMorePosts,
  fetchPosts
}) => {
  return (
    <div className="flex-1 min-w-0 flex flex-col">
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40" size={20} />
          <input
            type="text"
            placeholder="Search posts, users, comments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-base-200 border border-neutral/30 rounded-xl focus:outline-none focus:border-primary/50 focus:bg-base-200 text-base-content placeholder-base-content/40"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto
                      [-ms-overflow-style:none] 
                      [scrollbar-width:none]
                      [-webkit-overflow-scrolling:touch]
                      [&::-webkit-scrollbar]:hidden">
        {!showPostForm && (
          <CreatePostButton currentUser={currentUser} setShowPostForm={setShowPostForm} />
        )}

        {showPostForm && (
          <CreatePostForm
            currentUser={currentUser}
            newPostContent={newPostContent}
            setNewPostContent={setNewPostContent}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            uploadedImages={uploadedImages}
            setUploadedImages={setUploadedImages}
            setShowPostForm={setShowPostForm}
            handleCreatePost={handleCreatePost}
          />
        )}

        <PostsHeader 
          selectedCategory={selectedCategory}
          posts={posts}
          stats={stats}
          activeSort={activeSort}
          setActiveSort={setActiveSort}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />

        {showFilters && (
          <CategoryFilters selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        )}

        <PostsList
          posts={posts}
          loading={loading}
          stats={stats}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          currentUser={currentUser}
          fetchPosts={fetchPosts}
          pagination={pagination}
          loadMorePosts={loadMorePosts}
          setShowPostForm={setShowPostForm}
        />
      </div>
    </div>
  );
};

const CreatePostButton = ({ currentUser, setShowPostForm }) => (
  <div className="bg-base-200 rounded-2xl p-4 border border-neutral/50 shadow-sm mb-6">
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0">
        {currentUser?.profileImage ? (
          <img
            src={currentUser.profileImage}
            alt={currentUser.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white font-bold text-lg">
            {currentUser?.name?.charAt(0) || "U"}
          </div>
        )}
      </div>
      
      <button
        onClick={() => setShowPostForm(true)}
        className="flex-1 text-left p-4 bg-base-100 rounded-xl border border-neutral/30 hover:bg-base-300 transition-all duration-200 text-base-content/60 hover:text-base-content"
      >
        <div className="flex items-center justify-between">
          <span>What's on your mind, {currentUser?.name?.split(' ')[0]}?</span>
          <div className="flex gap-2">
            <ImageIcon size={20} className="text-base-content/40" />
            <Hash size={20} className="text-base-content/40" />
          </div>
        </div>
      </button>
    </div>
  </div>
);

const CreatePostForm = ({
  currentUser,
  newPostContent,
  setNewPostContent,
  selectedCategory,
  setSelectedCategory,
  uploadedImages,
  setUploadedImages,
  setShowPostForm,
  handleCreatePost
}) => (
  <div className="bg-base-200 rounded-2xl border border-neutral/50 shadow-lg mb-6 animate-fade-in">
    <div className="p-4 border-b border-neutral/30 flex justify-between items-center">
      <h2 className="text-xl font-bold text-base-content">Create Post</h2>
      <button
        onClick={() => {
          setShowPostForm(false);
          setNewPostContent("");
          setUploadedImages([]);
        }}
        className="p-2 hover:bg-base-100 rounded-lg transition-colors"
      >
        <X size={20} />
      </button>
    </div>
    <form onSubmit={handleCreatePost} className="p-4">
      <div className="flex items-center gap-3 mb-4">
        {currentUser?.profileImage ? (
          <img
            src={currentUser.profileImage}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white text-sm font-bold">
            {currentUser?.name?.charAt(0) || "U"}
          </div>
        )}
        <div>
          <p className="font-semibold text-base-content text-sm">{currentUser?.name}</p>
          <p className="text-xs text-base-content/60 capitalize">{currentUser?.role}</p>
        </div>
      </div>

      <div className="mb-4">
        <MarkdownEditor
          value={newPostContent}
          onChange={setNewPostContent}
          placeholder="What's on your mind? Share your thoughts, questions, or experiences..."
          uploadedImages={uploadedImages}
          onImagesChange={setUploadedImages}
        />
      </div>
      
      <div className="mb-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-3 border border-neutral/30 rounded-xl bg-base-100/50 focus:bg-base-200 focus:border-primary/50 focus:outline-none text-base-content text-sm"
        >
          <option value="all">Select Category</option>
          {CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex justify-end gap-3 pt-4 border-t border-neutral/30">
        <button
          type="button"
          onClick={() => {
            setShowPostForm(false);
            setNewPostContent("");
            setUploadedImages([]);
            setSelectedCategory("all");
          }}
          className="px-6 py-2 bg-base-100 text-base-content rounded-lg font-medium hover:bg-base-300 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-primary text-primary-content px-6 py-2 rounded-lg font-medium hover:bg-orange-700 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!newPostContent.trim()}
        >
          Post
        </button>
      </div>
    </form>
  </div>
);

const PostsHeader = ({ selectedCategory, posts, stats, activeSort, setActiveSort, showFilters, setShowFilters }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
    <div>
      <h2 className="text-xl font-bold text-base-content">
        {selectedCategory !== "all" 
          ? `${CATEGORIES.find(c => c.value === selectedCategory)?.label || selectedCategory} Posts`
          : "Community Discussions"
        }
        <span className="ml-2 text-sm font-normal text-base-content/60">
          ({posts.length} of {stats.totalPosts} posts)
        </span>
      </h2>
    </div>
    
    <div className="flex items-center gap-3">
      <select
        value={activeSort}
        onChange={(e) => setActiveSort(e.target.value)}
        className="px-4 py-2 bg-base-200 border border-neutral/30 rounded-xl focus:outline-none focus:border-primary/50 text-base-content text-sm"
      >
        <option value="latest">Latest</option>
        <option value="oldest">Oldest</option>
        <option value="popular">Most Popular</option>
        <option value="most-liked">Most Liked</option>
        <option value="most-commented">Most Discussed</option>
        <option value="trending">Trending</option>
      </select>
      
      <button
        onClick={() => setShowFilters(!showFilters)}
        className={`px-4 py-2 border rounded-xl transition-colors duration-200 flex items-center gap-2 ${
          showFilters 
            ? 'bg-primary text-primary-content border-primary' 
            : 'bg-base-200 border-neutral/30 text-base-content hover:bg-base-100'
        }`}
      >
        <Filter size={16} />
        Filters
        {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
    </div>
  </div>
);

const CategoryFilters = ({ selectedCategory, setSelectedCategory }) => (
  <div className="bg-base-200 rounded-2xl p-6 border border-neutral/30 shadow-sm mb-6">
    <h3 className="font-semibold text-base-content mb-4">Filter by Category</h3>
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setSelectedCategory("all")}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          selectedCategory === "all"
            ? 'bg-primary text-primary-content border-2 border-primary shadow-lg'
            : 'bg-base-100 text-base-content/70 border border-neutral/30 hover:bg-base-300'
        }`}
      >
        All Categories
      </button>
      {CATEGORIES.map((category) => (
        <button
          key={category.value}
          onClick={() => setSelectedCategory(category.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            selectedCategory === category.value
              ? CATEGORY_COLORS[category.value] + ' border-2 border-primary shadow-lg'
              : 'bg-base-100 text-base-content/70 border border-neutral/30 hover:bg-base-300'
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  </div>
);

const PostsList = ({
  posts,
  loading,
  stats,
  searchQuery,
  selectedCategory,
  currentUser,
  fetchPosts,
  pagination,
  loadMorePosts,
  setShowPostForm
}) => (
  <div className="space-y-6">
    {loading && posts.length === 0 ? (
      [...Array(3)].map((_, index) => <PostSkeleton key={index} />)
    ) : posts.length === 0 ? (
      <div className="bg-base-200 rounded-2xl p-12 text-center border border-neutral/50 shadow-sm">
        <MessageSquare size={48} className="mx-auto text-base-content/20 mb-4" />
        <h3 className="text-lg font-semibold text-base-content mb-2">No posts found</h3>
        <p className="text-base-content/60 mb-6">
          {searchQuery || selectedCategory !== "all" 
            ? "Try adjusting your search or filters"
            : "Be the first to start a discussion!"
          }
        </p>
        <button
          onClick={() => setShowPostForm(true)}
          className="bg-primary text-primary-content px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-all duration-200 hover:scale-105"
        >
          Create First Post
        </button>
      </div>
    ) : (
      <>
        {posts.map((post) => (
          <PostCard 
            key={post._id}
            post={post}
            onUpdate={() => fetchPosts(1, false)}
            currentUser={currentUser}
          />
        ))}
        
        {pagination.hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={loadMorePosts}
              disabled={loading}
              className="bg-primary text-primary-content px-8 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Load More Posts"
              )}
            </button>
          </div>
        )}
      </>
    )}
  </div>
);

export default ForumContent;