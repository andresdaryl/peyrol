export default function AccountSettingsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-4xl font-bold text-slate-800 dark:text-white mb-2"
          data-testid="account-settings-title"
        >
          Account Settings
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Manage your profile information and security settings
        </p>
      </div>

      {/* Two-column layout (Profile + Password) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
        {/* Profile skeleton */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700" />
            <div className="space-y-2">
              <div className="w-40 h-5 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="w-24 h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          </div>

          {/* Input placeholders */}
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="w-32 h-3 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
              <div className="w-full h-10 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"></div>
            </div>
          ))}

          {/* Button */}
          <div className="w-full h-10 bg-slate-300 dark:bg-slate-600 rounded-lg mt-4"></div>
        </div>

        {/* Password skeleton */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700" />
            <div className="space-y-2">
              <div className="w-40 h-5 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="w-24 h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          </div>

          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="w-40 h-3 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
              <div className="w-full h-10 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"></div>
            </div>
          ))}

          <div className="w-full h-10 bg-slate-300 dark:bg-slate-600 rounded-lg mt-4"></div>
        </div>
      </div>

      {/* Account Information skeleton */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 animate-pulse">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700" />
          <div className="w-48 h-5 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg space-y-2"
            >
              <div className="w-24 h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="w-32 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
