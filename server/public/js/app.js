// Variables
let countries = [];
let salutationWord = '';
const apis = {
	country: 'https://restcountries.com/v3.1/all',
	hello: 'https://hellosalut.stefanbohacek.dev/?cc=',
	joke: 'https://api.chucknorris.io/jokes/search?query=',
};
const square = document.querySelector('.square');
const textBox = document.querySelector('.textBox');
const squareContainer = document.querySelector('.square-container');


// Function to load the Countries
const loadCountries = async () => {
	try {
		const res = await fetch(apis.country);
		const data = await res.json();
		countries = data.sort((a, b) => a.name.common.localeCompare(b.name.common));
		populateCountryDropdown();
	} catch (error) {
		console.error('Error loading countries:', error);
	}
};

// Function to get country salutation
const getCountrySalutation = async (text) => {
	const selectedCountry = countries.find(country => country.name.common === text);
	try {
		const helloResponse = await fetch(apis.hello + selectedCountry.cca2);
		const helloData = await helloResponse.json();
		salutationWord = helloData.hello ? helloData.hello : '-';
		
		displayCountryDetails(selectedCountry);
	} catch (error) {
		console.error('Error loading country details:', error);
	}
};

// Function to get joke
const getJoke = async (text) => {
	try {
		const jokeResponse = await fetch(apis.joke + ` ${text}`);
		const jokeData = await jokeResponse.json();
		const randomIndex = Math.floor(Math.random() * jokeData.result.length);
		const joke = jokeData.result.length ? jokeData.result[randomIndex].value : '';
		
		displayJoke(joke);
	} catch (error) {
		console.error('Error loading joke:', error);
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
	square.classList.add('active');
	textBox.value = shorterText(text, 18);
	squareContainer.style.visibility = 'visible';
	
	getCountrySalutation(text).catch(error => console.error('Error getting country salutation:', error));
	getJoke(text).catch(error => console.error('Error getting joke:', error));
};

// Function to display country details
const displayCountryDetails = (selectedCountry) => {
	document.querySelector('.hello').innerHTML = salutationWord;
	document.querySelector('.flag').src = selectedCountry.flags.png;
	document.querySelector('.capital').innerHTML = selectedCountry.capital[0];
	document.querySelector('.continent').innerHTML = selectedCountry.continents[0];
	document.querySelector('.area').innerHTML = selectedCountry.area.toLocaleString();
	document.querySelector('.population').innerHTML = selectedCountry.population.toLocaleString();
	document.querySelector('.name').innerHTML = shorterText(selectedCountry.name.common, 18);
	
	const detailElement = document.querySelector('.detail');
	detailElement.style.visibility = 'visible';
	squareContainer.style.visibility = 'hidden';
	square.classList.remove('active');
};

// Function to display joke
const displayJoke = (joke) => {
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
