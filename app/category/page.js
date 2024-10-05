export default function Category() {
  return (
    <div className="flex flex-col h-screen p-6 space-y-6">
      {/* First row */}
      <div className="flex-1 flex space-x-6">
        <button className="flex-1 h-full bg-blue-500 hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center text-white text-2xl rounded-lg shadow-lg cursor-pointer">
          Category 1
        </button>
        <button className="flex-1 h-full bg-green-500 hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center text-white text-2xl rounded-lg shadow-lg cursor-pointer">
          Category 2
        </button>
      </div>

      {/* Second row */}
      <div className="flex-1 flex space-x-6">
        <button className="flex-1 h-full bg-red-500 hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center text-white text-2xl rounded-lg shadow-lg cursor-pointer">
          Category 3
        </button>
        <button className="flex-1 h-full bg-yellow-500 hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center text-white text-2xl rounded-lg shadow-lg cursor-pointer">
          Category 4
        </button>
      </div>
    </div>
  );
}
