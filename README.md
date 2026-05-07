# 🍳 CookBoss

CookBoss is a full-stack recipe management web application developed for the **Web Programming** course.

The platform allows users to browse, create, edit, delete, and favorite recipes through a modern and responsive interface.

This project was designed to demonstrate concepts studied during the course, including:

* Web application development
* Front-end frameworks
* Back-end frameworks
* REST APIs
* CRUD operations
* Version control with Git
* Deploy and hosting
* Responsive design
* Project planning and backlog management

---

## 📌 Features

### Recipe Management (CRUD)

* Create new recipes
* View all recipes
* Edit existing recipes
* Delete recipes with confirmation

### Recipe Details

Each recipe includes:

* Name
* Category
* Preparation time
* Difficulty level
* Ingredients
* Preparation steps
* Image

### Search and Filters

* Search recipes by name
* Filter by category
* Filter by difficulty

### Favorites

* Save favorite recipes
* Favorites stored persistently

### UI/UX

* Responsive design (desktop + mobile)
* Modern food-themed interface
* Dark mode
* Toast notifications
* Loading states
* Empty states

---

## 🛠️ Technologies Used

### Front-end

* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* TanStack Router

### Back-end

* Lovable Cloud backend
* Server functions
* REST-like API routes

### Other Tools

* Git & GitHub
* Vercel / Lovable deployment

---

## 📂 Project Structure

```bash
src/
├── components/
│   ├── Navbar
│   ├── RecipeCard
│   ├── SearchBar
│   ├── Footer
│   └── UI components
│
├── routes/
│   ├── index
│   ├── recipes
│   ├── favorites
│   ├── add-recipe
│   ├── edit-recipe
│   └── api
│
├── lib/
│   ├── utilities
│   └── backend functions
```

---

## 🔌 API Endpoints

```http
GET /api/recipes
GET /api/recipes/:id
POST /api/recipes
PUT /api/recipes/:id
DELETE /api/recipes/:id
```

---

## 🚀 Installation

### Clone repository

```bash
git clone https://github.com/naahxlya/cook-boss.git
```

### Access folder

```bash
cd cook-boss
```

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

---

## 📱 Responsiveness

The application was tested for:

* Desktop
* Tablet
* Mobile devices

---

## 📖 Academic Objectives Covered

This project covers the following course topics:

* Types of Web Applications
* Backlog Planning
* Wireframes
* Git and Version Control
* Branches and Merge
* Deploy and Hosting
* HTML
* CSS
* JavaScript
* React
* Node ecosystem
* APIs
* HTTP methods
* JSON data exchange
* CRUD implementation
* Testing and documentation

---

## 👩‍💻 Author

Developed by **Nathalya e Letícia** for academic purposes.

GitHub: https://github.com/naahxlya/cookboss

---

## 📄 License

This project is for educational purposes only.
