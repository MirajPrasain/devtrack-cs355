const token = localStorage.getItem('authToken');
if (!token) window.location.href = '/';

let pc = null;
let localStream = null;

const servers = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

function setStatus(msg) {
  document.getElementById('status').textContent = '// ' + msg;
}

function getSessionId() {
  return document.getElementById('sessionId').value.trim();
}

async function getMedia() {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  document.getElementById('localVideo').srcObject = localStream;
}

function createPeer() {
  pc = new RTCPeerConnection(servers);

  localStream.getTracks().forEach(t => pc.addTrack(t, localStream));

  pc.ontrack = ({ streams }) => {
    document.getElementById('remoteVideo').srcObject = streams[0];
    setStatus('connected');
  };

  pc.onicecandidate = async ({ candidate }) => {
    if (candidate) {
      await postSignal('ice-' + getSessionId(), candidate);
    }
  };

  // poll for ICE candidates from peer
  setInterval(async () => {
    if (!pc) return;
    const doc = await getSignal('ice-peer-' + getSessionId());
    if (doc.data && pc.remoteDescription) {
      try { await pc.addIceCandidate(new RTCIceCandidate(doc.data)); } catch(e) {}
    }
  }, 2000);
}

async function startCall() {
  const sessionId = getSessionId();
  if (!sessionId) return alert('Enter a session ID first');
  setStatus('starting call...');
  await getMedia();
  createPeer();

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  await postSignal('offer-' + sessionId, offer);
  setStatus('waiting for peer to join...');

  // poll for answer
  const poll = setInterval(async () => {
    const doc = await getSignal('answer-' + sessionId);
    if (doc.data) {
      clearInterval(poll);
      await pc.setRemoteDescription(new RTCSessionDescription(doc.data));
      setStatus('peer joined');
    }
  }, 2000);
}

async function joinCall() {
  const sessionId = getSessionId();
  if (!sessionId) return alert('Enter the session ID shared by your peer');
  setStatus('joining...');
  await getMedia();
  createPeer();

  const doc = await getSignal('offer-' + sessionId);
  if (!doc.data) return setStatus('no call found with that ID');

  await pc.setRemoteDescription(new RTCSessionDescription(doc.data));
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  await postSignal('answer-' + sessionId, answer);
  setStatus('joined — connecting...');
}

function endCall() {
  if (pc) { pc.close(); pc = null; }
  if (localStream) localStream.getTracks().forEach(t => t.stop());
  document.getElementById('localVideo').srcObject = null;
  document.getElementById('remoteVideo').srcObject = null;
  setStatus('call ended');
}

async function postSignal(type, data) {
  await fetch(`/api/signal/${type}/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ data })
  });
}

async function getSignal(type) {
  const res = await fetch(`/api/signal/${type}/session`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}