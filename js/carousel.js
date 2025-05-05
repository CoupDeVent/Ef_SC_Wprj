document.addEventListener('DOMContentLoaded', () => {
    // Sélection des éléments du DOM
    const track = document.querySelector('.carousel-track');
    const items = document.querySelectorAll('.carousel-item');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');

    // Variables de contrôle
    let currentIndex = 0;
    const totalItems = items.length;

    // Fonction pour animer la transition
    function updateCarousel() {
        const position = currentIndex * -100;
        // Applique la transformation avec une transition fluide
        track.style.transform = `translateX(${position}%)`;
    }

    // Animation au survol des boutons
    function addButtonHoverEffects() {
        [prevButton, nextButton].forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-50%) scale(1.1)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(-50%) scale(1)';
            });
        });
    }

    // Gestionnaire pour le bouton suivant
    nextButton.addEventListener('click', () => {
        // Incrémente l'index et utilise le modulo pour revenir à 0
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    });

    // Gestionnaire pour le bouton précédent
    prevButton.addEventListener('click', () => {
        // Décrémente l'index et utilise le modulo pour aller à la dernière slide
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
    });

    // Gestion des touches du clavier (flèches gauche/droite)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % totalItems;
            updateCarousel();
        } else if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            updateCarousel();
        }
    });

    // Support du swipe sur mobile
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50; // Seuil minimal pour détecter un swipe
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe vers la gauche (suivant)
                currentIndex = (currentIndex + 1) % totalItems;
            } else {
                // Swipe vers la droite (précédent)
                currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            }
            updateCarousel();
        }
    }

    // Initialisation
    addButtonHoverEffects();
    updateCarousel();
});