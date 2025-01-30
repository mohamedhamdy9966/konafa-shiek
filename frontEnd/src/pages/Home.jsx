import { useState, useEffect } from "react";
import BestSeller from "../components/BestSeller";
import LatestCollection from "../components/LatestCollection";
import MainContent from "../components/MainContent";
import NewsLetterBox from "../components/NewsLetterBox";
import OurPolicy from "../components/OurPolicy";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="w-16 h-16 border-8 border-t-8 border-t-blue-500 border-green-400 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <MainContent />
          <LatestCollection />
          <BestSeller />
          <OurPolicy />
          <NewsLetterBox />
        </>
      )}
    </div>
  );
};

export default Home;
