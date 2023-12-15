// Variables
let countries = [];
let salutationWord = '';
const apis = {
	countries: 'https://restcountries.com/v3.1/all',
	hello: 'https://hellosalut.stefanbohacek.dev/?cc=',
	joke: 'https://api.chucknorris.io/jokes/search?query=',
};

// Function to load the Countries
const loadCountries = async () => {
	try {
		const res = await fetch(apis.countries);
		const data = await res.json();
		countries = data.sort((a, b) => a.name.common.localeCompare(b.name.common));
		populateCountryDropdown();
	} catch (error) {
		console.error('Error loading countries:', error);
	}
};

// Function to get country salutation and joke
const getCountrySalutationAndJoke = async (text) => {
	const selectedCountry = countries.find(country => country.name.common === text);
	try {
		const helloResponse = await fetch(apis.hello + selectedCountry.cca2);
		const helloData = await helloResponse.json();
		salutationWord = helloData.hello ? helloData.hello : '-';
		
		const jokeResponse = await fetch(apis.joke + ` ${selectedCountry.name.common}`);
		const jokeData = await jokeResponse.json();
		const randomIndex = Math.floor(Math.random() * jokeData.result.length);
		const joke = jokeData.result.length ? jokeData.result[randomIndex].value : '';
		
		displayCountryDetails(selectedCountry, joke);
	} catch (error) {
		console.error('Error loading country details:', error);
	}
};

// Function to toggle dropdown visibility
const toggleDropdown = () => {
	const dropDown = document.querySelector('.dropDown');
	dropDown.classList.toggle('active');
};

// Function to populate country dropdown
const populateCountryDropdown = () => {
	const countryEntries = document.querySelector('.option');
	countryEntries.innerHTML = '';
	countries.forEach(country => {
		countryEntries.appendChild(createCountryEntry(country.name.common));
	});
};

// Function to create individual country entry
const createCountryEntry = (countryName) => {
	const countryEntry = document.createElement('div');
	countryEntry.textContent = shorterText(countryName, 18);
	countryEntry.addEventListener('click', () => setDropDownInput(countryName));
	return countryEntry;
};

// Function to set dropdown input
const setDropDownInput = (text) => {
	const textBox = document.querySelector('.textBox');
	const square = document.querySelector('.square');
	textBox.value = shorterText(text, 18);
	square.classList.add('active');
	getCountrySalutationAndJoke(text).catch(error => console.error('Error getting country salutation:', error));
};

// Function to display country details
const displayCountryDetails = (selectedCountry, joke) => {
	setJoke(joke);
	document.querySelector('.hello').innerHTML = salutationWord;
	document.querySelector('.flag').src = selectedCountry.flags.png;
	document.querySelector('.capital').innerHTML = selectedCountry.capital[0];
	document.querySelector('.continent').innerHTML = selectedCountry.continents[0];
	document.querySelector('.area').innerHTML = selectedCountry.area.toLocaleString();
	document.querySelector('.population').innerHTML = selectedCountry.population.toLocaleString();
	document.querySelector('.name').innerHTML = shorterText(selectedCountry.name.common, 18);
	
	const detailElement = document.querySelector('.detail');
	const squareElement = document.querySelector('.square');
	detailElement.style.visibility = 'visible';
	squareElement.classList.remove('active');
};

// Function to set joke visibility and content
const setJoke = (joke) => {
	const jokeElement = document.querySelector('.joke');
	if (joke) {
		jokeElement.innerHTML = shorterText(joke, 230);
		jokeElement.style.visibility = 'visible';
	} else {
		jokeElement.innerHTML = '';
		jokeElement.style.visibility = 'hidden';
	}
};

// Utility functions (shorten text, text to speech)
const textToSpeech = () => {
	const whatToSay = salutationWord.includes('&') || salutationWord.includes('-') ? 'Blah Blah' : salutationWord;
	const speech = new SpeechSynthesisUtterance();
	speech.text = whatToSay;
	speechSynthesis.speak(speech);
};

const shorterText = (text, length) => {
	return text.length > length ? `${text.slice(0, length)} ...` : text;
};

// Event listeners
document.querySelector('.dropDown')?.addEventListener('click', toggleDropdown);
document.querySelector('.speaker')?.addEventListener('click', textToSpeech);
window.addEventListener('load', loadCountries);

// These lines are needed to enable bundling css file by webpack
if (typeof process !== 'undefined' && process.release.name === 'node') {
	require('../css/style.css');
}
