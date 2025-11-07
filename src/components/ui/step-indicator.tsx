const StepIndicator = ({
  number,
  label,
  active,
  completed,
}: {
  number: number;
  label: string;
  active?: boolean;
  completed?: boolean;
}) => {
  return (
    <div className="flex items-center space-x-3">
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${
          completed
            ? 'bg-blue-600 text-white'
            : active
              ? 'border-2 border-blue-600 text-blue-600'
              : 'bg-white text-gray-500 border'
        }`}
      >
        {number}
      </div>
      <div
        className={`${active ? 'text-blue-600' : 'text-gray-500'} text-sm font-semibold`}
      >
        {label}
      </div>
    </div>
  );
};
export default StepIndicator;
