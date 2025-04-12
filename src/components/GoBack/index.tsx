"use client"
import { ArrowLeft } from "lucide-react";

export default function Goback() {
  return (
    <div>
      <button
        onClick={() => {
          window.history.back();
        }}
        className="bg-blue-500 flex  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
      >
        <ArrowLeft size={16} className="mt-1 mr-4"/>
        <span>Voltar</span>
      </button>
    </div>
  );
}