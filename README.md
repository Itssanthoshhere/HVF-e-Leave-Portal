
# 🛡️ HVF e-Leave Portal – React Edition

This is a modern React + TypeScript + Tailwind CSS implementation of **HVF e-Leave** — a web-based leave management system developed during an In-Plant Training at **Heavy Vehicles Factory (HVF), Avadi**, Ministry of Defence, Govt. of India.

> ⚙️ Built using Vite for super-fast local development.

---

## 📦 Tech Stack

- **Frontend Framework:** React + TypeScript
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **Component Structure:** Modular with reusable hooks & UI components

---

## 🧩 Folder Structure

```bash
hvf-e-leave-portal-react/
├── public/
│   └── images/               # Static assets
│       ├── hvfr.png
│       ├── favicon.ico
│       └── placeholder.svg
├── src/
│   ├── components/
│   │   └── ui/               # UI components like dashboards & forms
│   │       ├── AdminDashboard.tsx
│   │       ├── EmployeeDashboard.tsx
│   │       ├── LeaveApplicationForm.tsx
│   │       └── LoginForm.tsx
│   ├── hooks/                # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/                  # Utility functions
│   │   └── utils.ts
│   ├── pages/                # Routing pages
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── README.md
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── .gitignore
````

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/HVF-e-Leave-Portal.git
cd HVF-e-Leave-Portal
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the App

```bash
npm run dev
```

The app will be live at: `http://localhost:8080`

---

## 📑 Project Context

This project was developed as part of my **In-Plant Training at HVF, Avadi**. You can view the full [project report](./docs/HVF-eLeave-Report.pdf) and [certificate](./docs/HVF-Certificate.pdf) in the `/docs` folder.

---

## 🙏 Acknowledgements

* **Heavy Vehicles Factory, Avadi – Ministry of Defence**
* **Shri V. Sekar – JWM(SG)/T, ITC**
* **Bennett University** – B.Tech CSE (AI & ML)

---

## 📜 License

This project is for educational and internal demo purposes only.

```
