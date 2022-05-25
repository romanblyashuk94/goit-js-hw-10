export function fetchCountries(name) {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`,
  ).then(resp => (resp.ok ? resp.json() : Promise.reject(resp.status)));
}
