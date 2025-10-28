const ChartCard = ({ title, icon: Icon, gradient, children, actions }) => {
  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{title}</h2>
        </div>
        {actions}
      </div>
      {children}
    </div>
  )
}

export default ChartCard
