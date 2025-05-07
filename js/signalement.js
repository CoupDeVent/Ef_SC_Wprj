class SignalementManager {
    constructor() {
        this.signalements = [];
        this.statusElement = document.getElementById('status');
        this.tableBody = document.getElementById('signalementBody');
    }

    async init() {
        try {
            await this.chargerSignalements();
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
                }
            }
        });
        
        return Object.keys(signalement).length > 0 ? signalement : null;
    }

    afficherSignalements() {
        this.tableBody.innerHTML = '';
        
        this.signalements.forEach(signalement => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${this.escapeHtml(signalement.date || '')}</td>
                <td>${this.escapeHtml(signalement.nom || '')}</td>
                <td>${this.escapeHtml(signalement.prenom || '')}</td>
                <td>${this.escapeHtml(signalement.email || '')}</td>
                <td>${this.escapeHtml(signalement.typeProbleme || '')}</td>
                <td>${this.escapeHtml(signalement.description || '')}</td>
                <td>${this.escapeHtml(signalement.localisation || '')}</td>
            `;
            this.tableBody.appendChild(row);
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
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    const manager = new SignalementManager();
    manager.init();
});