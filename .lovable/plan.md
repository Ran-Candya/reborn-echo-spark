# Ajustements ciblés du chargement, du formulaire et des images

## Résultat attendu
- Garder la barre de navigation visible et utilisable pendant l’animation initiale.
- Afficher l’indicateur de chargement uniquement sous cette barre, au-dessus du contenu principal.
- Exiger les quatre champs et la formule dans le formulaire, sans choix prérempli.
- Signaler chaque champ invalide par une bordure rouge après une tentative d’envoi.
- Harmoniser le menu de formule avec l’identité visuelle existante et un fond translucide flouté.
- Charger de manière différée les images des projets situées sous la première zone visible.

## Mise en œuvre
- Ajuster le loader pour qu’il commence sous la barre fixe, avec une priorité d’affichage inférieure à celle de la navigation.
- Ajouter un état de validation après soumission, les attributs `required`, les limites existantes adaptées et les styles d’erreur sur le nom, l’e-mail, l’activité, la formule et le message.
- Initialiser la formule à vide et ajouter l’option inactive « Cliquez ici pour choisir une formule ».
- Conserver un vrai champ `<select>` accessible, habillé avec coins arrondis, surface translucide et flou ; le panneau natif restera contrôlé par le navigateur.
- Vérifier les balises `<img>` sous la ligne de flottaison et ajouter `loading="lazy"` et `decoding="async"` lorsqu’ils manquent.

## Vérification
- Tester le premier rendu et l’interaction de la navigation sur mobile et ordinateur.
- Soumettre le formulaire vide, confirmer les bordures rouges, puis remplir les champs et vérifier la redirection attendue.
- Contrôler que le choix de formule est vide au départ et que les images utilisent bien le chargement différé.
