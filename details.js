

let departmentId = getDepartmentIdFromUrl();
function getDepartmentIdFromUrl() {
    let url = window.location.href;
    let objUrl = new URL(url);
    let params = objUrl.searchParams;

    return params.get('id');
}

let departmentDetailsContainer = document.getElementById('department-details');
let cardsContainer = document.getElementById('cards-container');
let searchInput = document.getElementById('search-input');
let cityCheckbox = document.getElementById('city-checkbox');
let naturalAreaCheckbox = document.getElementById('natural-area-checkbox');

fetch(`https://api-colombia.com/api/v1/Department/${departmentId}`)
    .then(response => response.json())
    .then(data => {
        displayDepartmentDetails(data, departmentDetailsContainer);
    });

function displayDepartmentDetails(department, container) {
    container.innerHTML = `
        <h1>${department.name}</h1>
        <p>${department.description}</p>
    `;
}

let citiesData = [];
let naturalAreasData = [];

fetch(`https://api-colombia.com/api/v1/Department/${departmentId}/cities`)
    .then(response => response.json())
    .then(cities => {
        citiesData = cities;
        showAllCards();
    })
    .catch(error => console.error('Error fetching cities:', error));

fetch(`https://api-colombia.com/api/v1/Department/${departmentId}/NaturalAreas`)
    .then(response => response.json())
    .then(areas => {
        naturalAreasData = areas[0].naturalAreas;
        showAllCards();
    })
    .catch(error => console.error('Error fetching natural areas:', error));

function showAllCards() {
    if (citiesData.length > 0 && naturalAreasData.length > 0) {
        let allData = citiesData.concat(naturalAreasData);
        displayCards(allData, cardsContainer);
    }
}

function filterAndDisplayCards() {
    let query = searchInput.value.toLowerCase();
    let showCities = cityCheckbox.checked;
    let showNaturalAreas = naturalAreaCheckbox.checked;

    let filteredData = [];

    if (showCities) {
        filteredData = filteredData.concat(citiesData.filter(city => city.name.toLowerCase().includes(query)));
    }

    if (showNaturalAreas) {
        filteredData = filteredData.concat(naturalAreasData.filter(area => area.name.toLowerCase().includes(query)));
    }

    if (!showCities && !showNaturalAreas) {
        filteredData = citiesData.concat(naturalAreasData).filter(item => item.name.toLowerCase().includes(query));
    }

    displayCards(filteredData, cardsContainer);
}

searchInput.addEventListener('input', filterAndDisplayCards);

cityCheckbox.addEventListener('change', filterAndDisplayCards);
naturalAreaCheckbox.addEventListener('change', filterAndDisplayCards);

function displayCards(infodata, container) {
    container.innerHTML = '';
    let msgA = false;
    infodata.forEach(item => {
        msgA = true;
        let card = document.createElement('div');
        card.innerHTML = `
            <div class="card my-card">
                <img src="./assets/recursos-img/colombia.jpg" class="card-img-top" alt="" style="object-fit: cover;"/>
                <div class="card-body bg-primary-subtle">
                    <h5 class="card-title">${item.name}</h5>
                    ${item.landArea ? `<p>Área: ${item.landArea} km²</p>` : ''}
                    ${item.surface ? `<p>Área: ${item.surface} km²</p>` : 'Area: sin informacion'}
                    ${item.population ? `<p>Población: ${item.population}</p>` : 'Población: sin informacion'}                           
                </div>
            </div>
        `;
        container.appendChild(card);
    });
    if (!msgA) {
        container.innerHTML = '<p class="text-center text-white col-4 bg-dark bg-opacity-75 rounded-3 mb-4">No se encontraron resultados</p>';
    }
}
