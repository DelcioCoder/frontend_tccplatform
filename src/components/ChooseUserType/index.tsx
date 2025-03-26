"use client"
import { UserCheck, BookOpen } from "lucide-react"

interface ChooseUserTypeProps {
    userType: 'student' | 'advisor'
    setUserType: (userType: 'student' | 'advisor') => void
}

export default function ChooseUserType({
    userType,
    setUserType
}: ChooseUserTypeProps) {
    return (
        <>
            {/* User Type Selection */}
            <div className="flex justify-center mb-4">
                <div className="flex border border-gray-300 rounded-lg overflow-hidden mx-1">
                    <button
                        type="button"
                        onClick={() => setUserType('student')}
                        className={`flex items-center px-4 py-2 transition-colors duration-300 cursor-pointer ${
                            userType === 'student' ? 'bg-blue-600 text-white cursor-pointer' : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <UserCheck className="mr-2" size={20} />
                        Estudante
                    </button>
                </div>
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                        <button
                        type="button"
                        onClick={() => setUserType('advisor')}
                        className={`flex items-center px-4 py-2 transition-colors duration-300 cursor-pointer ${
                            userType === 'advisor' ? 'bg-blue-600 text-white cursor-pointer' : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <BookOpen className="mr-2" size={20} />
                        Orientador
                    </button>
                </div>
            </div>
        </>
    )
}