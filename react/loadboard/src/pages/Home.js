import Navigation from "../components/navbar";
import Searchbar from "../components/search";
import RealTimeTable from "../components/table";

function Home() {
    return (
      <div>
        <div>
        <Navigation color ="black"/>
        </div>
        <p class="slogan">Revolutionizing the Road, One Load at a Time</p>

    <div class="select-trucker">
        <Searchbar/>
    </div>
    <RealTimeTable/>
    </div>
    );
  }
  
  export default Home;