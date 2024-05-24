import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const VerificationPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div>
      <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-[#F9F7F0] opacity-75 flex flex-col items-center justify-center">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-300 h-12 w-12 mb-4 text-green-300"></div>
        <h2 className="text-center text-black text-xl font-semibold">
          Loading...
        </h2>
        <p className="w-1/3 text-center text-black">
          This may take a few seconds, please don't close this page.
        </p>
      </div>
    </div>
  );
};

export default VerificationPage;
