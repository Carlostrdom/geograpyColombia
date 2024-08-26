document.addEventListener('DOMContentLoaded', function () {
    let departmentId = getDepartmentIdFromUrl(); // Asume que obtienes el ID del departamento desde la URL
    let departmentDetailsContainer = document.getElementById('department-details');
    let cardsContainer = document.getElementById('cards-container');
    let searchInput = document.getElementById('search-input');
    let cityCheckbox = document.getElementById('city-checkbox');
    let naturalAreaCheckbox = document.getElementById('natural-area-checkbox');

    // Cargar los detalles del departamento
    fetch(`https://api-colombia.com/api/v1/Department/${departmentId}`)
        .then(response => response.json())
        .then(data => {
            displayDepartmentDetails(data, departmentDetailsContainer);
        });

    // Cargar ciudades y áreas naturales
    loadCards(departmentId, cardsContainer);

    // Evento de búsqueda en tiempo real
    searchInput.addEventListener('input', () => {
        let query = searchInput.value.toLowerCase();
        loadCards(departmentId, cardsContainer, query);
    });

    // Evento de búsqueda al presionar Enter
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Evita el comportamiento predeterminado de submit
            let query = searchInput.value.toLowerCase();
            loadCards(departmentId, cardsContainer, query);
        }
    });

    // Eventos de los checkboxes
    cityCheckbox.addEventListener('change', () => loadCards(departmentId, cardsContainer, searchInput.value.toLowerCase()));
    naturalAreaCheckbox.addEventListener('change', () => loadCards(departmentId, cardsContainer, searchInput.value.toLowerCase()));

    function displayDepartmentDetails(department, container) {
        container.innerHTML = `
            <h1>${department.name}</h1>
            <p>${department.description}</p>
            <!-- Añadir más información según sea necesario -->
        `;
    }

    function loadCards(departmentId, container, query = '') {
        container.innerHTML = ''; // Limpiar las tarjetas actuales
        let showCities = cityCheckbox.checked;
        let showNaturalAreas = naturalAreaCheckbox.checked;

        if (showCities) {
            fetch(`https://api-colombia.com/api/v1/Department/${departmentId}/cities`)
                .then(response => response.json())
                .then(cities => {
                    displayCards(cities, container, query);
                })
                .catch(error => console.error('Error fetching cities:', error));
        }

        if (showNaturalAreas) {
            fetch(`https://api-colombia.com/api/v1/Department/${departmentId}/NaturalAreas`)
                .then(response => response.json())
                .then(areas => {
                    displayCards(areas[0].naturalAreas, container, query);
                })
                .catch(error => console.error('Error fetching natural areas:', error));
        }
    }

    function displayCards(items, container, query) {
        items.forEach(item => {
            if (item.name.toLowerCase().includes(query)) {
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
    }

    function getDepartmentIdFromUrl() {
        let urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }
});
