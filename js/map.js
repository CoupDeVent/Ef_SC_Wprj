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

// Ajout de logs pour déboguer
console.log('Chargement des signalements...');

// Vérification de la nomenclature des fichiers
fetch('../../signalement_exemple/signalement')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur lors du chargement des fichiers : ${response.statusText}`);
        }
        return response.text();
    })
    .then(data => {
        console.log('Fichiers trouvés :', data);
        const files = data.split('\n').filter(file => file.trim() !== '' && /^signalement_\d+\.txt$/.test(file.trim()));

        if (files.length === 0) {
            console.error('Aucun fichier de signalement valide trouvé.');
            return;
        }

        files.forEach(file => {
            console.log(`Chargement du fichier : ${file}`);
            fetch(`../../signalement_exemple/signalement/${file}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Erreur lors du chargement du fichier ${file} : ${response.statusText}`);
                    }
                    return response.text();
                })
                .then(content => {
                    console.log(`Contenu du fichier ${file} :`, content);
                    const lines = content.split('\n');
                    const localisationLine = lines.find(line => line.startsWith('Localisation:'));
                    const statusLine = lines.find(line => line.startsWith('Statut:'));

                    if (!localisationLine || !statusLine) {
                        console.error(`Données manquantes dans le fichier ${file}`);
                        return;
                    }

                    const localisation = localisationLine.split(': ')[1];
                    const [lat, lng] = localisation.split(' - ')[0].split(', ').map(Number);
                    const status = statusLine.split(': ')[1];

                    console.log(`Ajout d'un marqueur pour ${file} à la position [${lat}, ${lng}] avec le statut ${status}`);

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
                .catch(error => console.error(`Erreur lors du traitement du fichier ${file} :`, error));
        });
    })
    .catch(error => console.error('Erreur lors du chargement des signalements :', error));