import axios from 'axios';

const baseURL = 'https://potterpan.com';

export const axiosWithUserToken = axios.create({
  baseURL
});

export const axiosWithChatToken = axios.create({
  baseURL
})

export const axiosSetUserConfig = () => axiosWithUserToken.interceptors.request.use((config: any) => {
  try {
    const token = JSON.parse(localStorage.getItem('potterSiteUserInfo') || "null")?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config;
  } catch (err) {
    localStorage.removeItem('potterSiteUserInfo');

    return config;
  }
});

export const axiosSetChatConfig = () => axiosWithChatToken.interceptors.request.use((config) => {
  try {
    const token = JSON.parse(localStorage.getItem('potterSiteChatInfo') || "null")?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config;
  } catch (err) {
    localStorage.removeItem('potterSiteChatInfo');

    return config;
  }
});

axiosSetUserConfig();
axiosSetChatConfig();

export const fetchRegister = (username: string, password: string) => {
  return fetch(`${baseURL}/users/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password })
  }).then(res => res.json());
}

export const fetchLogin = (username: string, password: string) => {
  return fetch(`${baseURL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password })
  }).then(res => res.json());
}

export const axiosCreateArticle = (title: string, text: string) => {
  return axiosWithUserToken.post('/article', { title, text }, { headers: { 'Content-Type': 'application/json' } });
}

export const axiosCreateSubArticle = (text: string, id: string) => {
  return axiosWithUserToken.post(`/article/${id}`, { text }, { headers: { 'Content-Type': 'application/json' } });
}

export const axiosArticle = (page: string, sort: string) => {
  return axiosWithUserToken.get(`/article?page=${page}&sort=${sort}`);
}

export const axiosGetSubArticle = (id: string) => {
  return axiosWithUserToken.get(`/article/${id}`);
}

export const axiosGetUpdateIdArticle = (id: string) => {
  return axiosWithUserToken.get(`/article/update/${id}`);
}

export const axiosDeleteArticle = (id: string) => {
  return axiosWithUserToken.delete('/article', { data: { id } });
}

export const axiosUpdateArticle = (articleId: string, title: string, text: string) => {
  return axiosWithUserToken.put(`/article`, { articleId, title, text });
}

export const axiosUpdateSubArticle = (articleId: string, text: string) => {
  return axiosWithUserToken.put(`/article/update/${articleId}`, { text });
}

export const axiosThumbArticle = (articleId: string, username: string) => {
  return axiosWithUserToken.post(`/thumb`, { articleId, username });
}

export type NotificationType = {
  username: String,
  chatuser: String,
  content: String,
  timestamp: Date,
}

type NotificaionList = {
  username: string,
  chatuser: string,
  content: string,
}

export const axiosGetNotification = () => {
  return axiosWithUserToken.get<NotificationType[]>('/notification');
}

export const axiosPostNotification = ({ username, chatuser, content }: NotificaionList) => {
  return axiosWithUserToken.post('/notification', { username, chatuser, content });
}

export const axiosGetChatroom = (chatuser: string[]) => {
  const queryString = chatuser.reduce((prev, curr) => prev += `chatuser[]=${curr}&`, '').replace(/.$/, '');
  return axiosWithChatToken.get(`/chatroom?${queryString}`);
}

export const axiosGetMessage = (token: string) => {
  return axiosWithChatToken.get('/chatroom/message');
}
export const axiosPostMessage = (username: string, content: string) => {
  return axiosWithChatToken.post('/chatroom/message', { username, content });
}