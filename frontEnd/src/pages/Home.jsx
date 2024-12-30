import BestSeller from "../components/BestSeller"
import LatestCollection from "../components/LatestCollection"
import MainContent from "../components/MainContent"
import NewsLetterBox from "../components/NewsLetterBox"
import OurPolicy from "../components/OurPolicy"

const Home = () => {
  return (
    <div>
      <MainContent/>
      <LatestCollection/>
      <BestSeller/>
      <OurPolicy/>
      <NewsLetterBox/>
    </div>
  )
}

export default Home
