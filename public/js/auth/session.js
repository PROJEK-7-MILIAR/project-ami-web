(function () {
  function getUser() {
    const user = window.authUser || null;

    if (!user) return null;

    return {
      username: user.username || '',
      email: user.email || '',
      name: user.name || user.username || user.email || 'User',
      role: user.role || 'admin'
    };
  }

  function sync() {
    const user = getUser();

    if (!user) return false;

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', user.email || user.username);
    localStorage.setItem('userUsername', user.username);
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('userName', user.name);

    return true;
  }

  function clearStaticAuthSession() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userUsername');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('currentKontigen');
  }

  function logout() {
    clearStaticAuthSession();

    const existingForm = document.getElementById('logoutForm');

    if (existingForm) {
      existingForm.submit();
      return;
    }

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = window.logoutUrl || '/logout';

    const token = document.createElement('input');
    token.type = 'hidden';
    token.name = '_token';
    token.value = window.csrfToken || '';

    form.appendChild(token);
    document.body.appendChild(form);
    form.submit();
  }

  window.LaravelAuth = {
    getUser: getUser,
    sync: sync,
    clearStaticAuthSession: clearStaticAuthSession,
    logout: logout
  };
})();
