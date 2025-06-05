interface EmptyStateProps {
  title: string
  description: string
  icon?: string
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon }) => (
  <div className="text-center py-12 rounded-xl bg-white shadow-sm border border-dashed border-gray-200">
    {icon && (
      <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
        {/* Add your icon component here */}
      </div>
    )}
    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
    <p className="mt-1 text-sm text-gray-500">{description}</p>
  </div>
)

export default EmptyState