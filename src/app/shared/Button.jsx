import React from "react";

const Button = ({children, onClick}) => {
  return (
    <button
      onClick={onClick}
      className="bg-primary text-white px-8 py-4 rounded-xl hover:bg-secondary transition-all cursor-pointer duration-300 w-full sm:w-auto font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
    >
      {children}
    </button>
  );
};

export default Button;
