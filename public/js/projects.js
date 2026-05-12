function getToken() { return localStorage.getItem('authToken'); }

async function loadProjects() {
  const res      = await fetch('/api/projects', {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  const projects = await res.json();
  const grid     = document.getElementById('projectsGrid');

  if (!projects.length) {
    grid.innerHTML = '<div class="empty-state">// no projects yet</div>';
    return;
  }

  grid.innerHTML = projects.map(p => `
    <div class="card">
      <div class="card-top">
        <div class="card-title">${p.name}</div>
        <span class="badge badge-${p.status}">${p.status}</span>
      </div>
      <div class="card-meta">${p.description}</div>
      <div class="card-actions" style="margin-top:12px">
        <button class="btn-edit" onclick="editProject('${p._id}','${encodeURIComponent(p.name)}','${encodeURIComponent(p.description)}','${p.status}')">Edit</button>
        <button class="btn-danger" onclick="deleteProject('${p._id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

function openProjectModal() {
  document.getElementById('projectModalTitle').textContent = 'New Project';
  document.getElementById('projectId').value   = '';
  document.getElementById('projectName').value = '';
  document.getElementById('projectDesc').value = '';
  document.getElementById('projectStatus').value = 'active';
  document.getElementById('projectModal').classList.add('open');
}

function editProject(id, name, desc, status) {
  document.getElementById('projectModalTitle').textContent = 'Edit Project';
  document.getElementById('projectId').value     = id;
  document.getElementById('projectName').value   = decodeURIComponent(name);
  document.getElementById('projectDesc').value   = decodeURIComponent(desc);
  document.getElementById('projectStatus').value = status;
  document.getElementById('projectModal').classList.add('open');
}

async function saveProject() {
  const id   = document.getElementById('projectId').value;
  const body = {
    name:        document.getElementById('projectName').value,
    description: document.getElementById('projectDesc').value,
    status:      document.getElementById('projectStatus').value
  };
  const method = id ? 'PUT' : 'POST';
  const url    = id ? `/api/projects/${id}` : '/api/projects';

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
    body: JSON.stringify(body)
  });

  closeModal('projectModal');
  loadProjects();
}

async function deleteProject(id) {
  if (!confirm('Delete this project?')) return;
  await fetch(`/api/projects/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  loadProjects();
}