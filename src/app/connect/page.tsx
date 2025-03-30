'use client'
import { useEffect, useState } from "react";
import AdvisorCard from "@/components/AdvisorCard";
import RequestModal from "@/components/RequestModal";
import { Advisor } from "@/types/advisor";
import { getAdvisors } from "@/lib/api/advisors";

export default function Connect() {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        const advisorsData = await getAdvisors();
        setAdvisors(advisorsData);
      } catch (error) {
        console.error('Erro ao buscar orientadores:', error);
      }
    };
    fetchAdvisors();
  }, []);

  const handleConnect = (advisor: Advisor) => {
    setSelectedAdvisor(advisor);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAdvisor(null);
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Conectar com Orientadores</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {advisors.map((advisor) => (
          <AdvisorCard key={advisor.user_id} advisor={advisor} onConnect={handleConnect} />
        ))}
      </div>
      {selectedAdvisor && (
        <RequestModal
          isOpen={isModalOpen}
          onClose={closeModal}
          advisor={selectedAdvisor}
        />
      )}
    </div>
  );
}
