const DateSeparator = ({ label }) => {
  return (
    <div className="flex justify-center my-6">
      <div className="bg-white rounded-full px-4 py-1.5 shadow-sm border border-gray-100">
        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
          {label}
        </span>
      </div>
    </div>
  );
};

export default DateSeparator;
