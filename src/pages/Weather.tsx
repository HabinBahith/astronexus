import { SpaceWeather } from "@/components/weather/SpaceWeather";
import { NASAFeed } from "@/components/weather/NASAFeed";
import { PageLayout } from "./PageLayout";

const Weather = () => (
  <PageLayout>
    <div className="space-y-6">
      <SpaceWeather />
      <NASAFeed />
    </div>
  </PageLayout>
);

export default Weather;

