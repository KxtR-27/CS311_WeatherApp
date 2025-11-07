import { RefObject, useEffect, useRef, useState } from "react";

import "./Weather.css";

import search_icon from "../assets/search.png";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";
import humidity_icon from "../assets/humidity.png";

interface WeatherData {
	main: { humidity: string; temp: string };
	wind: { speed: string };
	name: string;
	weather: { icon: string }[];
}

const Weather = () => {
	/* Official React documentation clarifies the following declaration as "built-in support"
	 * see https://react.dev/reference/react/useRef#manipulating-the-dom-with-a-ref
	 *
	 * @ts-expect-error */
	const inputRef: RefObject<HTMLInputElement> = useRef(null);
	const [weatherData, setWeatherData]: any = useState(false);

	const allIcons = {
		"01d": clear_icon,
		"01n": clear_icon,
		"02d": cloud_icon,
		"02n": cloud_icon,
		"03d": cloud_icon,
		"03n": cloud_icon,
		"04d": drizzle_icon,
		"04n": drizzle_icon,
		"09d": rain_icon,
		"09n": rain_icon,
		"10d": rain_icon,
		"10n": rain_icon,
		"13d": snow_icon,
		"13n": snow_icon,
	};

	const search = async (city: string) => {
		if (city === "") {
			inputRef.current.setCustomValidity("Enter City Name");
			inputRef.current.reportValidity();
			inputRef.current.setCustomValidity("");
			return;
		}
		try {
			const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},US&units=imperial&appid=${
				import.meta.env.VITE_APP_ID
			}`;

			const response = await fetch(url);
			const data: WeatherData = await response.json();
			console.log(data);

			if (!response.ok) {
				inputRef.current.setCustomValidity("City Not Found");
				inputRef.current.reportValidity();
				inputRef.current.setCustomValidity("");
				return;
			}

			// @ts-expect-error - honestly I've tried so many ways to type it, to no avail
			const icon = allIcons[data.weather[0].icon] || clear_icon;

			setWeatherData({
				humidity: data.main.humidity,
				windSpeed: data.wind.speed,
				temperature: data.main.temp,
				location: data.name,
				icon: icon,
			});
		} catch (error) {
			console.log(`Error: ${error}`);
		}
	};

	useEffect(() => {
		search("Muncie");
	}, []);

	return (
		<div className="weather">
			<div className="search-bar">
				<input ref={inputRef} type="text" placeholder="Search" required />
				<img src={search_icon} alt="search icon" onClick={() => search(inputRef.current.value)} />
			</div>

			{
				/* prettier-ignore */
				weatherData ? <>
					<img src={clear_icon} alt="weather-icon" className="weather-icon" />
					<p className="temperature">{weatherData.tempurature}</p>
					<p className="location">{weatherData.location}</p>

					<div className="weather-data">
						<div className="col">
							<img src={humidity_icon} alt="humidity icon" />
							<div>
								<p>{weatherData.humidity}</p>
								<span>Humidity</span>
							</div>
						</div>
						<div className="col">
							<img src={wind_icon} alt="wind icon" />
							<div>
								<p>{weatherData.windSpeed}</p>
								<span>Wind Speed</span>
							</div>
						</div>
					</div>
				</> : <></>
			}
		</div>
	);
};

export default Weather;
