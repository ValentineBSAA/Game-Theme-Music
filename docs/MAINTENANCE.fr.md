# Politique de maintenance GTM | 4.6.7 stable

> ℹ️ **À propos de cette traduction :** l'interface du plugin est en anglais. Les libellés d'interface sont conservés tels quels afin que vous les retrouviez à l'écran.

**Développeur et mainteneur : Valentine**  
**Statut du projet : complet en fonctionnalités pour la direction actuelle centrée sur la musique. Maintenance active.**

Game Theme Music a atteint le stade où je souhaite me concentrer sur le maintien fiable des fonctionnalités que les gens utilisent déjà. **Je n'abandonne pas GTM et je n'annonce aucune date de fin de vie.** Je mets fin au cycle continu d'ajout de nouvelles fonctionnalités à la ligne de version actuelle.

Il s'agit d'une **orientation de projet**, et non de l'affirmation que chaque appareil, thème, manette ou combinaison de plugins est déjà parfait.

## Ce que couvre la maintenance active

- **Corrections de bugs :** plantages, gels, navigation de menu cassée, réglages corrompus ou perdus, musique manquante, focus audio et comportement du visualiseur qui ne correspond pas à l'interface.
- **Compatibilité SteamOS / Decky :** régressions introduites par des changements de plateforme, y compris CSS Loader et le comportement des intégrations lorsque GTM est concerné.
- **Fiabilité et performances :** reprise après veille/réveil de la lecture, rendu à forte consommation CPU, simulation du spectateur IA et intégrité réelle du score, usage prolongé.
- **Accessibilité et petites améliorations du quotidien :** contrôles plus clairs, indicateurs d'état corrects, dispositions Default et Couch/TV lisibles, contraste visuel, interrupteurs ON/OFF persistants.
- **Sécurité et dépendances :** maintenance raisonnable lorsqu'un problème précis est découvert.
- **Documentation et tests :** maintenir l'exactitude des instructions utilisateur, des légendes de captures, des fichiers de version et des vérifications automatisées.

Une correction de maintenance peut nécessiter un petit refactoring interne ou des changements d'interface soigneusement délimités. Ce n'est **pas la promesse d'ajouter un nouveau sous-système ni de redessiner l'application à chaque demande**.

## Ce qui n'est pas à l'ordre du jour

Aucun nouveau mode Arcade jouable par des humains, système multijoueur, mode sans rapport, jeu supplémentaire, extension majeure des visualiseurs ou demande de fonctionnalité générale n'est actuellement planifié. **Les scènes Arcade Spectator actuelles sont en mode spectateur uniquement.** La prise en charge des packs de visualiseurs personnalisés reste disponible, mais les nouveaux packs ne font pas automatiquement partie de la feuille de route de maintenance.

Les idées sont les bienvenues sous forme d'observations, mais je peux les reporter ou les refuser. Les votes et suggestions ne constituent pas des engagements, et **aucun calendrier de développement n'est annoncé** pour de nouvelles fonctionnalités.

## Votre choix : les visuels sont facultatifs

Utilisez **Quick Access → GTM → Visualizers → Enable Home visualizers → OFF** pour masquer le bandeau du visualiseur. La musique de jeu, Ambient/Accueil et du Store reste disponible. Désactiver **Shuffle All** est indépendant de l'activation du visualiseur : cela arrête le changement automatique de scène à chaque piste sans masquer la scène sélectionnée. Vous pouvez choisir la taille de bandeau Default ou Couch/TV.

## Signaler un problème reproductible

Utilisez le [formulaire de rapport de bug](https://github.com/ValentineBSAA/Game-Theme-Music/issues/new?template=bug_report.md). Merci d'indiquer :

1. La version de GTM (actuellement **4.6.7**), le modèle de Steam Deck OLED/LCD, et les versions de SteamOS et de Decky Loader si vous les connaissez.
2. Ce qui s'est produit, ce qui aurait dû se produire et les étapes de reproduction.
3. La zone concernée : bande originale de jeu, Ambient, Store, collection de visualiseurs, spectateur IA, gestionnaire de packs, thème CSS ou intégration ResonaDeck.
4. Les réglages pertinents : visualiseurs ON/OFF, Shuffle All, Default/Couch-TV, palette, scène sélectionnée, veille/réveil ou détails de la manette.
5. Des captures d'écran et journaux **uniquement si cela vous est facile**, sans identifiants ni données personnelles.

Je peux demander une confirmation sur du matériel réel avant de considérer un changement comme entièrement vérifié.

## Approche des versions

- **La 4.6.7 est la version stable publique actuelle.** La politique de maintenance n'impose pas en elle-même de nouvelles versions.
- Les correctifs sont publiés lorsqu'une véritable correction ou une mise à jour de compatibilité est prête et vérifiée. Il n'existe **aucun rythme de publication fixe**.
- Les fonctions et réglages existants doivent être préservés, sauf si un bug documenté ou un problème de compatibilité exige un changement.
- Exécutez les vérifications automatisées pertinentes et testez sur un Steam Deck réel lorsque c'est possible. Les tests automatisés seuls ne prouvent pas une compatibilité matérielle universelle.
- Conservez les versions publiées et les fichiers téléchargeables intacts. L'expérimentation historique reste disponible comme documentation, et non comme invitation à restaurer d'anciens installateurs bêta.
- Évitez de restaurer la préversion historique **4.4.1**. L'installateur 4.6.7 actuel est autonome.

## Participer

Les [rapports de bug](https://github.com/ValentineBSAA/Game-Theme-Music/issues/new?template=bug_report.md) et les pull requests de correction bien délimitées sont utiles. Pour contribuer au code, voir [CONTRIBUTING.md](../CONTRIBUTING.md). Les suggestions de fonctionnalités peuvent passer par le [formulaire de suggestion](https://github.com/ValentineBSAA/Game-Theme-Music/issues/new?template=feature_request.yml), mais elles ne constituent ni une feuille de route active ni une garantie de mise en œuvre.

Merci d'utiliser GTM, de signaler les problèmes et de m'aider à l'améliorer.

**Valentine**
