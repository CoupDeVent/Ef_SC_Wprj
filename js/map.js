// Initialisation de la carte centrée sur Villejuif
const map = L.map('map').setView([48.793, 2.362], 14);

// Ajout des tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Fonction pour déterminer la couleur du marqueur en fonction du statut
function getMarkerColor(status) {
    switch (status) {
        case 'T':
            return 'green';
        case 'ECT':
            return 'orange';
        case 'NT':
            return 'red';
        default:
            return 'blue';
    }
}

// Génération de la liste des fichiers de signalement
const signalementFiles = Array.from({ length: 30 }, (_, i) => `signalement_${i + 1}.txt`);

// Chargement des signalements
signalementFiles.forEach(file => {
    fetch(`../../signalement_exemple/signalement/${file}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur lors du chargement du fichier : ${file}`);
            }
            return response.text();
        })
        .then(content => {
            const lines = content.split('\n');
            const localisation = lines.find(line => line.startsWith('Localisation:')).split(': ')[1];
            const [lat, lng] = localisation.split(' - ')[0].split(', ').map(Number);
            const status = lines.find(line => line.startsWith('Statut:')).split(': ')[1];

            const marker = L.marker([lat, lng], {
                icon: L.divIcon({
                    className: 'custom-icon',
                    html: `<div style="background-color: ${getMarkerColor(status)}; width: 12px; height: 12px; border-radius: 50%;"></div>`
                })
            }).addTo(map);

            marker.on('click', () => {
                const infoDiv = document.getElementById('signalement-info');
                infoDiv.innerHTML = `<h3>Informations du signalement</h3>`;
                lines.forEach(line => {
                    if (line.trim() !== '') {
                        infoDiv.innerHTML += `<p>${line}</p>`;
                    }
                });
            });
        })
        .catch(error => console.error(error.message));
});