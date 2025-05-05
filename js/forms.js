document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('userForm');
    const locationInput = document.getElementById('location');
    const locationButton = document.getElementById('getLocation');
    const locationStatus = document.getElementById('locationStatus');

    // Fonction pour obtenir la localisation
    function getLocation() {
        locationStatus.textContent = "Demande de localisation en cours...";

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    locationInput.value = `${latitude}, ${longitude}`;
                    locationStatus.textContent = "Localisation obtenue avec succès !";
                    locationStatus.style.color = "green";
                },
                (error) => {
                    locationInput.value = "";
                    locationStatus.textContent = "Erreur: Localisation non disponible";
                    locationStatus.style.color = "red";
                    console.error("Erreur de géolocalisation:", error);
                }
            );
        } else {
            locationStatus.textContent = "Géolocalisation non supportée par votre navigateur";
            locationStatus.style.color = "red";
        }
    }

    // Écouteur d'événement pour le bouton de localisation
    locationButton.addEventListener('click', getLocation);

    // Gestion du formulaire
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            nom: document.getElementById('nom').value,
            prenom: document.getElementById('prenom').value,
            location: locationInput.value || "Non renseignée",
            date: new Date().toLocaleString()
        };

        // Créer le contenu du fichier
        const content = `
Date: ${formData.date}
Nom: ${formData.nom}
Prénom: ${formData.prenom}
Localisation: ${formData.location}`
        ;

        // Créer et télécharger le fichier
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `données_${formData.nom}_${formData.prenom}_${new Date().getTime()}.txt`;
        a.click();
        window.URL.revokeObjectURL(url);

        // Réinitialiser le formulaire
        form.reset();
        locationInput.value = "";
        locationStatus.textContent = "";
    });
});

