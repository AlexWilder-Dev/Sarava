import { motion } from 'framer-motion'
import { useEffect, type ReactNode } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ActionBar, Fascia, Footer } from './components/Layout'
import { ModeProvider } from './lib/mode'
import Book from './pages/Book'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Visit from './pages/Visit'

const titles: Record<string, string> = {
  '/': 'Sarava · Crêpes, galettes & cocktails in Brixton Village',
  '/menu': 'Menu · Sarava, Brixton Village',
  '/book': 'Book a table · Sarava, Brixton Village',
  '/find-us': 'Find us · Sarava, Brixton Village',
}

function Page({ children }: { children: ReactNode }) {
  return (
    <motion.main
      id="main"
      tabIndex={-1}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.main>
  )
}

function Shell() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = titles[location.pathname] ?? titles['/']
  }, [location.pathname])

  return (
    <>
      <a className="skip" href="#main" onClick={(e) => {
        e.preventDefault()
        document.getElementById('main')?.focus()
      }}>
        Skip to content
      </a>
      <Fascia />
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Page><Home /></Page>} />
        <Route path="/menu" element={<Page><Menu /></Page>} />
        <Route path="/book" element={<Page><Book /></Page>} />
        <Route path="/find-us" element={<Page><Visit /></Page>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
      <ActionBar />
    </>
  )
}

export default function App() {
  return (
    <HashRouter>
      <ModeProvider>
        <Shell />
      </ModeProvider>
    </HashRouter>
  )
}
