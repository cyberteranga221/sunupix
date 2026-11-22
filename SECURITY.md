# Sécurité

## Signaler une faille

Si tu découvres une faille de sécurité dans SunuPix, **ne l'expose pas dans une issue publique**.

Signale-la en privé depuis GitHub : onglet **Security** du dépôt →
**Report a vulnerability** (« signalement privé de vulnérabilité »). Indique :

- ce que tu as trouvé et son impact possible ;
- les étapes pour reproduire (navigateur, appareil, fichier de test **sans données personnelles**) ;
- si possible, une piste de correction.

Tu recevras une première réponse sous 7 jours. Merci de laisser le temps de corriger avant toute
publication.

## Périmètre

SunuPix est un site statique : il n'a ni serveur applicatif, ni base de données, ni compte
utilisateur. Les risques principaux concernent donc le navigateur : exécution de code via un
fichier image malveillant, contournement de la politique de sécurité (CSP), fuite d'une photo ou
d'une métadonnée vers l'extérieur.

## Versions maintenues

Seule la version en ligne sur https://sunupix.vercel.app (branche `main`) reçoit des correctifs.

---

_English: please report vulnerabilities privately via the repository's **Security → Report a
vulnerability** tab, never in a public issue. You will get a first answer within 7 days._
