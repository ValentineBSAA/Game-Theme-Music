# Premiers pas avec Game Theme Music 4.6.7 🎵

> ℹ️ **À propos de cette traduction :** l'interface du plugin est en anglais. Les libellés d'interface (menus, boutons, options) sont conservés tels quels afin que vous les retrouviez à l'écran.

**Développeur : Valentine. Statut : maintenance active, développement de grandes fonctionnalités en pause.** GTM est un plugin Decky Loader centré sur la musique pour Steam Deck, avec des bandes originales personnalisées, de la musique Ambient/Store, des visualiseurs réactifs et des scènes spectateur IA **en mode spectateur uniquement**. Il n'existe **aucun mode Arcade jouable ni aucun contrôle multijoueur local** dans la 4.6.7.

## 4.6.7 : navigation et contrôles du menu contextuel de la bibliothèque

Utilisez **Quick Access → GTM → Browse all pages · A–Z** pour accéder directement à une page, ou LB/RB pour changer de page. Dans les réglages de GTM, affichez ou masquez indépendamment **Change Music**, **Change Ambient Playlist** et **Change Store Playlist** dans les menus contextuels de la bibliothèque Steam. Masquer un raccourci ne désactive jamais la lecture et ne modifie pas les entrées de TitleDeck.

L'interrupteur **Enable Home visualizers** contrôle si les visuels sont autorisés pendant une musique prise en charge, et non si un visualiseur doit toujours s'afficher sur un accueil inactif. Avec ResonaDeck 1.5.7, les visuels peuvent réagir à la musique Plex/Jellyfin. Si l'affichage apparaît mais ne répond pas à l'audio, essayez de basculer **GTM Visualizers** en OFF puis ON dans ResonaDeck pour rafraîchir la capture. Une connexion automatique dès le premier essai n'est pas démontrée comme universelle.

## Installer ou mettre à jour

1. Téléchargez le fichier **`Game-Theme-Music-4.6.7.zip`** depuis la [version officielle 4.6.7](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V4.6.7).
2. Utilisez l'option d'installation manuelle d'un ZIP de Decky Loader. **Ne sélectionnez pas le ZIP de code source généré automatiquement par GitHub** ; ce n'est pas un installateur complet.
3. Laissez les réglages persistants de Decky en place lors de la mise à jour pour conserver vos playlists, palettes, préférences de lecture aléatoire et l'apprentissage de l'IA.
4. Revenez sur **Steam Home** et fermez Quick Access. Le remerciement plein écran de Valentine apparaît une fois par version sur l'accueil. Appuyez sur **A / Cross** pour continuer ; ce n'est pas une page de Quick Access.

Le ZIP public est autonome et **ne nécessite aucune version antérieure de GTM**. Vérifiez le téléchargement avec la [somme de contrôle publiée pour la 4.6.7](RELEASE_ASSET_SHA256_4.6.7.txt). [Index des versions et retour arrière](RELEASE_INDEX.md).

## Musique

- **Musique de jeu :** configurez des bandes originales pour les jeux Steam et non-Steam.
- **Ambient :** musique de l'accueil Steam. Le délai de veille/réveil et les contrôles associés se trouvent dans **Full Manager → Ambient**. Une version 4.1.2 antérieure a introduit un délai configurable de 5 à 60 secondes (12 secondes par défaut).
- **Store :** musique pour la navigation dans le Store Steam et le Decky Store.
- **Playlists et fondu enchaîné :** gestion des playlists et fondu enchaîné préchargé optionnel.
- **ResonaDeck :** GTM peut visualiser la télémétrie Plex prise en charge par [ResonaDeck](https://github.com/ValentineBSAA/ResonaDeck), installé séparément. Chaque plugin gère sa propre lecture et son propre focus audio.

## Les visualiseurs sont facultatifs : la musique fonctionne sans visuels

Pour **masquer le bandeau du visualiseur sans arrêter la musique**, utilisez **Quick Access → GTM → Visualizers → Enable Home visualizers → OFF**. Basculez sur **ON** pour afficher de nouveau les visualiseurs. La lecture de la musique, les bandes originales Ambient/Store et les playlists sont indépendantes de cet interrupteur d'affichage. **Shuffle All on Track Change** est un contrôle différent : OFF empêche le changement automatique de scène, sans rendre les visualiseurs indisponibles.

Voir la [galerie de captures réelles 4.4.9](SCREENSHOTS.fr.md) pour les contrôles et 15 visuels choisis. Ces captures **ne montrent pas tous les visualiseurs**.

## Quick Menu des visualiseurs

Ouvrez **Quick Access → GTM → Visualizers**. Parcourez le navigateur de scènes à deux colonnes, pensé pour la manette, ainsi que **Retro Ambient**, **Classic Rhythm**, **GTM Signature**, **Anime Worlds** et les autres collections disponibles. Ouvrir une collection permet de parcourir ses entrées ; activez une scène individuelle pour changer le bandeau. GTM distingue l'état **ACTIVE** (utilisé actuellement) de **SAVED** (choix mémorisé).

- **Visualizer ON/OFF :** contrôle si le visualiseur du bandeau est affiché.
- **Shuffle All on Track Change :** facultatif. **Off** est une préférence enregistrée valide, qu'une mise à jour ne doit pas modifier sans votre accord.
- **Couleurs et effets :** utilisez les contrôles de palette, multicolore/dégradé personnalisé, intensité et réactivité à la musique ; l'apparence réelle varie selon le visualiseur.
- **Disposition :** choisissez **Default** pour un bandeau plus petit ou **Couch/TV** pour une présentation plus grande et plus lisible. Le choix est persistant.
- **Packs :** le Visualizer Pack Manager importe les packs de scènes personnalisées pris en charge ; les anciens paquets de jeux jouables ne font pas partie de cette version spectateur uniquement.

## Arcade Spectator (spectateur uniquement)

La page **Arcade Spectator** du Quick Menu contrôle des exhibitions automatiques optionnelles. Neon Paddle existe en versions Classic, Thunder et Starlight. L'IA 1 et l'IA 2 jouent sans intervention humaine ; les couleurs des raquettes, les arrière-plans d'arène, l'apparence de la balle et les effets peuvent changer automatiquement. Le système comprend **32 pouvoirs de balle** et une IA adaptative.

Il n'existe **aucun contrôle joueur contre IA, joueur contre joueur, revendication de manette ou matchmaking** dans l'édition 4.6.7 actuelle. « Arcade » désigne des visualiseurs, pas des jeux jouables.

## Quelles mises à jour attendre ?

**La 4.6.7 poursuit la direction centrée sur la musique et reste activement maintenue.** Je continue à corriger les problèmes, à suivre la compatibilité de la plateforme et à maintenir les fonctionnalités de lecture et de visualisation existantes. Cela ne signifie pas que le plugin est abandonné, ni que toutes les configurations matérielles ont été entièrement testées. Aucun calendrier de mise à jour n'est promis. Consultez la [politique de maintenance](MAINTENANCE.fr.md) pour les priorités actuelles et la manière de signaler un problème.

## Besoin d'aide ?

Consultez la [compatibilité et les limites matérielles](STEAMOS_COMPATIBILITY.md), le [périmètre des tests](../TESTING.md), ou [signalez un bug](https://github.com/ValentineBSAA/Game-Theme-Music/issues/new?template=bug_report.md). Précisez ce que vous attendiez, ce qui s'est produit et la version de GTM, ainsi que les détails du Deck et de SteamOS lorsque vous les connaissez. Les captures d'écran sont facultatives ; retirez les données personnelles.

[Retour à l'accueil GTM](../README.fr.md) · [Notes de version](RELEASE_NOTES_4.6.7.md)
