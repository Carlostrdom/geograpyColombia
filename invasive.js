
let apiURL = "https://api-colombia.com/api/v1/InvasiveSpecie";

fetch(apiURL)
    .then(response => response.json())
    .then(data => {
        let tbody = document.getElementById("especies-tbody");

        for (let i = 0; i < data.length; i++) {
            let especie = data[i];
            let tabla = document.createElement("tr");
            tabla.innerHTML = `
              
                <td class="text-center border border-dark justify-content-center" >${especie.name}</td>
                <td class="text-center border  border-dark justify-content-center">${especie.scientificName}</td>
                <td class="text-center border border-dark justify-content-center">${especie.impact}</td>                
                <td class="text-center border border-dark justify-content-center">${especie.manage}</td>
                <td class="text-center border border-dark justify-content-center">${especie.riskLevel}</td>
                <td class="text-center border border-dark justify-content-center"><img src="${especie.urlImage}" alt="${especie.name}"  style="width: 80px; height: auto;"></td>
                 
                `;

            if (especie.riskLevel === 1) {
                tabla.classList.add("risk-level-1");
            } else if (especie.riskLevel === 2) {
                tabla.classList.add("risk-level-2");
            }

            tbody.appendChild(tabla);
        }
    })
    .catch(error => console.error("Error al obtener los datos de la API:", error));

