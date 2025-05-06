document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('userForm');
    const photosInput = document.getElementById('photos');
    const imagePreview = document.getElementById('imagePreview');
    let userLocation = null;
    const capturedImages = new Set();

    // Fonction pour obtenir la localisation
    function getLocation() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    userLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                },
                (error) => {
                    console.error("Erreur de géolocalisation:", error);
                }
            );
        }
    }

    // Obtenir la localisation dès le chargement de la page
    getLocation();

    // Fonction pour ajouter une image à la prévisualisation
    function addImageToPreview(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgContainer = document.createElement('div');
            imgContainer.className = 'image-container';

            const img = document.createElement('img');
            img.src = e.target.result;

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-image';
            deleteBtn.innerHTML = '×';
            deleteBtn.onclick = function() {
                imgContainer.remove();
                capturedImages.delete(file);
            };

            imgContainer.appendChild(img);
            imgContainer.appendChild(deleteBtn);
            imagePreview.appendChild(imgContainer);
            capturedImages.add(file);
        };
        reader.readAsDataURL(file);
    }

    // Gestion de la sélection de fichiers
    photosInput.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                addImageToPreview(file);
            }
        });
    });

    // Gestion de la capture de photo
    const takePhotoButton = document.getElementById('takePhoto');
    takePhotoButton.addEventListener('click', async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment'
                }
            });

            // Créer et configurer l'élément vidéo
            const videoElement = document.createElement('video');
            videoElement.srcObject = stream;
            videoElement.style.display = 'none';
            document.body.appendChild(videoElement);

            // Attendre que la vidéo soit chargée
            await videoElement.play();

            // Créer un canvas pour la capture
            const canvas = document.createElement('canvas');
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;

            // Capturer l'image
            const context = canvas.getContext('2d');
            context.drawImage(videoElement, 0, 0);

            // Convertir en fichier
            canvas.toBlob((blob) => {
                const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
                addImageToPreview(file);

                // Nettoyer
                stream.getTracks().forEach(track => track.stop());
                videoElement.remove();
            }, 'image/jpeg');

        } catch (err) {
            console.error("Erreur lors de la capture de photo:", err);
            alert("Impossible d'accéder à la caméra. Veuillez vérifier vos permissions.");
        }
    });

    // Gestion du formulaire
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Vérifier si la localisation est disponible
        if (!userLocation) {
            alert("La localisation n'a pas pu être récupérée. Veuillez autoriser l'accès à votre position et réessayer.");
            getLocation();
            return;
        }

        const formData = {
            nom: document.getElementById('nom').value,
            prenom: document.getElementById('prenom').value,
            email: document.getElementById('email').value,
            typeProbleme: document.getElementById('typeProbleme').value,
            description: document.getElementById('description').value || "Aucune description fournie",
            location: `${userLocation.latitude}, ${userLocation.longitude}`,
            date: new Date().toLocaleString()
        };

        // Créer le contenu du fichier
        const content = `Date: ${formData.date}
Nom: ${formData.nom}
Prénom: ${formData.prenom}
Email: ${formData.email}
Type de problème: ${formData.typeProbleme}
Description: ${formData.description}
Localisation: ${formData.location}`;

        // Créer et télécharger le fichier
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `signalement_${formData.nom}_${formData.prenom}_${new Date().getTime()}.txt`;
        a.click();
        window.URL.revokeObjectURL(url);

        // Réinitialiser le formulaire
        form.reset();
        imagePreview.innerHTML = "";
        capturedImages.clear();
    });
});