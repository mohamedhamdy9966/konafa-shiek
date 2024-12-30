const Title = ({ text1, text2 }) => {
  return (
    <div className="inline-flex items-center gap-2 mb-3">
      <h2 className="text-gray-500 text-lg">
        {text1} <span className="text-gray-700 font-medium">{text2}</span>
      </h2>
      <span className="flex-grow h-[1px] sm:h-[2px] bg-gray-700"></span>
    </div>
  );
};

export default Title;
