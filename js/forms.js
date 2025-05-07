document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('userForm');
    const photosInput = document.getElementById('photos');
    const imagePreview = document.getElementById('imagePreview');
    const cameraModal = document.getElementById('cameraModal');
    const cameraElement = document.getElementById('camera');
    const captureButton = document.getElementById('captureButton');
    const closeCameraButton = document.getElementById('closeCameraButton');
    let userLocation = null;
    const capturedImages = new Set();
    let stream = null;

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

    getLocation();

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

    function closeCamera() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        cameraModal.style.display = 'none';
        cameraElement.srcObject = null;
    }

    photosInput.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                addImageToPreview(file);
            }
        });
    });

    const takePhotoButton = document.getElementById('takePhoto');
    takePhotoButton.addEventListener('click', async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment'
                }
            });

            cameraElement.srcObject = stream;
            cameraModal.style.display = 'block';
        } catch (err) {
            console.error("Erreur lors de l'accès à la caméra:", err);
            alert("Impossible d'accéder à la caméra. Veuillez vérifier vos permissions.");
        }
    });

    captureButton.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        canvas.width = cameraElement.videoWidth;
        canvas.height = cameraElement.videoHeight;

        const context = canvas.getContext('2d');
        context.drawImage(cameraElement, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
            addImageToPreview(file);
            closeCamera();
        }, 'image/jpeg');
    });

    closeCameraButton.addEventListener('click', closeCamera);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!userLocation) {
            alert("La localisation n'a pas pu être récupérée. Veuillez autoriser l'accès à votre position et réessayer.");
            getLocation();
            return;
        }

        const timestamp = new Date().getTime();
        const formData = {
            nom: document.getElementById('nom').value,
            prenom: document.getElementById('prenom').value,
            email: document.getElementById('email').value,
            typeProbleme: document.getElementById('typeProbleme').value,
            description: document.getElementById('description').value || "Aucune description fournie",
            location: `${userLocation.latitude}, ${userLocation.longitude}`,
            date: new Date().toLocaleString()
        };

        // Créer un dossier principal pour le signalement
        const folderName = `signalement_${formData.nom}_${formData.prenom}_${timestamp}`;

        // Créer un objet pour stocker tout le contenu
        const zipContent = new JSZip();

        // Créer le dossier images dans le zip
        const imagesFolder = zipContent.folder("images");

        // Ajouter le fichier texte
        const content = `Date: ${formData.date}
Nom: ${formData.nom}
Prénom: ${formData.prenom}
Email: ${formData.email}
Type de problème: ${formData.typeProbleme}
Description: ${formData.description}
Localisation: ${formData.location}`;

        zipContent.file("signalement.txt", content);

        // Ajouter les images au dossier images
        const imagePromises = Array.from(capturedImages).map((file, index) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const imageData = e.target.result.split(',')[1]; // Enlever le préfixe data:image/*;base64,
                    imagesFolder.file(`image_${index + 1}.jpg`, imageData, {base64: true});
                    resolve();
                };
                reader.readAsDataURL(file);
            });
        });

        // Attendre que toutes les images soient ajoutées
        await Promise.all(imagePromises);

        // Générer le fichier zip
        zipContent.generateAsync({type: "blob"}).then(function(content) {
            // Créer le lien de téléchargement
            const url = window.URL.createObjectURL(content);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${folderName}.zip`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        });

        // Réinitialiser le formulaire
        form.reset();
        imagePreview.innerHTML = "";
        capturedImages.clear();
    });
});