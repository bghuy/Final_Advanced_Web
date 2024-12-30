import AnalyzeSchedule from "./components/AnalyzeSchedule" 

export default function AnalyzeSchedulePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            Schedule Analysis
          </span>
        </h1> */}
        <AnalyzeSchedule />
      </div>
    </div>
  )
}

