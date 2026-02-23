# Nexus Inventory Management System

A modern, full-featured inventory management system built with React and Vite. Nexus provides a sleek, dark-themed interface for managing items, orders, and team members with role-based access control.

![Nexus](https://img.shields.io/badge/Status-Active-green)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-7.3.1-purple)

## ✨ Features

- **📦 Inventory Management** - Track items with SKU, quantity, pricing, and stock levels
- **📊 Multiple View Modes** - Table, Grid, and Kanban board views
- **🔍 Advanced Search & Filtering** - Filter by category, status, location, and search
- **📈 Analytics Dashboard** - Real-time KPIs including total items, value, and margins
- **🛒 Purchase Orders** - Create and manage orders from suppliers
- **👥 Team Management** - Role-based access control (Admin, Manager, Viewer)
- **🤖 AI Command Palette** - AI-powered inventory commands (⌘K)
- **📱 Responsive Design** - Works seamlessly on all screen sizes
- **🎨 Dark Mode UI** - Beautiful, modern dark interface
- **💾 Local Storage** - Automatic data persistence

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HasanHimzawi/Inverntory.git
   cd Inverntory
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5173`
   - The application should now be running!

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 📖 How to Use

### 1. **Login**

The application starts with a login screen. Choose one of the demo users:

- **Admin** (Jordan Lee) - Full access to all features
- **Manager** (Sam Rivera) - Can manage inventory and orders
- **Viewer** (Casey Morgan) - Read-only access

Click on any user card to log in.

### 2. **Dashboard Overview**

After logging in, you'll see the main dashboard with:

- **Top Navigation** - Switch between Inventory, Orders, and Team tabs
- **KPI Strip** - Real-time statistics (Items, Units, Value, Low Stock, Margin)
- **Toolbar** - Search, filters, view modes, and action buttons
- **Content Area** - Your items displayed in the selected view mode

### 3. **Managing Inventory**

#### Adding Items
1. Click the **"Add Item"** button in the toolbar
2. Fill in the item details:
   - Name, Description, SKU
   - Category, Tags
   - Quantity, Min/Max Stock
   - Price, Cost
   - Supplier, Location
3. Click **"Save"** to add the item

#### Editing Items
1. Click on any item to view details in the side panel
2. Click the **Edit** button
3. Modify the fields
4. Click **"Save Changes"**

#### Bulk Operations
1. Enable checkboxes in table view
2. Select multiple items
3. Use bulk actions: Change status or Delete

### 4. **View Modes**

- **Table View** - Spreadsheet-style with sortable columns
- **Grid View** - Card-based layout with visual indicators
- **Kanban View** - Organize items by status (In Stock, Low Stock, Ordered, Discontinued)

### 5. **Filters & Search**

- **Search Bar** - Search by name, SKU, or description
- **Category Filter** - Filter by product category
- **Status Filter** - Filter by stock status
- **Location Filter** - Filter by warehouse/location

### 6. **Purchase Orders**

1. Navigate to the **Orders** tab
2. Click **"New Order"** button
3. Select supplier
4. Add line items with quantities
5. Add optional notes
6. Click **"Place Order"**

Track order status: Pending → Shipped → Delivered

### 7. **Team Management**

- Navigate to the **Team** tab
- View all team members with their roles and permissions
- See role-based access levels

### 8. **AI Command Palette** (Admin/Manager only)

- Press **⌘K** (Cmd+K) or click the AI button
- Type commands like:
  - "Add 25 USB-C cables at $9.99"
  - "Show low stock items"
  - "Update ELE-P3N2Q qty to 50"
- Press Enter to execute

### 9. **Keyboard Shortcuts**

- **⌘K** - Open AI command palette
- **/** - Focus search bar
- **ESC** - Close panels/modals
- **⌘S** - Quick save (in edit mode)

## 🛠 Technology Stack

- **Frontend Framework** - React 19.2.0
- **Build Tool** - Vite 7.3.1
- **UI Components** - Custom dark-themed components
- **Icons** - Lucide React
- **Charts** - Recharts
- **State Management** - React Hooks (useState, useEffect, useMemo)
- **Storage** - Browser LocalStorage
- **Styling** - Inline CSS-in-JS

## 📁 Project Structure

```
nexus-inventory/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   ├── App.jsx          # Main application component
│   ├── App.css          # Application styles
│   ├── index.css        # Global styles
│   └── main.jsx         # Application entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🔐 User Roles & Permissions

| Feature | Admin | Manager | Viewer |
|---------|-------|---------|--------|
| View Items | ✅ | ✅ | ✅ |
| Add/Edit Items | ✅ | ✅ | ❌ |
| Delete Items | ✅ | ❌ | ❌ |
| Manage Orders | ✅ | ✅ | ❌ |
| Manage Users | ✅ | ❌ | ❌ |
| Export Data | ✅ | ✅ | ❌ |
| AI Commands | ✅ | ✅ | ❌ |

## 🎯 Key Features Explained

### Stock Status Indicators
- **Green** - In Stock (above minimum)
- **Yellow** - Low Stock (below minimum threshold)
- **Blue** - Ordered (restocking in progress)
- **Gray** - Discontinued

### Categories
- Electronics ⚡
- Furniture 🪑
- Clothing 👕
- Food & Beverage 🍔
- Tools 🔧
- Office Supplies 📎
- Medical 🏥
- Raw Materials 🧱

### Locations
- Warehouse A
- Warehouse B
- Warehouse C
- Store Front
- Cold Storage
- Outdoor Yard

## 📊 Sample Data

The application comes pre-loaded with sample data including:
- 10 demo inventory items
- 5 suppliers
- 3 user roles
- Sample purchase orders

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Hasan Himzawi**
- GitHub: [@HasanHimzawi](https://github.com/HasanHimzawi)

## 🐛 Known Issues

- AI command palette is currently a UI demo (not connected to actual AI)
- No backend integration (data stored locally)
- No authentication system (demo users only)

## 🚧 Future Enhancements

- [ ] Backend API integration
- [ ] Real authentication system
- [ ] Multi-warehouse support
- [ ] Barcode scanning
- [ ] Email notifications
- [ ] Advanced reporting
- [ ] Mobile app version
- [ ] CSV/Excel import/export
- [ ] Real-time collaboration
- [ ] Integration with accounting software

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainer.

---

**Built with ❤️ using React + Vite**
