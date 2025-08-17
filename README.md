# Meta-U-Capstone-Project
## Lynk

**Deployed site**: <add a link to your deployment here, if you create one>

## Overview
Lynk is an intelligent professional networking platform that leverages AI-powered recommendations and vector search to help users build meaningful professional connections. The application combines traditional contact management with advanced machine learning capabilities to suggest relevant connections based on user profiles, interests, and professional backgrounds.


## Links
**Project Plan**: [doc](https://docs.google.com/document/d/1247j3yXhOr8HSFaHEmbuIilBysTZ2g5dqh01ur1Pmog) <br>

**Wireframes**: [here]<add a link to wire frames>
<img src="OR_INSERT_INLINE_YOUR_WIREFRAME_IMAGE_URL" width=600>

<add any other links here as you work on your project>

## Demo Video
[![Watch the video](https://github.com/user-attachments/assets/108cb011-0838-4005-b344-7a1e59b25eb8)](https://www.youtube.com/watch?v=2ap1pTe5oAA)






### Key Features
- **AI-Powered Contact Recommendations**: Uses vector embeddings and similarity search to suggest relevant professional connections
- **Multi-Method Contact Addition**: Add contacts manually, through external API search, or via AI recommendations
- **Interactive Network Analytics**: Visualize your professional network with D3.js-powered network graphs
- **Advanced Contact Management**: Comprehensive contact profiles with professional details, relationship tracking, and categorization
- **Real-time Search & Filtering**: Powerful search capabilities with industry, location, and role-based filtering
- **Secure Authentication**: Supabase-powered user authentication and profile management
- **Responsive Dashboard**: Modern, intuitive interface with quick stats, pinned contacts, and network insights

## Tech Stack

### Frontend
- **React 19** with Vite for fast development
- **Tailwind CSS** for modern, responsive styling
- **@Shadcn/ui** components (Radix UI-based) for accessible, customizable design
- **D3.js** for interactive network visualizations
- **React Router** for client-side routing
- **Framer Motion** for smooth animations

### Backend
- **Supabase** for database, authentication, storage, and vector embeddings
- **Together AI** for embedding generation
- **LangChain** for AI/ML pipeline integration
- **Clado API** for external contact search

### Key Libraries
- **@tanstack/react-table** for advanced data tables
- **react-force-graph-2d** for network visualizations
- **date-fns** for date manipulation
- **zod** for schema validation

## Core Features

### 1. Intelligent Contact Recommendations
- AI-powered suggestions based on user profile similarity
- Vector embeddings using BAAI/bge-base-en-v1.5 model
- Real-time filtering by industry, location, and professional criteria
- Infinite scroll for seamless browsing

### 2. Multi-Source Contact Addition
- **Manual Entry**: Comprehensive form with professional details, social media links, and custom tags
- **External Search**: Integration with Clado API for finding professionals by name, company, or school
- **AI Recommendations**: Smart suggestions based on your network and profile

### 3. Network Analytics Dashboard
- Interactive network visualization with D3.js
- Group contacts by industry, location, role, or relationship type
- Zoom, pan, and filter capabilities
- Real-time network statistics and insights

### 4. Advanced Contact Management
- Rich contact profiles with professional details
- Relationship tracking and categorization
- Contact pinning and quick actions
- Comprehensive search and filtering
- Bulk operations and data export

### 5. User Experience
- Modern, responsive design with dark/light mode support
- Real-time notifications and toast messages
- Loading states and error handling
- Mobile-friendly interface


## Project Structure

```
Lynk/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Main application pages
│   │   ├── context/         # React context providers
│   │   ├── hooks/           # Custom React hooks
│   │   └── lib/             # Utility functions
│   └── public/              # Static assets
├── backend/                  # Backend services
│   ├── services/            # AI/ML and external API services
│   ├── supabase/            # Database operations
│   └── seeds/               # Database seeding
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- Supabase account
- Together AI API key
- Clado API access

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yawbtng/Meta-U-Capstone.git
   cd Meta-U-Capstone/Lynk
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd frontend
   npm install
   
   # Backend
   cd ../backend
   npm install
   ```

3. **Environment Setup**
   Create `.env` files in both frontend and backend directories with:
   ```
   # Supabase
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Qdrant
   VITE_QDRANT_URL=your_qdrant_url
   VITE_QDRANT_API_KEY=your_qdrant_api_key
   VITE_QDRANT_COLLECTION_NAME=your_collection_name
   
   # Together AI
   VITE_TOGETHER_API_KEY=your_together_api_key
   
   # Clado API
   VITE_CLADO_API_KEY=your_clado_api_key
   ```

4. **Database Setup**
   ```bash
   cd backend
   npm run seed
   ```

5. **Start Development**
   ```bash
   # Frontend
   cd frontend
   npm run dev
   
   # Backend services run in the browser
   ```
