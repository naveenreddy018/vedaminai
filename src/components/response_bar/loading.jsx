const LoadingAnimation = () => {
    return (
      <div className="flex space-x-2 items-center mt-2">
        <div
          className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
          style={{ animationDelay: "-0.3s" }}
        ></div>
        <div
          className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
          style={{ animationDelay: "-0.15s" }}
        ></div>
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
      </div>
    );
  };
  
  export default LoadingAnimation;
  