const apis = {
	countries: 'https://restcountries.com/v3.1/all',
	hello: 'https://hellosalut.stefanbohacek.dev/?cc=',
};

let countries = [];
const countryEntries = document.querySelector('.option');
const dropDown = document.querySelector('.dropDown');

dropDown.addEventListener('click', () => {
	dropDown.classList.toggle('active');
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
		countryEntry.textContent = country.name.common.length > 18
			? `${country.name.common.slice(0, 18)} ...`
			: country.name.common;
		countryEntry.addEventListener('click', () => setDropDownInput(country.name.common));
		countryEntries.appendChild(countryEntry);
	});
};

const getCountrySalutation = async (text) => {
	const selectedCountry = countries.find(country => country.name.common === text);
	try {
		const res = await fetch(apis.hello + selectedCountry.cca2);
		const data = await res.json();
		displayCountryDetails(selectedCountry, data);
	} catch (error) {
		console.error('Error loading hello:', error);
	}
};

const displayCountryDetails = (selectedCountry, data) => {
	document.querySelector('.detail').style.visibility = 'visible';
	document.querySelector('.square').classList.remove('active');
	document.querySelector('.hello').innerHTML = data.hello ? data.hello : '-';
	document.querySelector('.continent').innerHTML = selectedCountry.continents[0];
	document.querySelector('.name').innerHTML = selectedCountry.name.common;
	document.querySelector('.capital').innerHTML = selectedCountry.capital[0];
	document.querySelector('.area').innerHTML = selectedCountry.area.toLocaleString();
	document.querySelector('.population').innerHTML = selectedCountry.population.toLocaleString();
	document.querySelector('.flag').src = selectedCountry.flags.png;
};

const setDropDownInput = (text) => {
	document.querySelector('.textBox').value = text;
	document.querySelector('.square').classList.add('active');
	getCountrySalutation(text);
};

window.addEventListener('load', loadCountries);
