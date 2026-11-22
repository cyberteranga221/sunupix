// Applique le thème clair/sombre avant l'affichage (évite un flash). Fichier séparé pour la CSP.
(function () {
  try {
    var t = localStorage.getItem('sunupix:theme');
    if (t !== 'light' && t !== 'dark')
      t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.dataset.theme = t;
  } catch (e) {
    document.documentElement.dataset.theme = 'light';
  }
})();
