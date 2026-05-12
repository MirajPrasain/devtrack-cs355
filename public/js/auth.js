const API = '';

// redirect if already logged in
if (localStorage.getItem('authToken')) {
  window.location.href = '/dashboard.html';
}

function switchTab(tab) {
  document.getElementById('loginForm').style.display    = tab === 'login'    ? 'block' : 'none';
  document.getElementById('registerForm').style.display = tab === 'register' ? 'block' : 'none';
  document.querySelectorAll('.tab').forEach((t, i) => {
    t.classList.toggle('active', (tab === 'login' && i === 0) || (tab === 'register' && i === 1));
  });
}

async function handleLogin() {
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  const msg      = document.getElementById('loginMsg');

  try {
    const res  = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok && data.auth) {
      localStorage.setItem('authToken', data.auth);
      localStorage.setItem('username', username);
      window.location.href = '/dashboard.html';
    } else {
      msg.className = 'msg error';
      msg.textContent = data || 'Login failed';
    }
  } catch (e) {
    msg.className = 'msg error';
    msg.textContent = 'Server error';
  }
}

async function handleRegister() {
  const username = document.getElementById('regUsername').value.trim();
  const password = document.getElementById('regPassword').value;
  const msg      = document.getElementById('registerMsg');

  try {
    const res  = await fetch(`${API}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok) {
      msg.className = 'msg success';
      msg.textContent = 'Account created! Please login.';
      setTimeout(() => switchTab('login'), 1500);
    } else {
      msg.className = 'msg error';
      msg.textContent = data || 'Registration failed';
    }
  } catch (e) {
    msg.className = 'msg error';
    msg.textContent = 'Server error';
  }
}