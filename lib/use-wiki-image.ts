"use client"
import { useEffect, useState } from "react"

const LOGOS: Record<string, string> = {
  "Ferrari": "https://upload.wikimedia.org/wikipedia/commons/d/d1/Scuderia_Ferrari_Logo.png",
  "McLaren": "https://upload.wikimedia.org/wikipedia/commons/5/5b/McLaren_logo_2024.png",
  "Red Bull": "https://upload.wikimedia.org/wikipedia/commons/7/7d/Red_Bull_Racing_logo.png",
  "Red Bull Racing": "https://upload.wikimedia.org/wikipedia/commons/7/7d/Red_Bull_Racing_logo.png",
  "Mercedes": "https://upload.wikimedia.org/wikipedia/commons/3/32/Mercedes_AMG_Petronas_F1_logo.png",
  "Aston Martin": "https://upload.wikimedia.org/wikipedia/commons/9/9f/Aston_Martin_F1_logo.png",
  "Alpine F1 Team": "https://upload.wikimedia.org/wikipedia/commons/1/18/BWT_Alpine_F1_Team_logo.png",
  "Williams": "https://upload.wikimedia.org/wikipedia/commons/8/88/Williams_Racing_logo.png",
  "RB F1 Team": "https://upload.wikimedia.org/wikipedia/commons/8/8d/RB_Formula_One_Team_logo.png",
  "Racing Bulls": "https://upload.wikimedia.org/wikipedia/commons/8/8d/RB_Formula_One_Team_logo.png",
  "Kick Sauber": "https://upload.wikimedia.org/wikipedia/commons/8/80/Stake_F1_Team_Kick_Sauber_logo.png",
  "Sauber": "https://upload.wikimedia.org/wikipedia/commons/8/80/Stake_F1_Team_Kick_Sauber_logo.png",
  "Haas F1 Team": "https://upload.wikimedia.org/wikipedia/commons/4/49/MoneyGram_Haas_F1_Team_logo.png",
  "Haas": "https://upload.wikimedia.org/wikipedia/commons/4/49/MoneyGram_Haas_F1_Team_logo.png",
}

export function useWikiImage(name: string, size = 200) {
  const [url, setUrl] = useState<string | null>(LOGOS[name] || null)
  useEffect(() => {
    if (LOGOS[name]) setUrl(LOGOS[name])
  }, [name])
  return url
}
