import WeatherDetail from "@/components/weather/weather-detail"

export default function CityPage({ params }: { params: { city: string } }) {
  const decodedCity = decodeURIComponent(params.city)
  return <WeatherDetail city={decodedCity} />
}

