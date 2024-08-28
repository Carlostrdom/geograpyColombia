
// Obtiene el ID del departamento desde los parámetros de la URL
let departmentId = getDepartmentIdFromUrl();
function getDepartmentIdFromUrl() {
    let url = window.location.href
    let objUrl = new URL(url)
    let params = objUrl.searchParams;

    return params.get('id')

}


// Obtiene los elementos del DOM que se usarán
let departmentDetailsContainer = document.getElementById('department-details');
let cardsContainer = document.getElementById('cards-container');
let searchInput = document.getElementById('search-input');
let cityCheckbox = document.getElementById('city-checkbox');
let naturalAreaCheckbox = document.getElementById('natural-area-checkbox');

// Obtiene los detalles del departamento y los muestra en el contenedor
fetch(`https://api-colombia.com/api/v1/Department/${departmentId}`)
    .then(response => response.json())
    .then(data => {
        displayDepartmentDetails(data, departmentDetailsContainer);
    });

// Carga y muestra las tarjetas (ciudades o áreas naturales) inicialmente
loadCards(departmentId, cardsContainer);

// Evento para buscar al escribir en el campo de búsqueda
searchInput.addEventListener('input', () => {
    let query = searchInput.value.toLowerCase();
    loadCards(departmentId, cardsContainer, query);
});

// Eventos para actualizar las tarjetas cuando cambian los checkboxes
cityCheckbox.addEventListener('change', () => loadCards(departmentId, cardsContainer, searchInput.value.toLowerCase()));
naturalAreaCheckbox.addEventListener('change', () => loadCards(departmentId, cardsContainer, searchInput.value.toLowerCase()));

// Muestra los detalles del departamento en el contenedor especificado
function displayDepartmentDetails(department, container) {
    container.innerHTML = `
          <h1>${department.name}</h1>
          <p>${department.description}</p>
      `;
}

// Carga y muestra las tarjetas de ciudades o áreas naturales
function loadCards(departmentId, container, query = '') {
    container.innerHTML = '';
    let showCities = cityCheckbox.checked;
    let showNaturalAreas = naturalAreaCheckbox.checked;

    // Carga ciudades si el checkbox está marcado
    if (showCities) {
        fetch(`https://api-colombia.com/api/v1/Department/${departmentId}/cities`)
            .then(response => response.json())
            .then(cities => {
                displayCards(cities, container, query);
            })
            .catch(error => console.error('Error fetching cities:', error));
    }

    // Carga áreas naturales si el checkbox está marcado
    if (showNaturalAreas) {
        fetch(`https://api-colombia.com/api/v1/Department/${departmentId}/NaturalAreas`)
            .then(response => response.json())
            .then(areas => {
                displayCards(areas[0].naturalAreas, container, query);
            })
            .catch(error => console.error('Error fetching natural areas:', error));
    }
}

// Muestra las tarjetas en el contenedor basado en los ítems y la consulta de búsqueda
function displayCards(items, container, query) {
    let msgA = false;
    items.forEach(item => {
        // Filtra los ítems según la consulta de búsqueda
        if (item.name.toLowerCase().includes(query)) {
            msgA = true;
            let card = document.createElement('div');
            card.innerHTML = `
                  <div class="card">
                      <img src="./assets/recursos-img/colombia.jpg" class="card-img-top" alt="" style="object-fit: cover;"/>
                      <div class="card-body">
                          <h5 class="card-title">${item.name}</h5>
                          ${item.landArea ? `<p>Área: ${item.landArea} km²</p>` : ''}
                           ${item.surface ? `<p>Área: ${item.surface} km²</p>` : ''}
                          ${item.population ? `<p>Población: ${item.population}</p>` : ''}                           
                          ${item.description ? `<p class="card-text">${item.description}</p>` : ''}
                      </div>
                  </div>
              `;
            container.appendChild(card);
        }
    });
    if (!msgA) { container.innerHTML = '<p class= "text-center text-white col-4 bg-dark bg-opacity-75 rounded-3 mb-4">No se encontraron resultados</p>' }
}
