const BASE_URL = "https://tasks-inbox-platform.onrender.com";

export const login = async () => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "admin", password: "admin" }),
  });

  const token = await res.text();
  localStorage.setItem("token", token);
  return token;
};

export const fetchTasks = async (token) => {
  const res = await fetch(`${BASE_URL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.json();
};

export const createTask = async (task, token) => {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(task),
  });

  return res.json();
};

export const updateTaskAPI = async (task, token) => {
  return fetch(`${BASE_URL}/tasks/${task.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(task),
  });
};