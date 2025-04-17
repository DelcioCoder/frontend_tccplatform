import { Advisor } from "@/types/advisor";
import { User, UserPlus, BadgeCheck } from 'lucide-react'; 


interface AdvisorCardProps {
  advisor: Advisor;
  onConnect: (advisor: Advisor) => void;
}

export default function AdvisorCard({ advisor, onConnect }: AdvisorCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg group h-full flex flex-col">
      {/* Header com imagem de capa e foto de perfil */}
      <div className="relative h-24 bg-gradient-to-r from-blue-50 to-indigo-50">
        {advisor.coverImage && (
          <img
            src={advisor.coverImage}
            alt=""
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute -bottom-10 left-6">
          <div className="relative w-20 h-20 rounded-full border-4 border-white shadow-sm overflow-hidden bg-white">
            {advisor.profilePicture ? (
              <img
                src={advisor.profilePicture}
                alt={`${advisor.username}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <User className="w-10 h-10 text-gray-400" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="p-6 pt-12 grid grid-cols-1 gap-4 flex-grow">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold text-gray-800">{advisor.username}</h2>
            {advisor.isVerified && (
              <BadgeCheck className="w-5 h-5 text-blue-500" />
            )}
          </div>
          
          {advisor.specialization && (
            <p className="text-sm text-gray-600 font-medium mt-1">{advisor.specialization}</p>
          )}
        </div>

        {/* Estatísticas simplificadas - sem avaliação */}
        <div className="flex justify-around py-2 border-t border-b border-gray-100 text-center">
          <div className="px-2">
            <p className="text-sm font-semibold text-gray-800">{advisor.clientsCount || 0}</p>
            <p className="text-xs text-gray-500">Clientes</p>
          </div>
          <div className="px-2">
            <p className="text-sm font-semibold text-gray-800">{advisor.experienceYears || 0}</p>
            <p className="text-xs text-gray-500">Anos</p>
          </div>
        </div>

        {/* Biografia */}
        <div className="min-h-20 overflow-hidden text-ellipsis flex-grow">
          {advisor.biography ? (
            <p className="text-gray-700 text-sm leading-relaxed">{advisor.biography}</p>
          ) : (
            <p className="text-gray-400 italic text-sm">Sem informações adicionais</p>
          )}
        </div>

        {/* Áreas de especialidade */}
        {advisor.expertiseAreas && advisor.expertiseAreas.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {advisor.expertiseAreas.slice(0, 3).map((area, index) => (
              <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                {area}
              </span>
            ))}
            {advisor.expertiseAreas.length > 3 && (
              <span className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-full">
                +{advisor.expertiseAreas.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Botão de conexão - sempre no final do card */}
      <div className="p-6 pt-0">
        <button
          onClick={() => onConnect(advisor)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
          aria-label={`Conectar com ${advisor.username}`}
        >
          <UserPlus className="w-5 h-5" />
          <span>Conectar</span>
        </button>
      </div>
    </div>
  );
}