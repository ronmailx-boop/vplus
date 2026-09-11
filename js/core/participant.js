const PARTICIPANT_KEY = 'vplus_participant_name';

export function getParticipantName() {
  return localStorage.getItem(PARTICIPANT_KEY) || null;
}

export function setParticipantName(name) {
  localStorage.setItem(PARTICIPANT_KEY, name);
}

export function fallbackParticipantName() {
  return 'משתמש ' + Math.floor(1000 + Math.random() * 9000);
}
