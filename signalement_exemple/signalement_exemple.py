import os
import random
from datetime import datetime, timedelta

# Listes d'exemples
noms = [
    'Durand', 'Martin', 'Bernard', 'Thomas', 'Petit',
    'Robert', 'Richard', 'Garcia', 'Martinez', 'Leroy',
    'Moreau', 'Fournier', 'Dupont', 'Blanc', 'Guerin',
    'Legrand', 'Gauthier', 'Pereira', 'Rousseau', 'Roussel'
]
prenoms = [
    'Pierre', 'Jean', 'Marie', 'Luc', 'Sophie',
    'Emma', 'Louis', 'Paul', 'Camille', 'Julien',
    'Sarah', 'Nicolas', 'Léo', 'Manon', 'Hugo',
    'Chloé', 'Clément', 'Laura', 'Lucas', 'Alice'
]
types_problemes = {
    'incivilité': [
        'Vandalisme sur un arrêt de bus.',
        'Graffiti sur les murs.',
        'Tapage nocturne fréquent dans la rue.',
        'Dégradation de mobilier urbain.',
        'Stationnement sauvage.'
    ],
    'propreté': [
        'Dépôt sauvage d’encombrants.',
        'Accumulation de déchets sur le trottoir.',
        'Poubelles non ramassées depuis plusieurs jours.',
        'Déchets éparpillés dans le parc.',
        'Graffiti sur des panneaux de signalisation.'
    ],
    'maintenance': [
        'Lampadaire hors service.',
        'Nid-de-poule sur la chaussée.',
        'Feu de signalisation défectueux.',
        'Bouche d’égout endommagée.',
        'Trottoir fissuré nécessitant une réparation.'
    ]
}

# 30 localisations (sur des routes à Villejuif, fictives pour l'exemple)
localisations = [
    "48.793540, 2.362710 - Rue Jean Jaurès",
    "48.789231, 2.368450 - Rue Pasteur",
    "48.791123, 2.359982 - Avenue de Paris",
    "48.785431, 2.362874 - Rue Ambroise Croizat",
    "48.788942, 2.354872 - Rue Marcel Paul",
    "48.790123, 2.361234 - Avenue Henri Barbusse",
    "48.787654, 2.356789 - Rue Émile Zola",
    "48.794321, 2.363123 - Rue Auguste Blanqui",
    "48.788888, 2.364567 - Rue Séverine",
    "48.792345, 2.355678 - Rue du Colonel Fabien",
    "48.793210, 2.362130 - Rue de Verdun",
    "48.786540, 2.359710 - Rue Georges Lebigot",
    "48.789876, 2.364210 - Rue Léon Blum",
    "48.785212, 2.365410 - Avenue Louis Aragon",
    "48.787333, 2.362200 - Rue Jean Lurçat",
    "48.788999, 2.363000 - Rue René Hamon",
    "48.790000, 2.362987 - Rue de la Commune",
    "48.791234, 2.361234 - Rue Raymond Lefebvre",
    "48.792345, 2.365678 - Rue des Fusillés",
    "48.793456, 2.366789 - Rue de la République",
    "48.789999, 2.363210 - Rue des Écoles",
    "48.786123, 2.360210 - Rue Roger Morinet",
    "48.785678, 2.359999 - Rue des Jardins",
    "48.787890, 2.362567 - Rue Gabriel Péri",
    "48.790876, 2.360123 - Rue Émile Combes",
    "48.789654, 2.362987 - Rue Anatole France",
    "48.792999, 2.364321 - Rue Maurice Thorez",
    "48.793123, 2.361210 - Rue Louise Michel",
    "48.789210, 2.365678 - Rue des Sorbiers",
    "48.786789, 2.362345 - Avenue Paul Vaillant-Couturier"
]

#Statut : NT (non traité), ECT (en cour de traitement), T (traité)
statuts = [
    "NT",
    "ECT",
    "T"
]

mails = [
    "gmail.com",
    "orange.fr",
    "efrei.net",
    "outlook.fr",
    "yahoo.fr",
    "sfr.fr"
]

# Générer les fichiers
os.makedirs('signalement', exist_ok=True)

for i in range(1, 31):
    nom = random.choice(noms)
    prenom = random.choice(prenoms)
    mail = random.choice(mails)
    email = f"{prenom.lower()}.{nom.lower()}@{mail}"
    date = (datetime.now() - timedelta(days=random.randint(0, 365))).strftime("%d/%m/%Y")
    type_probleme = random.choice(list(types_problemes.keys()))
    description = random.choice(types_problemes[type_probleme])
    localisation = random.choice(localisations)
    statut = random.choice(statuts)

    contenu = (
        f"Date: {date}\n"
        f"Nom: {nom}\n"
        f"Prénom: {prenom}\n"
        f"Email: {email}\n"
        f"Type de problème: {type_probleme}\n"
        f"Description: {description}\n"
        f"Localisation: {localisation}\n"
        f"Statut: {statut}"
    )

    with open(f'signalement/signalement_{i}.txt', 'w') as fichier:
        fichier.write(contenu)

print("30 fichiers générés dans le dossier 'descriptions'.")
