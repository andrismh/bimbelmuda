export function getHomePage(req, res) {
  res.render('pages/index', { title: 'Bimbel Muda!'});
};

export function getAboutPage(req, res) {
  res.render('pages/about');
};

export function getProjectsPage(req, res) {
  res.render('pages/projects');
};