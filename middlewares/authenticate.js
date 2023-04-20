module.exports = function(req, res, next) {
    if (req.session.token) { // menggunakan session untuk memeriksa apakah pengguna telah terautentikasi atau belum
      return next();
    }
    req.flash('error_msg', 'You must be logged in to view this page');
    res.redirect('/posts/users/login'); // jika pengguna belum terautentikasi, akan diarahkan ke halaman login

  };

