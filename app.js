/* API KEY : _dRyG2MN1OKFUEXnduMCucDHGyxhxJmKp_Qt08Dtmx0*/
const errorMsg = document.querySelector("#errorMsg");
const resultsDisplay = document.querySelector(".gallery");
let searchUrl = "random";
let page = 1;

initAPICall();
async function initAPICall() {
    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?page=${page}&per_page=20&query=${searchUrl}&client_id=_dRyG2MN1OKFUEXnduMCucDHGyxhxJmKp_Qt08Dtmx0`)

        if (!response.ok) {
            throw new Error(`${response.status}`);
        }

        const data = await response.json();

        console.log(data)

        if (!data.total) {
            resultsDisplay.textContent = "";
            throw new Error("Désolé, je n'ai trouvé aucun résultat... Soyez plus précis dans votre recherche.") ;
        }

        createImages(data.results)
        
    } catch (error) {
        errorMsg.textContent = `${error}`
    }
}

function createImages(data) {
    data.forEach(el => {
        const elem = document.createElement("img");
        elem.setAttribute("src", el.urls.regular);
        resultsDisplay.appendChild(elem);
    });
}

//INTERSECTION OBSERVER TO SET INFINITE SCROLL
const footer = document.querySelector("footer");
const options = {
    root: null,
    threshold: 0
};

const observer = new IntersectionObserver(function (entries) {
        if (window.scrollY > window.innerHeight && entries[0].isIntersecting) {
            page++;
            initAPICall();
        }
}, options)

observer.observe(footer);

// SEARCH IMG
const searchInput = document.querySelector("#search");
const form = document.querySelector("form");

form.addEventListener("submit", handleSearch)

async function handleSearch(e) {
    e.preventDefault();

    resultsDisplay.textContent = "";
    if (searchInput.value === "") {
        errorMsg.textContent = "Veuillez remplir un terme valide";
        return;
    }

    errorMsg.textContent = "";
    resultsDisplay.textContent = "";
    searchUrl = searchInput.value;
    page = 1;
    initAPICall();
}

//SCROLL TOP
const btn = document.querySelector(".go-up");
btn.addEventListener("click", scrollTop);

function scrollTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
      })
}