"use client"
import { createContext, useContext, useState, useEffect } from "react"
type Lang = "es" | "en"
export const LANGUAGES = [
  { code: "es" as Lang, label: "Español", flag: "🇪🇸" },
  { code: "en" as Lang, label: "English", flag: "🇬🇧" },
]
const nationalityMap: Record<string, string> = {
  "Dutch": "Neerlandés", "British": "Británico", "Monegasque": "Monegasco",
  "Spanish": "Español", "Mexican": "Mexicano", "Italian": "Italiano",
  "Australian": "Australiano", "New Zealander": "Neozelandés", "German": "Alemán",
  "Danish": "Danés", "Thai": "Tailandés", "Canadian": "Canadiense",
  "French": "Francés", "Chinese": "Chino", "Japanese": "Japonés",
  "American": "Estadounidense", "Finnish": "Finlandés", "Brazilian": "Brasileño",
  "Austrian": "Austríaco", "Swiss": "Suizo", "Argentine": "Argentino",
}
export function translateNationality(nat: string, lang: string) {
  if (lang === "es") return nationalityMap[nat] || nat
  return nat
}
const dict = {
  es: {
    "nav.live": "En Vivo", "nav.drivers": "Pilotos", "nav.teams": "Equipos", "nav.grid": "Parrilla", "nav.schedule": "Calendario", "nav.favorites": "Favoritos",
    "loading.season": "Cargando temporada...", "error.title": "Error al cargar", "error.sub": "Intenta más tarde",
    "live.timing": "Tiempos en Vivo", "live.lastRace": "Última Carrera", "live.awaiting": "Esperando datos...", "live.noSession": "No hay sesión en vivo. Mostrando última carrera.",
    "drivers.title": "Campeonato de Pilotos", "teams.title": "Campeonato de Constructores", "standings.afterRound": "Después de la ronda {round}",
    "grid.driversTitle": "Todos los Pilotos", "grid.driversSub": "Parrilla 2026", "grid.teamsTitle": "Todos los Equipos", "grid.teamsSub": "Constructores 2026",
    "calendar.title": "Calendario 2026", "calendar.rounds": "{count} carreras", "calendar.tapForDetails": "Toca una carrera para ver detalles",
    "fav.title": "Tus Favoritos", "fav.sub": "Pilotos y equipos que sigues", "footer.credit": "Datos por OpenF1 & Ergast • No oficial F1",
    "driver.nationality": "Nacionalidad", "driver.age": "Edad", "driver.code": "Código", "driver.position": "POSICIÓN", "driver.points": "PUNTOS", "driver.wins": "VICTORIAS", "driver.pts": "pts", "driver.yearsShort": "a",
    "driver.bio": "{name} es un piloto {nationality} que compite para {team} con el número {number}. Actualmente está en P{position} en el Campeonato de Pilotos 2026 con {points} puntos y {wins} victorias.",
    "team.nationality": "Nacionalidad", "team.base": "Base", "team.chief": "Jefe de Equipo", "team.powerUnit": "Motor", "team.position": "POSICIÓN", "team.points": "PUNTOS", "team.wins": "VICTORIAS", "team.lineup": "Alineación 2026",
    "team.bio": "{name} es un equipo {nationality} con base en {base}. Actualmente está en P{position} en el Campeonato de Constructores con {points} puntos y {wins} victorias.",
    // FIX - estas te faltaban
    "status.live": "EN VIVO",
    "status.upcoming": "PRÓXIMO",
    "status.finished": "FINALIZADO",
    "countdown.today": "Hoy",
    "countdown.inDays": "en {days} días",
    "auth.email": "Correo electrónico", "auth.emailPlaceholder": "tu@email.com", "auth.password": "Contraseña", "auth.or": "o", "auth.google": "Continuar con Google",
    "login.title": "Iniciar sesión", "login.subtitle": "Bienvenido de vuelta", "login.submit": "Entrar", "login.submitting": "Entrando...", "login.forgotShort": "¿Olvidaste?", "login.noAccount": "¿No tienes cuenta?", "login.signupLink": "Regístrate",
    "login.err.invalid": "Correo o contraseña incorrectos", "login.err.notConfirmed": "Confirma tu correo antes de entrar", "login.err.rate": "Demasiados intentos. Espera un momento", "login.err.generic": "No se pudo iniciar sesión",
    "signup.title": "Crear cuenta", "signup.subtitle": "Únete a Pitwall", "signup.passwordPlaceholder": "Mínimo 6 caracteres", "signup.submit": "Crear cuenta", "signup.submitting": "Creando cuenta...", "signup.haveAccount": "¿Ya tienes cuenta?", "signup.signinLink": "Inicia sesión",
    "signup.passwordMin": "La contraseña debe tener al menos 6 caracteres", "signup.err.exists": "Ese correo ya está registrado", "signup.err.generic": "No se pudo crear la cuenta",
    "signup.sentTitle": "Revisa tu correo", "signup.sentSubtitle": "Te enviamos un enlace", "signup.sentBody": "Enviamos un correo a {email} con un enlace para confirmar.", "signup.backToSignin": "Volver a iniciar sesión",
  },
  en: {
    "nav.live": "Live", "nav.drivers": "Drivers", "nav.teams": "Teams", "nav.grid": "Grid", "nav.schedule": "Schedule", "nav.favorites": "Favorites",
    "loading.season": "Loading season...", "error.title": "Error loading", "error.sub": "Try again later",
    "live.timing": "Live Timing", "live.lastRace": "Last Race", "live.awaiting": "Awaiting data...", "live.noSession": "No live session. Showing last race results.",
    "drivers.title": "Driver Championship", "teams.title": "Constructor Championship", "standings.afterRound": "After Round {round}",
    "grid.driversTitle": "All Drivers", "grid.driversSub": "2026 Grid", "grid.teamsTitle": "All Teams", "grid.teamsSub": "2026 Constructors",
    "calendar.title": "2026 Calendar", "calendar.rounds": "{count} races", "calendar.tapForDetails": "Tap a race for details",
    "fav.title": "Your Favorites", "fav.sub": "Drivers and teams you follow", "footer.credit": "Data by OpenF1 & Ergast • Not official F1",
    "driver.nationality": "Nationality", "driver.age": "Age", "driver.code": "Code", "driver.position": "POSITION", "driver.points": "POINTS", "driver.wins": "WINS", "driver.pts": "pts", "driver.yearsShort": "y",
    "driver.bio": "{name} is a {nationality} driver competing for {team} under number {number}. They currently sit P{position} in the 2026 Drivers' Championship on {points} points with {wins} wins.",
    "team.nationality": "Nationality", "team.base": "Base", "team.chief": "Team Chief", "team.powerUnit": "Power Unit", "team.position": "POSITION", "team.points": "POINTS", "team.wins": "WINS", "team.lineup": "2026 Lineup",
    "team.bio": "{name} is a {nationality} team based in {base}. They currently sit P{position} in the Constructors' Championship on {points} points with {wins} wins.",
    // FIX
    "status.live": "LIVE",
    "status.upcoming": "UPCOMING",
    "status.finished": "FINISHED",
    "countdown.today": "Today",
    "countdown.inDays": "in {days} days",
    "auth.email": "Email", "auth.emailPlaceholder": "you@email.com", "auth.password": "Password", "auth.or": "or", "auth.google": "Continue with Google",
    "login.title": "Sign in", "login.subtitle": "Welcome back", "login.submit": "Sign in", "login.submitting": "Signing in...", "login.forgotShort": "Forgot?", "login.noAccount": "Don't have an account?", "login.signupLink": "Sign up",
    "login.err.invalid": "Invalid email or password", "login.err.notConfirmed": "Confirm your email first", "login.err.rate": "Too many attempts. Wait a moment", "login.err.generic": "Could not sign in",
    "signup.title": "Create account", "signup.subtitle": "Join Pitwall", "signup.passwordPlaceholder": "At least 6 characters", "signup.submit": "Create account", "signup.submitting": "Creating account...", "signup.haveAccount": "Already have an account?", "signup.signinLink": "Sign in",
    "signup.passwordMin": "Password must be at least 6 characters", "signup.err.exists": "That email is already registered", "signup.err.generic": "Could not create account",
    "signup.sentTitle": "Check your email", "signup.sentSubtitle": "We sent you a confirmation link", "signup.sentBody": "We sent an email to {email} with a link to confirm.", "signup.backToSignin": "Back to sign in",
  }
}
const Ctx = createContext<any>(null)
export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("es")
  useEffect(() => { const s = localStorage.getItem("lang") as Lang; if (s) setLang(s) }, [])
  const setLangSave = (l: Lang) => { setLang(l); localStorage.setItem("lang", l) }
  const t = (k: string, p?: any) => {
    let txt: string = (dict[lang] as any)[k] || (dict["en"] as any)[k] || k
    if (p) Object.keys(p).forEach(x => txt = txt.replace(`{${x}}`, p[x]))
    return txt
  }
  const tNat = (n: string) => translateNationality(n, lang)
  return <Ctx.Provider value={{ t, lang, setLang: setLangSave, translateNationality: tNat }}>{children}</Ctx.Provider>
}
export const useI18n = () => useContext(Ctx)