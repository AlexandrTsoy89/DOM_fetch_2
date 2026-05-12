const input = document.querySelector(".search-input");
const autocomplete = document.querySelector(".autocomplete");
const reposList = document.querySelector(".repos-list");

// debounce
function debounce(fn, delay) {
  let timeout;

  return function (...args) {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// запрос к github
async function fetchRepos(query) {
  const response = await fetch(
    `https://api.github.com/search/repositories?q=${query}&per_page=5`,
  );

  const data = await response.json();

  return data.items;
}

// отображение подсказок
async function showAutocomplete() {
  const value = input.value.trim();

  autocomplete.innerHTML = "";

  if (!value) {
    return;
  }

  const repos = await fetchRepos(value);

  repos.forEach((repo) => {
    const li = document.createElement("li");

    li.textContent = repo.name;

    li.addEventListener("click", () => {
      addRepository(repo);

      input.value = "";
      autocomplete.innerHTML = "";
    });

    autocomplete.appendChild(li);
  });
}

// создание карточки
function addRepository(repo) {
  const card = document.createElement("div");
  card.classList.add("repo-card");

  const info = document.createElement("div");
  info.classList.add("repo-info");

  info.innerHTML = `
    <p>Name: ${repo.name}</p>
    <p>Owner: ${repo.owner.login}</p>
    <p>Stars: ${repo.stargazers_count}</p>
  `;

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("remove-btn");
  removeBtn.textContent = "✕";

  removeBtn.addEventListener("click", () => {
    card.remove();
  });

  card.appendChild(info);
  card.appendChild(removeBtn);

  reposList.appendChild(card);
}

const debouncedSearch = debounce(showAutocomplete, 500);

input.addEventListener("input", debouncedSearch);
