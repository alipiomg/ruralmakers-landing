import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

// Layouts
import LandingLayout from './landing/LandingLayout'
import AppLayout from './app/AppLayout'
import AdminLayout from './admin/AdminLayout'

// Landing
import LandingHome from './landing/pages/Home'
import AppShowcase from './landing/pages/AppShowcase'
import Legal from './landing/pages/Legal'

// App pages
import Feed from './app/pages/Feed'
import FacenderasList from './app/pages/FacenderasList'
import FacenderaDetail from './app/pages/FacenderaDetail'
import FacenderaCreate from './app/pages/FacenderaCreate'
import MapView from './app/pages/MapView'
import Projects from './app/pages/Projects'
import ProjectDetail from './app/pages/ProjectDetail'
import Community from './app/pages/Community'
import Profile from './app/pages/Profile'
import Resources from './app/pages/Resources'
import RuralRoutes from './app/pages/RuralRoutes'
import Chat from './app/pages/Chat'
import Notifications from './app/pages/Notifications'
import Agenda from './app/pages/Agenda'
import Organizations from './app/pages/Organizations'
import Groups from './app/pages/Groups'
import RedDetail from './app/pages/RedDetail'

// Admin pages
import DashboardHome from './admin/pages/DashboardHome'
import LandingPreview from './admin/pages/LandingPreview'
import LandingOptimizer from './admin/pages/LandingOptimizer'
import AppHub from './admin/pages/AppHub'
import GoteoPreview from './admin/pages/GoteoPreview'
import VideoProduction from './admin/pages/VideoProduction'
import DescriptionManager from './admin/pages/DescriptionManager'
import CampaignPlanning from './admin/pages/CampaignPlanning'
import GoteoApi from './admin/pages/GoteoApi'
import GoteoOptimizer from './admin/pages/GoteoOptimizer'
import ContactCRM from './admin/pages/ContactCRM'
import ContentGenerator from './admin/pages/ContentGenerator'
import Templates from './admin/pages/Templates'
import PublishPanel from './admin/pages/PublishPanel'
import LandingAdmin from './admin/pages/LandingAdmin'
import HiggsFieldGenerator from './admin/pages/HiggsFieldGenerator'
import RewardsAdmin from './admin/pages/RewardsAdmin'
import ApiGuide from './admin/pages/ApiGuide'
import NewsletterLeads from './admin/pages/NewsletterLeads'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Landing publica */}
        <Route element={<LandingLayout />}>
          <Route index element={<LandingHome />} />
          <Route path="conoce-la-app" element={<AppShowcase />} />
          <Route path="legal" element={<Legal />} />
          <Route path="legal/cookies" element={<Legal />} />
          <Route path="legal/privacidad" element={<Legal />} />
          <Route path="legal/aviso-legal" element={<Legal />} />
          <Route path="legal/condiciones-uso" element={<Legal />} />
        </Route>

        {/* App Rural Makers */}
        <Route path="app" element={<AppLayout />}>
          <Route index element={<Feed />} />
          <Route path="facenderas" element={<FacenderasList />} />
          <Route path="facenderas/:id" element={<FacenderaDetail />} />
          <Route path="facenderas/crear" element={<FacenderaCreate />} />
          <Route path="mapa" element={<MapView />} />
          <Route path="proyectos" element={<Projects />} />
          <Route path="proyectos/:id" element={<ProjectDetail />} />
          <Route path="comunidad" element={<Community />} />
          <Route path="perfil" element={<Profile />} />
          <Route path="recursos" element={<Resources />} />
          <Route path="rutas" element={<RuralRoutes />} />
          <Route path="chat" element={<Chat />} />
          <Route path="notificaciones" element={<Notifications />} />
          <Route path="agenda" element={<Agenda />} />
          <Route path="organizaciones" element={<Organizations />} />
          <Route path="grupos" element={<Groups />} />
          <Route path="redes/:slug" element={<RedDetail />} />
        </Route>

        {/* Admin Dashboard */}
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="landing" element={<LandingPreview />} />
          <Route path="landing-optimizer" element={<LandingOptimizer />} />
          <Route path="app-hub" element={<AppHub />} />
          <Route path="goteo-preview" element={<GoteoPreview />} />
          <Route path="video" element={<VideoProduction />} />
          <Route path="description" element={<DescriptionManager />} />
          <Route path="planning" element={<CampaignPlanning />} />
          <Route path="goteo-optimizer" element={<GoteoOptimizer />} />
          <Route path="goteo-api" element={<GoteoApi />} />
          <Route path="crm" element={<ContactCRM />} />
          <Route path="newsletter" element={<NewsletterLeads />} />
          <Route path="content-generator" element={<ContentGenerator />} />
          <Route path="templates" element={<Templates />} />
          <Route path="publish" element={<PublishPanel />} />
          <Route path="landing-admin" element={<LandingAdmin />} />
          <Route path="higgsfield" element={<HiggsFieldGenerator />} />
          <Route path="rewards" element={<RewardsAdmin />} />
          <Route path="api-guide" element={<ApiGuide />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
