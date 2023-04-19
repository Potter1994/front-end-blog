import axios from 'axios';

export const axiosWithToken = axios.create({
  baseURL: 'http://localhost:3000',
});

export const axiosSetConfig = () => axiosWithToken.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem('potterSiteUserInfo') || "null")?.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config;
});

axiosSetConfig();

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

export const axiosCreateArticle = (title: string, text: string) => {
  return axiosWithToken.post('/article', { title, text }, { headers: { 'Content-Type': 'application/json' } });
}

export const axiosCreateSubArticle = (text: string, id: string) => {
  return axiosWithToken.post(`/article/${id}`, { text }, { headers: { 'Content-Type': 'application/json' } });
}

export const axiosArticle = (page: string, sort: string) => {
  return axiosWithToken.get(`/article?page=${page}&sort=${sort}`);
}

export const axiosGetSubArticle = (id: string) => {
  return axiosWithToken.get(`/article/${id}`);
}

export const axiosGetUpdateIdArticle = (id: string) => {
  return axiosWithToken.get(`/article/update/${id}`);
}

export const axiosDeleteArticle = (id: string) => {
  return axiosWithToken.delete('/article', { data: { id } });
}

export const axiosUpdateArticle = (articleId: string, title: string, text: string) => {
  return axiosWithToken.put(`/article`, { data: { articleId, title, text } });
}