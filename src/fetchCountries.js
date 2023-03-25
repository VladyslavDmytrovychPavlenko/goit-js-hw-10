const BASE_URL = 'https://restcountries.com/v3.1/name';
// функція приймає один параметр - назву країни, і виконує запит до API restcountries.com, щоб отримати інформацію про країну з такою назвою.
const fetchCountries = async name => {
  const response = await fetch(
    `${BASE_URL}/${name}?fields=name,capital,population,flags,languages`
  );
  if (!response.ok) {
    throw new Error();
  }
  return response.json();
};

export { fetchCountries };
// Після складання URL запиту, функція виконує запит до API за допомогою методу fetch(), який повертає об'єкт response.
// Якщо статус відповіді response не є успішним (200), то викликається throw new Error(), що викличе помилку і зупинить виконання функції.
// Якщо ж статус відповіді успішний, то функція повертає результат в форматі JSON за допомогою методу response.json().
