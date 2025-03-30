import { Advisor } from "@/types/advisor";

interface AdvisorCardProps {
  advisor: Advisor;
  onConnect: (advisor: Advisor) => void;
}

export default function AdvisorCard({ advisor, onConnect }: AdvisorCardProps) {
  return (
    <article 
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200 hover:border-blue-300 p-6 flex flex-col justify-between"
      aria-label={`Orientador: ${advisor.username}`}
    >
      <div>
        {/* Avatar com gradiente */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-md">
          {advisor.username.charAt(0).toUpperCase()}
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-800">{advisor.username}</h2>
          <span className="inline-block bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {advisor.specialization}
          </span>
          <p className="text-gray-600 text-base leading-relaxed line-clamp-3">
            {advisor.biography}
          </p>
        </div>
      </div>
      
      <button
        onClick={() => onConnect(advisor)}
        aria-label={`Solicitar orientação de ${advisor.username}`}
        className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
        </svg>
        Solicitar Orientação
      </button>
    </article>
  );
}
