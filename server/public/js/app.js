if (typeof process !== 'undefined' && process.release.name === 'node') {
	require('../css/style.css');
}

const apis = {
	countries: 'https://restcountries.com/v3.1/all',
	hello: 'https://hellosalut.stefanbohacek.dev/?cc=',
};

let countries = [];
let salutationWord = '';
const dropDown = document.querySelector('.dropDown');
const speakButton = document.querySelector('.speaker');
const countryEntries = document.querySelector('.option');

dropDown.addEventListener('click', () => {
	dropDown.classList.toggle('active');
});

speakButton.addEventListener('click', () => {
	const whatToSay = salutationWord.includes('&') || salutationWord.includes('-') ? 'Blah Blah' : salutationWord;
	textToSpeech(whatToSay);
});

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

const populateCountryDropdown = () => {
	countryEntries.innerHTML = '';
	countries.forEach(country => {
		const countryEntry = document.createElement('div');
		countryEntry.textContent = shorterText(country.name.common);
		countryEntry.addEventListener('click', () => setDropDownInput(country.name.common));
		countryEntries.appendChild(countryEntry);
	});
};

const getCountrySalutation = async (text) => {
	const selectedCountry = countries.find(country => country.name.common === text);
	try {
		const res = await fetch(apis.hello + selectedCountry.cca2);
		const data = await res.json();
		salutationWord = data.hello ? data.hello : '-';
		displayCountryDetails(selectedCountry);
	} catch (error) {
		console.error('Error loading hello:', error);
	}
};

const displayCountryDetails = (selectedCountry) => {
	document.querySelector('.hello').innerHTML = salutationWord;
	document.querySelector('.flag').src = selectedCountry.flags.png;
	document.querySelector('.capital').innerHTML = selectedCountry.capital[0];
	document.querySelector('.continent').innerHTML = selectedCountry.continents[0];
	document.querySelector('.area').innerHTML = selectedCountry.area.toLocaleString();
	document.querySelector('.population').innerHTML = selectedCountry.population.toLocaleString();
	document.querySelector('.name').innerHTML = shorterText(selectedCountry.name.common);
	
	document.querySelector('.detail').style.visibility = 'visible';
	document.querySelector('.square').classList.remove('active');
};

const setDropDownInput = (text) => {
	document.querySelector('.textBox').value = shorterText(text);
	document.querySelector('.square').classList.add('active');
	getCountrySalutation(text).catch();
};

const textToSpeech = (text) => {
	const speech = new SpeechSynthesisUtterance();
	speech.text = text;
	speechSynthesis.speak(speech);
};

const shorterText = (text) => {
	return text.length > 18 ? `${text.slice(0, 18)} ...` : text;
};

window.addEventListener('load', loadCountries);
