class SignalementManager {
    constructor() {
        this.signalements = [];
        this.statusElement = document.getElementById('status');
        this.tableBody = document.getElementById('signalementBody');
    }

    async init() {
        try {
            await this.chargerSignalements();
            this.addEventListenersToHeaders();
            this.ajouterRechercheEnDirect();
        } catch (erreur) {
            this.afficherErreur("Erreur lors du chargement des signalements : " + erreur.message);
        }
    }

    async chargerSignalements() {
        try {
            for (let i = 1; i <= 30; i++) {
                try {
                    const reponse = await fetch(`../../signalement_exemple/signalement/signalement_${i}.txt`);
                    if (reponse.ok) {
                        const contenu = await reponse.text();
                        const signalement = this.parseSignalement(contenu);
                        if (signalement) {
                            this.signalements.push(signalement);
                        }
                    }
                } catch (erreur) {
                    console.warn(`Fichier signalement_${i}.txt non trouvé ou inaccessible`);
                }
            }

            if (this.signalements.length === 0) {
                this.afficherErreur("Aucun signalement n'a été trouvé. Vérifiez le chemin du dossier.");
            } else {
                this.afficherSignalements();
                this.mettreAJourStatus(`${this.signalements.length} signalement(s) chargé(s)`);
            }
        } catch (erreur) {
            this.afficherErreur("Erreur lors du chargement des signalements");
            console.error(erreur);
        }
    }

    parseSignalement(contenu) {
        const lignes = contenu.split('\n');
        const signalement = {};
        
        lignes.forEach(ligne => {
            const [cle, ...valeurParts] = ligne.split(':');
            const valeur = valeurParts.join(':').trim();
            
            if (cle && valeur) {
                switch(cle.trim()) {
                    case 'Date':
                        signalement.date = valeur;
                        break;
                    case 'Nom':
                        signalement.nom = valeur;
                        break;
                    case 'Prénom':
                        signalement.prenom = valeur;
                        break;
                    case 'Email':
                        signalement.email = valeur;
                        break;
                    case 'Type de problème':
                        signalement.typeProbleme = valeur;
                        break;
                    case 'Description':
                        signalement.description = valeur;
                        break;
                    case 'Localisation':
                        signalement.localisation = valeur;
                        break;
                    case 'Statut':
                        signalement.statut = valeur;
                        break;
                }
            }
        });
        
        return Object.keys(signalement).length > 0 ? signalement : null;
    }

    afficherSignalements(signalements = this.signalements) {
        this.tableBody.innerHTML = '';

        signalements.forEach(signalement => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-full-text="${signalement.date || ''}">${this.escapeHtml(signalement.date || '')}</td>
                <td data-full-text="${signalement.nom || ''}">${this.escapeHtml(signalement.nom || '')}</td>
                <td data-full-text="${signalement.prenom || ''}">${this.escapeHtml(signalement.prenom || '')}</td>
                <td data-full-text="${signalement.email || ''}">${this.escapeHtml(signalement.email || '')}</td>
                <td data-full-text="${signalement.typeProbleme || ''}">${this.escapeHtml(signalement.typeProbleme || '')}</td>
                <td data-full-text="${signalement.description || ''}">${this.escapeHtml(signalement.description || '')}</td>
                <td data-full-text="${signalement.localisation || ''}">${this.escapeHtml(signalement.localisation || '')}</td>
                <td>
                    <span class="status-pill ${signalement.statut.toLowerCase()}"></span>
                </td>
            `;
            this.tableBody.appendChild(row);
        });

        // Ajouter dynamiquement la classe `truncated` si le texte est tronqué
        const cells = this.tableBody.querySelectorAll('td');
        cells.forEach(cell => {
            if (cell.scrollWidth > cell.clientWidth) {
                cell.classList.add('truncated');
            }
        });
    }

    escapeHtml(texte) {
        const div = document.createElement('div');
        div.textContent = texte;
        return div.innerHTML;
    }

    mettreAJourStatus(message) {
        this.statusElement.textContent = message;
        this.statusElement.className = 'status';
    }

    afficherErreur(message) {
        this.statusElement.textContent = message;
        this.statusElement.className = 'status error';
    }

    addEventListenersToHeaders() {
        const headers = document.querySelectorAll('.sort');
        headers.forEach(header => {
            header.addEventListener('click', () => {
                const key = header.dataset.key;
                const isAscending = header.classList.contains('asc');
                headers.forEach(h => h.classList.remove('asc', 'desc'));
                this.sortSignalements(key, !isAscending);
                header.classList.toggle('asc', !isAscending);
                header.classList.toggle('desc', isAscending);
            });
        });
    }

    sortSignalements(key, isAscending) {
        const signalementsAffiches = this.signalementsFiltres || this.signalements;

        signalementsAffiches.sort((a, b) => {
            if (key === 'statut') {
                const order = ['NT', 'ECT', 'T'];
                return isAscending ? order.indexOf(a[key]) - order.indexOf(b[key]) : order.indexOf(b[key]) - order.indexOf(a[key]);
            }
            if (typeof a[key] === 'string') {
                return isAscending ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key]);
            }
            if (typeof a[key] === 'number' || !isNaN(Date.parse(a[key]))) {
                return isAscending ? new Date(a[key]) - new Date(b[key]) : new Date(b[key]) - new Date(a[key]);
            }
            return 0;
        });

        this.afficherSignalements(signalementsAffiches);
    }

    ajouterRechercheEnDirect() {
        const selecteur = document.getElementById('filtreSelect');
        const champRecherche = document.getElementById('champRecherche');

        champRecherche.addEventListener('input', () => {
            const critere = selecteur.value;
            const valeur = champRecherche.value.toLowerCase();

            this.signalementsFiltres = this.signalements.filter(signalement => {
                return signalement[critere]?.toLowerCase().includes(valeur);
            });

            this.afficherSignalements(this.signalementsFiltres);
        });
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    const manager = new SignalementManager();
    manager.init();
});