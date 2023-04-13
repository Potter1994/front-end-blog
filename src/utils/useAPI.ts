export const fetchRegister = (username: string, password: string) => {
  return fetch('http://localhost:3000/users/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password })
  }).then(res => res.json());
}

export const fetchLogin = (username: string, password: string) => {
  return fetch('http://localhost:3000/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password })
  }).then(res => res.json());
}