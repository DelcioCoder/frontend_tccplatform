'use client'
import { useEffect, useState } from "react";
import AdvisorCard from "@/components/AdvisorCard";
import StudentCard from "@/components/StudentCard";
import RequestModal from "@/components/RequestModal";
import { Advisor, Student } from "@/types/advisor";
import { getAdvisors } from "@/lib/api/advisors";
import { getStudents } from "@/lib/api/students";
import { getAuthenticatedUser } from "@/lib/api/auth";
export default function Connect() {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Advisor | Student | null>(null);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getAuthenticatedUser();
      if (user) {
        setUserType(user.user_type);
        if (user.user_type === 'student') {
          const advisorData = await getAdvisors();
          setAdvisors(advisorData);
        } else if (user.user_type === 'advisor') {
          const studentData = await getStudents();
          setStudents(studentData);
        }
      }
    };

    fetchUserData();
  }, []);



  const handleConnect = (user: Advisor | Student) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  if (!userType) {
    return <div className="text-center text-gray-500">Carregando...</div>
  }


  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{
        userType === "student" ? "Conectar com Orientadores" : "Conectar com Estudantes"
      }</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {userType === "student" &&
          advisors.map((advisor) => (
            <AdvisorCard key={advisor.user_id} advisor={advisor} onConnect={handleConnect} />
          ))
        }
        {userType === "advisor" &&
          students.map((student) => (
            <StudentCard key={student.user_id} student={student} onConnect={handleConnect} />
          ))
        }
      </div>
      {selectedUser && (
        <RequestModal
          isOpen={isModalOpen}
          onClose={closeModal}
          user={selectedUser}
        />
      )}
    </div>
  );
}
