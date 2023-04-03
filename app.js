/* API KEY : _dRyG2MN1OKFUEXnduMCucDHGyxhxJmKp_Qt08Dtmx0*/
const errorMsg = document.querySelector("#errorMsg");
const resultsDisplay = document.querySelector(".gallery");

const randomPage = Math.trunc(Math.random() * 100)
const randomUrl = `https://api.unsplash.com/photos?random&page=${randomPage}&per_page=20&client_id=_dRyG2MN1OKFUEXnduMCucDHGyxhxJmKp_Qt08Dtmx0`;

randomAPICall();
async function randomAPICall() {
    try {
        const response = await fetch(randomUrl)
        if (!response.ok) {
            throw new Error(`${response.status}`);
        }

        const data = await response.json();

        data.forEach(el => {
            const elem = document.createElement("img");
            elem.setAttribute("src", el.urls.small);
            resultsDisplay.appendChild(elem);
        });

    } catch (error) {
        errorMsg.textContent = `${error}`
    }
}

// SEARCH IMG
const searchInput = document.querySelector("input");
const form = document.querySelector("form");
const footer = document.querySelector("footer");

form.addEventListener("submit", handleSubmit)

let result = [];
async function handleSubmit(e) {
    e.preventDefault();

    if (searchInput.value === "") {
        errorMsg.textContent = "Veuillez remplir un terme valide";
        return;
    } else {
        result = [];
        footer.style.display = "none";
        errorMsg.textContent = "";
        resultsDisplay.textContent = "";
        searchAPICall(searchInput.value);
        result.push(searchInput.value);
    }
}

let page = 1;

async function searchAPICall(searchInput) {
    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?per_page=20&query=${searchInput}&client_id=_dRyG2MN1OKFUEXnduMCucDHGyxhxJmKp_Qt08Dtmx0`);

        if (!response.ok) {
            throw new Error(`${response.status}`)
        }

        const data = await response.json();

        displaySearchResult(data.results);
        
        page++;

    } catch (error) {
        errorMsg.textContent = `${error}`;
    }
}

function displaySearchResult(data) {
    if (!data.length) {
        errorMsg.textContent = "Désolé, je n'ai trouvé aucun résultat... Soyez plus précis dans votre recherche.";
        return;
    }

    footer.style.display = "block";
    data.forEach(el => {
        const elem = document.createElement("img");
        elem.setAttribute("src", el.urls.small);
        resultsDisplay.appendChild(elem);
    });

}

//INTERSECTION OBSERVER TO SET INFINITE SCROLL
const options = {
    root: null,
    threshold: 0
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            infiniteAPICall();
        }
    })
}, options)

observer.observe(footer);

async function infiniteAPICall() {
    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?page=${page}&per_page=20&query=${result[0]}&client_id=_dRyG2MN1OKFUEXnduMCucDHGyxhxJmKp_Qt08Dtmx0`);

        if (!response.ok) {
            throw new Error(`${response.status}`)
        }

        const data = await response.json();

        displaySearchResult(data.results);

        if (page > data.total_pages) {
            errorMsg.textContent = "Il n'y a plus de contenu à afficher";
            return;
        }

        page++;

    } catch (error) {
        errorMsg.textContent = `${error}`;
    }
}

//SCROLL TOP
const btn = document.querySelector(".go-up");
btn.addEventListener("click", scrollTop);

function scrollTop() {
    document.documentElement.scrollTop = 0;
}