# 📝 Todo App  

A feature-rich Todo application built with **React (TypeScript), TailwindCSS, ShadCN UI** on the frontend and **Node.js, Express, MongoDB (TypeScript)** on the backend.  

## 🚀 Features  
- ✅ **User Authentication** (Register, Login, Logout)  
- 📝 **CRUD operations for Todos**  
- 🔖 **Filtering, Sorting & Searching Todos**  
- 📌 **Priority & Status Management**  
- 📤 **Export Todos as JSON or CSV**  
- 👥 **Mentions Feature** (Assign users to todos)  
- 🗒️ **Notes Management** (Add, Fetch, Delete Notes)  

---

## 🛠 Tech Stack  

### 🌐 Frontend  
- **React (TypeScript)**  
- **TailwindCSS**  
- **ShadCN UI**  
- **Axios** (For API Calls)  

### 🖥 Backend  
- **Node.js**  
- **Express.js**  
- **MongoDB (Mongoose)**  
- **TypeScript**  
- **JSON2CSV Parser** (For Exporting Data)  

---

## How to run code
- ** Do git clone git clone https://github.com/17prateek12/todo **
## For Frontend
- ** cd frontend **
- ** npm install **
- ** npm run dev **

## For Backend
- ** cd backend **
- ** create .env folder and get MONGO_URI, ACCESS_TOKEN_SECRET and PORT or ""
- ** copy paste .env from here PORT = 5000
ACCESS_TOKEN_SECRET = Prateek@1812338dh@@6br2Mbdhjshs8OyBjrwl9d    
MONGO_URI = mongodb+srv://17prateek12:6br2Mb8OyBjrwl9d@cluster0.ofdkg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0 **
- ** npm install **
- ** npm run dev **

### Your project is ready to run locally

## 🔗 API Endpoints

### 🛡️ Authentication
| Method |	Endpoint |	Description |
|------- |-----------|--------------|
| POST |	/api/user/register |	Register a user |
| POST |	/api/user/login |	Login a user |
| POST |	/api/user/logout |	Logout a user |

### ✅ Todo Management
|Method |	Endpoint |	Description |
|-------|------------|--------------|
|POST |	/api/todos/create-todo |	Create a new todo |
|GET |	/api/todos/todo |	Fetch all todos |
|GET |	/api/todos/todo/:id |	Get a single todo by ID |
|PATCH |	/api/todos/todo/:id |	Update a todo |
|DELETE |	/api/todos/todo/:id |	Delete a todo |

### 🗒️ Notes Management
|Method |	Endpoint |	Description |
|-------|------------|--------------|
|POST |	/api/todos/todo/:todoId/notes |	Add a note to a todo |
|GET |	/api/todos/todo/:todoId/notes |	Fetch notes of a todo |
|DELETE |	/api/todos/todo/notes/:noteId |	Delete a note |

### Main Login/register Page
![image](https://github.com/user-attachments/assets/ad8a0b52-e513-407d-883e-bdd57fe32e12)

### Home Page 
![image](https://github.com/user-attachments/assets/6e542526-6474-4aff-ba0f-6a3f2c6a6ad1)

### Create Todo
![image](https://github.com/user-attachments/assets/edc8c21c-4fa1-440a-ba9b-1318f88868df)

### View Todo and Notes
![image](https://github.com/user-attachments/assets/06aaf75b-5086-47b8-a3ea-10d3228259e1)
![image](https://github.com/user-attachments/assets/3c3f3eca-a5be-41ea-9fb0-cf299ff323b1)

### Edit Todo
![image](https://github.com/user-attachments/assets/fd8d3a48-f4fd-45e7-b660-e16b271a23e2)





