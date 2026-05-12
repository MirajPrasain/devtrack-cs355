const API_URL = '';

function getToken() { return localStorage.getItem('authToken'); }

async function loadLogs() {
  const res  = await fetch(`${API_URL}/api/logs`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  const logs = await res.json();
  const grid = document.getElementById('logsGrid');

  if (!logs.length) {
    grid.innerHTML = '<div class="empty-state">// no logs yet</div>';
    return;
  }

  grid.innerHTML = logs.map(log => `
    <div class="card">
      <div class="card-top">
        <div class="card-title">${log.date}</div>
        <div class="card-actions">
          <button class="btn-edit" onclick="editLog('${log._id}','${log.date}','${log.hours}','${encodeURIComponent(log.tasks)}','${encodeURIComponent(log.notes)}')">Edit</button>
          <button class="btn-danger" onclick="deleteLog('${log._id}')">Delete</button>
        </div>
      </div>
      <div class="card-meta">${log.hours} hrs — ${log.tasks}</div>
      <div class="card-note">${log.notes}</div>
    </div>
  `).join('');
}

function openLogModal() {
  document.getElementById('logModalTitle').textContent = 'New Log';
  document.getElementById('logId').value    = '';
  document.getElementById('logDate').value  = new Date().toISOString().split('T')[0];
  document.getElementById('logHours').value = '';
  document.getElementById('logTasks').value = '';
  document.getElementById('logNotes').value = '';
  document.getElementById('logModal').classList.add('open');
}

function editLog(id, date, hours, tasks, notes) {
  document.getElementById('logModalTitle').textContent = 'Edit Log';
  document.getElementById('logId').value    = id;
  document.getElementById('logDate').value  = date;
  document.getElementById('logHours').value = hours;
  document.getElementById('logTasks').value = decodeURIComponent(tasks);
  document.getElementById('logNotes').value = decodeURIComponent(notes);
  document.getElementById('logModal').classList.add('open');
}

async function saveLog() {
  const id    = document.getElementById('logId').value;
  const body  = {
    date:  document.getElementById('logDate').value,
    hours: document.getElementById('logHours').value,
    tasks: document.getElementById('logTasks').value,
    notes: document.getElementById('logNotes').value
  };
  const method = id ? 'PUT' : 'POST';
  const url    = id ? `${API_URL}/api/logs/${id}` : `${API_URL}/api/logs`;

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
    body: JSON.stringify(body)
  });

  closeModal('logModal');
  loadLogs();
}

async function deleteLog(id) {
  if (!confirm('Delete this log?')) return;
  await fetch(`${API_URL}/api/logs/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  loadLogs();
}