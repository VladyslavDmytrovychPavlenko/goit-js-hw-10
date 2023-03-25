import './css/styles.css';
// імпортується функція debounce, яка дозволяє затримати виконання функції на певний період часу, щоб запобігти зайвому навантаженню на сервер при пошуку.
import debounce from 'lodash.debounce';
// імпортується компонент Notify з бібліотеки Notiflix, який дозволяє відображати повідомлення для користувача.
import { Notify } from 'notiflix/build/notiflix-notify-aio';
// імпортується функція fetchCountries з модуля fetchCountries.js, яка відповідає за виконання запитів на сервер для пошуку країн за назвою.
import { fetchCountries } from './fetchCountries';
// Задається константа DEBOUNCE_DELAY зі значенням 300 мс для затримки виконання функції onSearch при введенні користувачем запиту.
const DEBOUNCE_DELAY = 300;
// Отримуємо доступ до елементів сторінки, до яких буде прив'язуватися функціональність, та надаємо обробник події для пошукової форми.
const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));
// Функція onSearch отримує дані з поля вводу, виконує запит на пошук країни за введеним користувачем запитом
// і відображає результат відповідно до кількості знайдених країн: якщо знайдено більше 10, повідомляє про надто загальний запит, якщо знайдено лише 1 країну, відображає детальну інформацію про неї, в іншому випадку відображає список знайдених країн.
function onSearch(evt) {
  const name = evt.target.value.trim();
  if (!name) return clear();

  fetchCountries(name)
    .then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name'
        );
        return;
      }
      if (data.length === 1) {
        renderInfo(data[0]);
      } else {
        renderList(data);
      }
    })
    .catch(() => {
      clear();
      Notify.failure('Oops, there is no country with that name');
    });
}
// Функція clear очищає список країн countryList та інформацію про країну countryInfo, викликаючи функцію clearList з цими елементами відповідно.
function clear() {
  clearList(countryList);
  clearList(countryInfo);
}
// Функція clearList очищає вміст переданого елемента, встановлюючи innerHTML у порожній рядок.
function clearList(el) {
  el.innerHTML = '';
}
// Функція renderList відображає список країн, переданий як аргумент data, в елементі countryList.
// Для кожної країни створюється елемент списку <li>, який містить прапор країни та її назву.
// Після цього всі елементи з'єднуються в один рядок за допомогою методу join('') та встановлюються як innerHTML елемента countryList.
function renderList(data) {
  countryList.innerHTML = data
    .map(
      ({ name, flags }) =>
        `<li class="item"><img src="${flags.svg}" alt="${name.official}" width="40" height="40">${name.official}</li>`
    )
    .join('');
  clearList(countryInfo);
}
// Функція renderInfo відображає детальну інформацію про країну, передану як аргумент data, в елементі countryInfo.
// Створюються елементи заголовку та абзаців, які містять інформацію про країну, таку як назва, столиця, населення та мови.
// Зображення прапора країни додається до заголовку. В результаті всі елементи встановлюються як innerHTML елемента countryInfo.
function renderInfo({ name, capital, population, flags, languages }) {
  countryInfo.innerHTML = `
    <h1><img src="${flags.svg}" alt="${name.official}" width="40" height="40">${
    name.official
  }</h1>
    <p>Capital: ${capital}</p>
    <p>Population: ${population}</p>
    <p>Languages: ${Object.values(languages)}</p>
  `;
  clearList(countryList);
}
