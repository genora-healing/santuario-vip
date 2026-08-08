import React, { useState, useEffect, useRef } from 'react';
 
/* ============================================================
   SANTUARIO GENORA — Micro-app VIP independiente
   Entrega rápida de carpetas de frecuencias personalizadas
   ============================================================ */
 
const GOLD = '#d4af37';
const BG = '#020617';
 
// ---- CONFIGURACIÓN: WhatsApp de contacto ----
// ⚠️ Reemplaza por tu número real con código de país, sin +, sin espacios (ej: 573001234567)
const WHATSAPP_NUMBER = '573000000000';
const WHATSAPP_MSG_ES = encodeURIComponent('Hola Pamela, necesito acompañamiento o un nuevo código de acceso al Santuario GENORA 🙏✨');
const WHATSAPP_MSG_EN = encodeURIComponent('Hi Pamela, I need support or a new access code for Santuario GENORA 🙏✨');
 
// ---- Traducciones ----
const T = {
  es: {
    sanctuaryTitle: 'SANTUARIO GENORA',
    noTokenMsg: 'Este espacio requiere un enlace de acceso VIP personalizado.',
    enterBtn: 'Entrar',
    privacyNote: '✦ Espacio exclusivo para miembros VIP. Tu código y enlace de acceso son de uso personal e intransferible.',
    conflictMsg1: '✦ Este enlace de acompañamiento exclusivo ya se encuentra activo en otro dispositivo.',
    conflictMsg2: 'Si cambiaste de teléfono o necesitas asistencia, contacta directamente a Pamela.',
    contactBtn: '✦ Contactar a Pamela',
    checking: 'Sintonizando tu acceso...',
    welcomeHi: 'BIENVENIDA A TU ESPACIO',
    welcomeSubtext: 'Tu espacio personal de frecuencias te espera.',
    whatsappFooter: '✦ ¿Necesitas acompañamiento o un nuevo código? Contacta a Pamela',
  },
  en: {
    sanctuaryTitle: 'SANTUARIO GENORA',
    noTokenMsg: 'This space requires a personalized VIP access link.',
    enterBtn: 'Enter',
    privacyNote: '✦ Exclusive space for VIP members. Your code and access link are personal and non-transferable.',
    conflictMsg1: '✦ This exclusive companion link is already active on another device.',
    conflictMsg2: 'If you changed phones or need assistance, contact Pamela directly.',
    contactBtn: '✦ Contact Pamela',
    checking: 'Tuning in your access...',
    welcomeHi: 'WELCOME TO YOUR SPACE',
    welcomeSubtext: 'Your personal frequency space awaits.',
    whatsappFooter: '✦ Need support or a new code? Contact Pamela',
  },
};
 
 
const TRACKS = [
  { id: 'vital-restore', type: 'audio', title: 'Vital Restore', description: 'Restauracion vital y recuperacion de energia.', description_en: 'Vital restoration and energy recovery.', duration: '60 min', src: 'https://genora-global-frecuencias.s3.us-east-2.amazonaws.com/vital-restore.wav' },
  { id: 'energy-full-reset', type: 'audio', title: 'Energy Full Reset', description: 'Limpieza de oscuridad y recalibracion de energia.', description_en: 'Clearing of darkness and energy recalibration.', duration: '60 min', src: 'https://genora-global-frecuencias.s3.us-east-2.amazonaws.com/energy-full-reset.wav' },
  { id: 'business-magnet', type: 'audio', title: 'Business Magnet', description: 'Frecuencia para atraer clientes y dinero, expansion de tu empresa.', description_en: 'Frequency to attract clients and money, business expansion.', duration: '60 min', src: 'https://genora-global-frecuencias.s3.us-east-2.amazonaws.com/business-magnet.wav' },
  { id: 'lucky-flow', type: 'audio', title: 'Lucky Flow', description: 'Frecuencia para ganar la loteria, ganar dinero y sintonizar con la buena suerte — el poder interior.', description_en: 'Frequency to win the lottery, earn money, and tune into good luck — your inner power.', duration: '60 min', src: 'https://genora-global-frecuencias.s3.us-east-2.amazonaws.com/lucky-flow.wav' },
  { id: 'lumina', type: 'audio', title: 'Lumina', description: 'Claridad mental.', description_en: 'Mental clarity.', duration: '60 min', src: 'https://genora-global-frecuencias.s3.us-east-2.amazonaws.com/lumina.wav' },
  { id: 'momentum', type: 'audio', title: 'Momentum', description: 'Frecuencia para deshacer situaciones y facilitar cambios — tambien asociada a ganar loteria.', description_en: 'Frequency to dissolve stuck situations and facilitate change — also associated with winning the lottery.', duration: '60 min', src: 'https://genora-global-frecuencias.s3.us-east-2.amazonaws.com/momentum.wav' },
  { id: 'crystal-reset', type: 'audio', title: 'Crystal Reset', description: 'Purificacion de cristales.', description_en: 'Crystal purification.', duration: '60 min', src: 'https://genora-global-frecuencias.s3.us-east-2.amazonaws.com/crystal-reset.wav' },
  { id: 'mental-flow-balance', type: 'audio', title: 'Mental Flow Balance', description: 'Equilibrio mental, desactivacion de dialogos mentales.', description_en: 'Mental balance, quieting of mental chatter.', duration: '60 min', src: 'https://genora-global-frecuencias.s3.us-east-2.amazonaws.com/mental-flow-balance.wav' },
  { id: 'safe-within', type: 'audio', title: 'Safe Within', description: 'Desactivacion de miedos y ansiedades profundas, recuperacion del equilibrio interior.', description_en: 'Release of deep fears and anxiety, restoring inner balance.', duration: '60 min', src: 'https://genora-global-frecuencias.s3.us-east-2.amazonaws.com/safe-within.wav' },
];
 
const WAVE_RINGS = [
  { delay: '0s', d: 'M 186.00,100.00 C 188.29,103.74 191.51,108.12 192.13,112.13 C 192.76,116.14 191.88,120.59 189.76,124.05 C 187.65,127.52 183.00,130.33 179.45,132.91 C 175.91,135.49 171.27,137.00 168.48,139.54 C 165.69,142.07 164.01,144.59 162.73,148.14 C 161.45,151.68 161.84,156.55 160.81,160.81 C 159.78,165.08 158.96,170.45 156.57,173.72 C 154.18,177.00 150.41,179.52 146.46,180.48 C 142.52,181.43 137.24,180.14 132.91,179.45 C 128.58,178.77 124.23,176.55 120.47,176.38 C 116.70,176.20 113.73,176.79 110.32,178.40 C 106.91,180.00 103.74,183.71 100.00,186.00 C 96.26,188.29 91.88,191.51 87.87,192.13 C 83.86,192.76 79.41,191.88 75.95,189.76 C 72.48,187.65 69.67,183.00 67.09,179.45 C 64.51,175.91 63.00,171.27 60.46,168.48 C 57.93,165.69 55.41,164.01 51.86,162.73 C 48.32,161.45 43.45,161.84 39.19,160.81 C 34.92,159.78 29.55,158.96 26.28,156.57 C 23.00,154.18 20.48,150.41 19.52,146.46 C 18.57,142.52 19.86,137.24 20.55,132.91 C 21.23,128.58 23.45,124.23 23.62,120.47 C 23.80,116.70 23.21,113.73 21.60,110.32 C 20.00,106.91 16.29,103.74 14.00,100.00 C 11.71,96.26 8.49,91.88 7.87,87.87 C 7.24,83.86 8.12,79.41 10.24,75.95 C 12.35,72.48 17.00,69.67 20.55,67.09 C 24.09,64.51 28.73,63.00 31.52,60.46 C 34.31,57.93 35.99,55.41 37.27,51.86 C 38.55,48.32 38.16,43.45 39.19,39.19 C 40.22,34.92 41.04,29.55 43.43,26.28 C 45.82,23.00 49.59,20.48 53.54,19.52 C 57.48,18.57 62.76,19.86 67.09,20.55 C 71.42,21.23 75.77,23.45 79.53,23.62 C 83.30,23.80 86.27,23.21 89.68,21.60 C 93.09,20.00 96.26,16.29 100.00,14.00 C 103.74,11.71 108.12,8.49 112.13,7.87 C 116.14,7.24 120.59,8.12 124.05,10.24 C 127.52,12.35 130.33,17.00 132.91,20.55 C 135.49,24.09 137.00,28.73 139.54,31.52 C 142.07,34.31 144.59,35.99 148.14,37.27 C 151.68,38.55 156.55,38.16 160.81,39.19 C 165.08,40.22 170.45,41.04 173.72,43.43 C 177.00,45.82 179.52,49.59 180.48,53.54 C 181.43,57.48 180.14,62.76 179.45,67.09 C 178.77,71.42 176.55,75.77 176.38,79.53 C 176.20,83.30 176.79,86.27 178.40,89.68 C 180.00,93.09 183.71,96.26 186.00,100.00 Z' },
  { delay: '0.8s', d: 'M 191.15,100.00 C 192.90,103.85 193.98,108.43 193.07,112.25 C 192.16,116.08 188.76,119.85 185.70,122.96 C 182.64,126.08 177.70,128.26 174.69,130.94 C 171.69,133.62 169.09,135.77 167.66,139.06 C 166.22,142.36 166.60,146.46 166.07,150.70 C 165.54,154.93 165.94,160.49 164.46,164.46 C 162.97,168.42 160.50,172.41 157.15,174.48 C 153.80,176.54 148.73,176.80 144.36,176.84 C 139.99,176.87 134.96,174.92 130.94,174.69 C 126.92,174.46 123.56,174.15 120.22,175.46 C 116.88,176.77 114.24,179.95 110.87,182.57 C 107.50,185.18 103.85,189.40 100.00,191.15 C 96.15,192.90 91.57,193.98 87.75,193.07 C 83.92,192.16 80.15,188.76 77.04,185.70 C 73.92,182.64 71.74,177.70 69.06,174.69 C 66.38,171.69 64.23,169.09 60.94,167.66 C 57.64,166.22 53.54,166.60 49.30,166.07 C 45.07,165.54 39.51,165.94 35.54,164.46 C 31.58,162.97 27.59,160.50 25.52,157.15 C 23.46,153.80 23.20,148.73 23.16,144.36 C 23.13,139.99 25.08,134.96 25.31,130.94 C 25.54,126.92 25.85,123.56 24.54,120.22 C 23.23,116.88 20.05,114.24 17.43,110.87 C 14.82,107.50 10.60,103.85 8.85,100.00 C 7.10,96.15 6.02,91.57 6.93,87.75 C 7.84,83.92 11.24,80.15 14.30,77.04 C 17.36,73.92 22.30,71.74 25.31,69.06 C 28.31,66.38 30.91,64.23 32.34,60.94 C 33.78,57.64 33.40,53.54 33.93,49.30 C 34.46,45.07 34.06,39.51 35.54,35.54 C 37.03,31.58 39.50,27.59 42.85,25.52 C 46.20,23.46 51.27,23.20 55.64,23.16 C 60.01,23.13 65.04,25.08 69.06,25.31 C 73.08,25.54 76.44,25.85 79.78,24.54 C 83.12,23.23 85.76,20.05 89.13,17.43 C 92.50,14.82 96.15,10.60 100.00,8.85 C 103.85,7.10 108.43,6.02 112.25,6.93 C 116.08,7.84 119.85,11.24 122.96,14.30 C 126.08,17.36 128.26,22.30 130.94,25.31 C 133.62,28.31 135.77,30.91 139.06,32.34 C 142.36,33.78 146.46,33.40 150.70,33.93 C 154.93,34.46 160.49,34.06 164.46,35.54 C 168.42,37.03 172.41,39.50 174.48,42.85 C 176.54,46.20 176.80,51.27 176.84,55.64 C 176.87,60.01 174.92,65.04 174.69,69.06 C 174.46,73.08 174.15,76.44 175.46,79.78 C 176.77,83.12 179.95,85.76 182.57,89.13 C 185.18,92.50 189.40,96.15 191.15,100.00 Z' },
  { delay: '1.6s', d: 'M 193.88,100.00 C 194.27,103.91 192.59,108.30 190.34,111.89 C 188.09,115.48 183.43,118.54 180.40,121.54 C 177.37,124.54 173.90,126.74 172.17,129.89 C 170.44,133.04 170.34,136.42 170.04,140.44 C 169.75,144.46 171.03,149.71 170.42,154.04 C 169.81,158.36 168.88,163.34 166.39,166.39 C 163.89,169.43 159.60,171.34 155.47,172.29 C 151.34,173.24 145.88,172.10 141.62,172.08 C 137.36,172.06 133.34,171.16 129.89,172.17 C 126.45,173.18 123.98,175.49 120.93,178.12 C 117.88,180.76 115.07,185.38 111.59,188.00 C 108.10,190.63 103.91,193.49 100.00,193.88 C 96.09,194.27 91.70,192.59 88.11,190.34 C 84.52,188.09 81.46,183.43 78.46,180.40 C 75.46,177.37 73.26,173.90 70.11,172.17 C 66.96,170.44 63.58,170.34 59.56,170.04 C 55.54,169.75 50.29,171.03 45.96,170.42 C 41.64,169.81 36.66,168.88 33.61,166.39 C 30.57,163.89 28.66,159.60 27.71,155.47 C 26.76,151.34 27.90,145.88 27.92,141.62 C 27.94,137.36 28.84,133.34 27.83,129.89 C 26.82,126.45 24.51,123.98 21.88,120.93 C 19.24,117.88 14.62,115.07 12.00,111.59 C 9.37,108.10 6.51,103.91 6.12,100.00 C 5.73,96.09 7.41,91.70 9.66,88.11 C 11.91,84.52 16.57,81.46 19.60,78.46 C 22.63,75.46 26.10,73.26 27.83,70.11 C 29.56,66.96 29.66,63.58 29.96,59.56 C 30.25,55.54 28.97,50.29 29.58,45.96 C 30.19,41.64 31.12,36.66 33.61,33.61 C 36.11,30.57 40.40,28.66 44.53,27.71 C 48.66,26.76 54.12,27.90 58.38,27.92 C 62.64,27.94 66.66,28.84 70.11,27.83 C 73.55,26.82 76.02,24.51 79.07,21.88 C 82.12,19.24 84.93,14.62 88.41,12.00 C 91.90,9.37 96.09,6.51 100.00,6.12 C 103.91,5.73 108.30,7.41 111.89,9.66 C 115.48,11.91 118.54,16.57 121.54,19.60 C 124.54,22.63 126.74,26.10 129.89,27.83 C 133.04,29.56 136.42,29.66 140.44,29.96 C 144.46,30.25 149.71,28.97 154.04,29.58 C 158.36,30.19 163.34,31.12 166.39,33.61 C 169.43,36.11 171.34,40.40 172.29,44.53 C 173.24,48.66 172.10,54.12 172.08,58.38 C 172.06,62.64 171.16,66.66 172.17,70.11 C 173.18,73.55 175.49,76.02 178.12,79.07 C 180.76,82.12 185.38,84.93 188.00,88.41 C 190.63,91.90 193.49,96.09 193.88,100.00 Z' },
  { delay: '2.4s', d: 'M 192.91,100.00 C 191.75,103.89 187.98,107.81 185.22,111.22 C 182.46,114.63 178.38,117.28 176.36,120.46 C 174.33,123.63 173.38,126.51 173.07,130.27 C 172.77,134.03 174.41,138.64 174.52,143.02 C 174.63,147.41 175.21,152.81 173.74,156.58 C 172.27,160.36 169.26,163.76 165.69,165.69 C 162.12,167.63 156.69,167.73 152.33,168.19 C 147.96,168.65 143.20,167.65 139.52,168.46 C 135.85,169.27 133.14,170.63 130.27,173.07 C 127.39,175.52 125.29,179.93 122.27,183.11 C 119.25,186.29 115.84,190.52 112.13,192.16 C 108.42,193.79 103.89,194.06 100.00,192.91 C 96.11,191.75 92.19,187.98 88.78,185.22 C 85.37,182.46 82.72,178.38 79.54,176.36 C 76.37,174.33 73.49,173.38 69.73,173.07 C 65.97,172.77 61.36,174.41 56.98,174.52 C 52.59,174.63 47.19,175.21 43.42,173.74 C 39.64,172.27 36.24,169.26 34.31,165.69 C 32.37,162.12 32.27,156.69 31.81,152.33 C 31.35,147.96 32.35,143.20 31.54,139.52 C 30.73,135.85 29.37,133.14 26.93,130.27 C 24.48,127.39 20.07,125.29 16.89,122.27 C 13.71,119.25 9.48,115.84 7.84,112.13 C 6.21,108.42 5.94,103.89 7.09,100.00 C 8.25,96.11 12.02,92.19 14.78,88.78 C 17.54,85.37 21.62,82.72 23.64,79.54 C 25.67,76.37 26.62,73.49 26.93,69.73 C 27.23,65.97 25.59,61.36 25.48,56.98 C 25.37,52.59 24.79,47.19 26.26,43.42 C 27.73,39.64 30.74,36.24 34.31,34.31 C 37.88,32.37 43.31,32.27 47.67,31.81 C 52.04,31.35 56.80,32.35 60.48,31.54 C 64.15,30.73 66.86,29.37 69.73,26.93 C 72.61,24.48 74.71,20.07 77.73,16.89 C 80.75,13.71 84.16,9.48 87.87,7.84 C 91.58,6.21 96.11,5.94 100.00,7.09 C 103.89,8.25 107.81,12.02 111.22,14.78 C 114.63,17.54 117.28,21.62 120.46,23.64 C 123.63,25.67 126.51,26.62 130.27,26.93 C 134.03,27.23 138.64,25.59 143.02,25.48 C 147.41,25.37 152.81,24.79 156.58,26.26 C 160.36,27.73 163.76,30.74 165.69,34.31 C 167.63,37.88 167.73,43.31 168.19,47.67 C 168.65,52.04 167.65,56.80 168.46,60.48 C 169.27,64.15 170.63,66.86 173.07,69.73 C 175.52,72.61 179.93,74.71 183.11,77.73 C 186.29,80.75 190.52,84.16 192.16,87.87 C 193.79,91.58 194.06,96.11 192.91,100.00 Z' },
  { delay: '3.2s', d: 'M 188.68,100.00 C 186.52,103.80 182.32,107.18 180.12,110.55 C 177.92,113.92 175.99,116.67 175.47,120.22 C 174.95,123.78 176.39,127.66 176.98,131.89 C 177.56,136.11 179.39,141.38 178.97,145.59 C 178.55,149.80 177.18,154.29 174.47,157.14 C 171.76,160.00 166.92,161.54 162.71,162.71 C 158.49,163.87 153.14,163.29 149.20,164.11 C 145.26,164.94 141.95,165.52 139.07,167.66 C 136.18,169.81 134.46,173.57 131.89,176.98 C 129.31,180.38 126.87,185.40 123.60,188.08 C 120.33,190.76 116.19,192.96 112.25,193.06 C 108.32,193.16 103.80,190.84 100.00,188.68 C 96.20,186.52 92.82,182.32 89.45,180.12 C 86.08,177.92 83.33,175.99 79.78,175.47 C 76.22,174.95 72.34,176.39 68.11,176.98 C 63.89,177.56 58.62,179.39 54.41,178.97 C 50.20,178.55 45.71,177.18 42.86,174.47 C 40.00,171.76 38.46,166.92 37.29,162.71 C 36.13,158.49 36.71,153.14 35.89,149.20 C 35.06,145.26 34.48,141.95 32.34,139.07 C 30.19,136.18 26.43,134.46 23.02,131.89 C 19.62,129.31 14.60,126.87 11.92,123.60 C 9.24,120.33 7.04,116.19 6.94,112.25 C 6.84,108.32 9.16,103.80 11.32,100.00 C 13.48,96.20 17.68,92.82 19.88,89.45 C 22.08,86.08 24.01,83.33 24.53,79.78 C 25.05,76.22 23.61,72.34 23.02,68.11 C 22.44,63.89 20.61,58.62 21.03,54.41 C 21.45,50.20 22.82,45.71 25.53,42.86 C 28.24,40.00 33.08,38.46 37.29,37.29 C 41.51,36.13 46.86,36.71 50.80,35.89 C 54.74,35.06 58.05,34.48 60.93,32.34 C 63.82,30.19 65.54,26.43 68.11,23.02 C 70.69,19.62 73.13,14.60 76.40,11.92 C 79.67,9.24 83.81,7.04 87.75,6.94 C 91.68,6.84 96.20,9.16 100.00,11.32 C 103.80,13.48 107.18,17.68 110.55,19.88 C 113.92,22.08 116.67,24.01 120.22,24.53 C 123.78,25.05 127.66,23.61 131.89,23.02 C 136.11,22.44 141.38,20.61 145.59,21.03 C 149.80,21.45 154.29,22.82 157.14,25.53 C 160.00,28.24 161.54,33.08 162.71,37.29 C 163.87,41.51 163.29,46.86 164.11,50.80 C 164.94,54.74 165.52,58.05 167.66,60.93 C 169.81,63.82 173.57,65.54 176.98,68.11 C 180.38,70.69 185.40,73.13 188.08,76.40 C 190.76,79.67 192.96,83.81 193.06,87.75 C 193.16,91.68 190.84,96.20 188.68,100.00 Z' },
];
 
const inlineStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600&display=swap');
  * { box-sizing: border-box; }
  .sg-root {
    min-height: 100vh;
    width: 100%;
    background: ${BG};
    color: #f5eddc;
    font-family: 'Inter', -apple-system, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 20px 100px;
    position: relative;
    overflow-x: hidden;
  }
  .sg-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background: radial-gradient(circle at 50% 20%, rgba(212,175,55,0.08), transparent 60%);
    pointer-events: none;
    z-index: 0;
  }
  .sg-content { position: relative; z-index: 1; width: 100%; max-width: 420px; display: flex; flex-direction: column; align-items: center; }
 
  /* ---- Header fijo: logo + selector de idioma ---- */
  .sg-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    width: 100%;
    margin-bottom: 16px;
    padding-top: 4px;
  }
  .sg-header-logo { height: 52px; width: 52px; border-radius: 50%; object-fit: contain; }
  .sg-lang-toggle {
    display: flex;
    border: 1px solid rgba(212,175,55,0.35);
    border-radius: 20px;
    overflow: hidden;
  }
  .sg-lang-btn {
    background: none; border: none; cursor: pointer;
    color: rgba(245,237,220,0.35);
    font-family: 'Montserrat', sans-serif;
    font-size: 10px; font-weight: 200; letter-spacing: 2px;
    padding: 5px 12px;
    transition: all 0.2s ease;
  }
  .sg-lang-btn.active { background: rgba(212,175,55,0.1); color: ${GOLD}; }
 
  @keyframes aura-gold-santuario {
    0%, 100% { transform: scale(1); box-shadow: 0 0 50px 0 rgba(230,205,150,0.3), 0 0 100px 0 rgba(230,205,150,0.15); }
    50% { transform: scale(1.03); box-shadow: 0 0 90px 10px rgba(230,205,150,0.6), 0 0 180px 20px rgba(230,205,150,0.35), 0 0 300px 40px rgba(230,205,150,0.15); }
  }
  .sg-orb-wrap {
    width: 140px; height: 140px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 26px;
    overflow: visible;
  }
  .sg-gold-filter {
    /* Dorado champan suave: sepia completo quita el azul/violeta base, resto aclara y da un toque calido */
    filter: sepia(1) saturate(1.7) hue-rotate(2deg) brightness(1.3) contrast(0.9);
  }
  .sg-orb-img {
    width: 100%; height: 100%;
    object-fit: contain;
    border-radius: 50%;
    background: rgba(2,6,23,0.92);
    animation: aura-gold-santuario 5s ease-in-out infinite;
  }
 
  .sg-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 22px;
    letter-spacing: 6px;
    color: ${GOLD};
    text-align: center;
    margin: 0 0 12px;
    font-weight: 500;
  }
  .sg-subtext {
    text-align: center;
    color: rgba(245,237,220,0.6);
    font-size: 13.5px;
    font-weight: 300;
    line-height: 1.7;
    letter-spacing: 0.3px;
    max-width: 320px;
    margin: 0 0 32px;
  }
 
  .sg-btn-primary {
    width: 100%;
    max-width: 300px;
    background: linear-gradient(135deg, ${GOLD}, #b8933f);
    border: none;
    border-radius: 30px;
    padding: 14px 22px;
    color: #020617;
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    letter-spacing: 2.5px;
    font-size: 12.5px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 6px 24px rgba(212,175,55,0.25);
  }
  .sg-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(212,175,55,0.4); }
  .sg-btn-primary:active { transform: translateY(0); }
 
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
 
  .sg-greeting { text-align: center; margin-bottom: 24px; }
  .sg-greeting-hi { font-family: 'Montserrat', sans-serif; font-size: 11px; letter-spacing: 3.5px; color: rgba(212,175,55,0.7); text-transform: uppercase; margin-bottom: 6px; font-weight: 500; }
  .sg-greeting-title { font-family: 'Montserrat', sans-serif; font-size: 19px; color: #f5eddc; font-weight: 500; letter-spacing: 1px; }
 
  /* ---- Tarjetas: mismo lenguaje visual que la app original (TrackCard) ---- */
  .sg-card-list { width: 100%; display: flex; flex-direction: column; gap: 10px; align-items: center; }
  .sg-card {
    width: 100%;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.1);
    border-left: 4px solid rgba(230,205,150,0.85);
    border-radius: 28px;
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    transition: all 0.25s ease;
    animation: fadeInUp 0.5s ease backwards;
  }
  .sg-card:active { transform: scale(0.98); }
  .sg-card:hover { background: rgba(230,205,150,0.05); }
  .sg-card-type { font-size: 9.5px; color: rgba(230,205,150,0.6); letter-spacing: 2px; font-weight: 300; margin-bottom: 4px; text-transform: uppercase; }
  .sg-card-body { flex: 1; min-width: 0; text-align: left; }
  .sg-card-title { font-size: 14px; color: #f5eddc; font-weight: 500; margin-bottom: 3px; letter-spacing: 0.2px; }
  .sg-card-desc { font-size: 11px; color: rgba(245,237,220,0.5); font-weight: 300; line-height: 1.4; }
  .sg-card-play {
    flex-shrink: 0;
    width: 24px; height: 24px;
    display: flex; align-items: center; justify-content: center;
    color: #e6cd96;
    font-size: 15px;
  }
 
  .sg-back {
    align-self: flex-start;
    background: rgba(230,205,150,0.08);
    border: 1px solid rgba(230,205,150,0.5);
    color: #e6cd96;
    font-size: 20px;
    cursor: pointer;
    margin-bottom: 20px;
    display: flex; align-items: center; justify-content: center;
    width: 42px; height: 42px;
    border-radius: 50%;
    transition: all 0.2s ease;
  }
  .sg-back:hover { border-color: ${GOLD}; color: ${GOLD}; background: rgba(230,205,150,0.15); }
 
  /* ---- Reproductor Templo Dorado ---- */
  .sg-player { display: flex; flex-direction: column; align-items: center; width: 100%; padding-top: 4px; }
  .sg-player-track-title { font-family: 'Montserrat', sans-serif; font-size: 17px; color: #f5eddc; text-align: center; margin: 22px 0 6px; font-weight: 500; letter-spacing: 1px; }
  .sg-player-track-desc { font-size: 12.5px; font-weight: 300; color: rgba(245,237,220,0.5); text-align: center; max-width: 290px; margin-bottom: 6px; line-height: 1.5; }
  .sg-player-duration { font-size: 11px; color: rgba(212,175,55,0.7); letter-spacing: 1px; margin-bottom: 30px; font-weight: 300; }
 
  .sg-templo-orb-container {
    position: relative;
    display: flex; align-items: center; justify-content: center;
    width: 170px; height: 170px;
    margin-bottom: 12px;
    overflow: visible !important;
    will-change: transform, opacity;
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
  }
  .sg-templo-core {
    position: relative; z-index: 2;
    width: 62%; height: 62%;
    border-radius: 50%;
    background: rgba(2,6,23,0.92);
    overflow: hidden;
    display: flex; align-items: center; justify-content: center;
    animation: aura-gold-santuario 5s ease-in-out infinite;
  }
  .sg-templo-core video { width: 100%; height: 100%; object-fit: cover; }
  .sg-templo-wave-svg {
    position: absolute; top: 0; left: 0;
    width: 100%; height: 100%;
    overflow: visible !important;
    pointer-events: none;
    z-index: 1;
  }
  @keyframes sg-etherealWave {
    0%   { transform: scale(0.5) translateZ(0);   opacity: 0.85; }
    35%  { opacity: 0.6; }
    70%  { opacity: 0.25; }
    100% { transform: scale(3.0) translateZ(0); opacity: 0; }
  }
  @keyframes sg-haloBlurTravel {
    0%   { opacity: 1; }
    35%  { opacity: 0.95; }
    70%  { opacity: 0.75; }
    100% { opacity: 0; }
  }
  .sg-templo-wave-group {
    transform-box: fill-box; transform-origin: 50% 50%;
    animation: sg-etherealWave 4s ease-out infinite;
    will-change: transform, opacity;
    backface-visibility: hidden;
  }
  .sg-templo-wave-group.paused {
    animation: none !important;
    opacity: 0 !important;
  }
  .sg-templo-wave-group.paused .sg-templo-wave-halo {
    animation: none !important;
    opacity: 0 !important;
  }
  .sg-templo-wave-group.paused .sg-templo-wave-line {
    opacity: 0 !important;
  }
  .sg-templo-wave-halo {
    fill: none;
    stroke: rgba(230, 205, 150, 0.9);
    stroke-width: 14px;
    filter: blur(5px);
    transform-box: fill-box; transform-origin: 50% 50%;
    animation: sg-haloBlurTravel 4s ease-out infinite;
    will-change: opacity;
    backface-visibility: hidden;
  }
  .sg-templo-wave-line {
    fill: none;
    stroke: #f5ecd8;
    stroke-width: 1.5px;
    vector-effect: non-scaling-stroke;
    filter: drop-shadow(0 0 6px #d9c295) drop-shadow(0 0 14px rgba(230,205,150,0.45));
    transform: scale(0.93) translateZ(0);
    backface-visibility: hidden;
    transform-box: fill-box; transform-origin: 50% 50%;
  }
 
  .sg-progress-wrap { width: 100%; max-width: 300px; margin-bottom: 8px; }
  .sg-progress-bar {
    width: 100%; height: 3px;
    background: rgba(212,175,55,0.15);
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
  }
  .sg-progress-fill { height: 100%; background: linear-gradient(90deg, ${GOLD}, #ffe9b3); border-radius: 4px; transition: width 0.15s linear; }
  .sg-time-row { display: flex; justify-content: space-between; font-size: 10.5px; color: rgba(245,237,220,0.45); letter-spacing: 0.5px; margin-top: 6px; font-weight: 300; }
 
  .sg-duration-selector { display: flex; gap: 8px; margin: 20px 0; }
  .sg-duration-chip {
    padding: 6px 14px;
    border-radius: 20px;
    border: 1px solid rgba(212,175,55,0.25);
    background: transparent;
    color: rgba(245,237,220,0.55);
    font-size: 11px;
    letter-spacing: 0.5px;
    font-weight: 300;
    cursor: pointer;
    transition: all 0.25s ease;
  }
  .sg-duration-chip.active { background: ${GOLD}; color: #020617; border-color: ${GOLD}; font-weight: 600; }
 
  .sg-play-btn {
    width: 56px; height: 56px;
    border-radius: 50%;
    background: transparent;
    border: 1px solid rgba(212,175,55,0.5);
    color: ${GOLD};
    font-size: 18px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    box-shadow: 0 0 20px rgba(212,175,55,0.15);
    margin-top: 6px;
    transition: all 0.25s ease;
  }
  .sg-play-btn:hover { border-color: ${GOLD}; box-shadow: 0 0 28px rgba(212,175,55,0.3); }
  .sg-play-btn:active { transform: scale(0.96); }
 
  .sg-whatsapp-btn {
    position: fixed;
    bottom: 18px;
    left: 20px;
    right: 20px;
    background: rgba(2,6,23,0.9);
    border: 1px solid rgba(212,175,55,0.4);
    color: rgba(212,175,55,0.9);
    font-size: 11px;
    font-weight: 300;
    letter-spacing: 0.2px;
    padding: 12px 18px;
    border-radius: 24px;
    cursor: pointer;
    text-decoration: none;
    display: flex; align-items: center; justify-content: center;
    text-align: center;
    backdrop-filter: blur(8px);
    z-index: 10;
    transition: all 0.3s ease;
    white-space: normal;
    line-height: 1.4;
    box-sizing: border-box;
  }
  .sg-whatsapp-btn:hover { border-color: ${GOLD}; color: ${GOLD}; box-shadow: 0 0 20px rgba(212,175,55,0.2); }
`;
 
function TemploWave({ paused }) {
  return (
    <svg className="sg-templo-wave-svg" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
      {WAVE_RINGS.map((ring, i) => (
        <g key={i} className={`sg-templo-wave-group${paused ? ' paused' : ''}`} style={{ animationDelay: ring.delay }}>
          <path className="sg-templo-wave-halo" style={{ animationDelay: ring.delay }} d={ring.d} />
          <path className="sg-templo-wave-line" d={ring.d} />
        </g>
      ))}
    </svg>
  );
}
 
function formatTime(sec) {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
 
export default function SantuarioGenoraApp() {
  const [view, setView] = useState('catalog'); // 'catalog' | 'player'
  const [accessState, setAccessState] = useState('checking'); // 'checking' | 'no-token' | 'device-conflict' | 'granted'
  const [lang, setLang] = useState('es');
  const [entered, setEntered] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);
  const [durationLimit, setDurationLimit] = useState(null); // 15 | 30 | 60 | null (infinito)
 
  const mediaRef = useRef(null);
  const limitTimeoutRef = useRef(null);
  const t = T[lang];
 
  // ---- Nivel 1: Token único en la URL + anclaje al dispositivo (localStorage) ----
  // NOTA HONESTA: esto detecta y bloquea que ESTE MISMO navegador pruebe varios
  // enlaces distintos. NO puede detectar que el MISMO enlace se abrió en OTRO
  // dispositivo, porque localStorage no viaja entre dispositivos.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
 
    if (!token) {
      setAccessState('no-token');
      return;
    }
 
    const boundToken = localStorage.getItem('genora_bound_token');
    if (!boundToken) {
      localStorage.setItem('genora_bound_token', token);
      setAccessState('granted');
    } else if (boundToken === token) {
      setAccessState('granted');
    } else {
      setAccessState('device-conflict');
    }
  }, []);
 
  const openTrack = (track) => {
    setSelectedTrack(track);
    setCurrentTime(0);
    setTrackDuration(0);
    setIsPlaying(false);
    setDurationLimit(null);
    setView('player');
  };
 
  const backToCatalog = () => {
    if (mediaRef.current) { mediaRef.current.pause(); }
    clearTimeout(limitTimeoutRef.current);
    setIsPlaying(false);
    setView('catalog');
  };
 
  const togglePlay = () => {
    const el = mediaRef.current;
    if (!el) return;
    if (isPlaying) {
      el.pause();
      setIsPlaying(false);
    } else {
      el.play().catch(() => {});
      setIsPlaying(true);
    }
  };
 
  const selectDuration = (mins) => {
    setDurationLimit(mins);
    clearTimeout(limitTimeoutRef.current);
    if (mins !== null) {
      limitTimeoutRef.current = setTimeout(() => {
        const el = mediaRef.current;
        if (el) { el.pause(); }
        setIsPlaying(false);
      }, mins * 60 * 1000);
    }
  };
 
  const handleSeek = (e) => {
    const el = mediaRef.current;
    if (!el || !trackDuration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    el.currentTime = ratio * trackDuration;
  };
 
  useEffect(() => {
    return () => clearTimeout(limitTimeoutRef.current);
  }, []);
 
  const progressPct = trackDuration ? (currentTime / trackDuration) * 100 : 0;
 
  const LangToggle = () => (
    <div className="sg-lang-toggle">
      <button className={`sg-lang-btn${lang === 'es' ? ' active' : ''}`} onClick={() => setLang('es')}>ES</button>
      <button className={`sg-lang-btn${lang === 'en' ? ' active' : ''}`} onClick={() => setLang('en')}>EN</button>
    </div>
  );
 
  const Header = () => (
    <div className="sg-header">
      <img
        src="/imagenes/genora-logo-white.png"
        alt="Genora"
        className="sg-header-logo"
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
      <LangToggle />
    </div>
  );
 
  // ---- Pantallas de acceso (token ausente / conflicto de dispositivo) ----
  if (accessState !== 'granted' || !entered) {
    return (
      <div className="sg-root">
        <style>{inlineStyles}</style>
        <div className="sg-content">
          <Header />
          <div className="sg-orb-wrap">
            <video src="/imagenes/adn-animado.mp4" autoPlay loop muted playsInline className="sg-orb-img sg-gold-filter" />
          </div>
 
          {accessState === 'no-token' && (
            <>
              <h1 className="sg-title">{t.sanctuaryTitle}</h1>
              <p className="sg-subtext">{t.noTokenMsg}</p>
            </>
          )}
 
          {accessState === 'granted' && !entered && (
            <>
              <h1 className="sg-title">{t.sanctuaryTitle}</h1>
              <p className="sg-subtext">{t.welcomeSubtext}</p>
              <button className="sg-btn-primary" style={{ maxWidth: '260px' }} onClick={() => setEntered(true)}>{t.enterBtn}</button>
              <p style={{ fontSize: '10px', letterSpacing: '0.3px', color: 'rgba(212,175,55,0.55)', fontWeight: 300, textAlign: 'center', maxWidth: '280px', lineHeight: 1.6, margin: '14px 0 0' }}>{t.privacyNote}</p>
            </>
          )}
 
          {accessState === 'device-conflict' && (
            <>
              <h1 className="sg-title">{t.sanctuaryTitle}</h1>
              <p className="sg-subtext">
                {t.conflictMsg1}<br /><br />
                {t.conflictMsg2}
              </p>
              <a
                className="sg-btn-primary"
                style={{ textDecoration: 'none', display: 'inline-block', textAlign: 'center' }}
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${lang === 'es' ? WHATSAPP_MSG_ES : WHATSAPP_MSG_EN}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.contactBtn}
              </a>
            </>
          )}
 
          {accessState === 'checking' && (
            <p className="sg-subtext">{t.checking}</p>
          )}
        </div>
      </div>
    );
  }
 
  return (
    <div className="sg-root">
      <style>{inlineStyles}</style>
      <Header />
      <div className="sg-content">
 
        {/* ---------- VISTA: CATÁLOGO ---------- */}
        {view === 'catalog' && (
          <>
            <div className="sg-orb-wrap" style={{ width: '96px', height: '96px', marginBottom: '18px' }}>
              <video src="/imagenes/adn-animado.mp4" autoPlay loop muted playsInline className="sg-orb-img sg-gold-filter" />
            </div>
            <div className="sg-greeting">
              <div className="sg-greeting-hi">{t.welcomeHi}</div>
              <div className="sg-greeting-title">{t.sanctuaryTitle}</div>
            </div>
            <div className="sg-card-list">
              {TRACKS.map((track, i) => (
                <div key={track.id} className="sg-card" style={{ animationDelay: `${i * 0.06}s` }} onClick={() => openTrack(track)}>
                  <div className="sg-card-body">
                    <div className="sg-card-type">{track.type === 'video' ? '❖ VIDEO' : '© AUDIO'}</div>
                    <div className="sg-card-title">{track.title}</div>
                    <div className="sg-card-desc">{lang === 'es' ? track.description : (track.description_en || track.description)}</div>
                  </div>
                  <div className="sg-card-play">▶</div>
                </div>
              ))}
            </div>
          </>
        )}
 
        {/* ---------- VISTA: REPRODUCTOR TEMPLO DORADO ---------- */}
        {view === 'player' && selectedTrack && (
          <div className="sg-player">
            <button className="sg-back" onClick={backToCatalog} aria-label="back">‹</button>
 
            <div className="sg-templo-orb-container">
              <TemploWave paused={!isPlaying} />
              <div className="sg-templo-core">
                <video src="/imagenes/adn-animado.mp4" autoPlay loop muted playsInline className="sg-gold-filter" />
              </div>
            </div>
 
            <div className="sg-player-track-title">{selectedTrack.title}</div>
            <div className="sg-player-track-desc">{lang === 'es' ? selectedTrack.description : (selectedTrack.description_en || selectedTrack.description)}</div>
            <div className="sg-player-duration">
              {trackDuration > 0 ? formatTime(trackDuration) : selectedTrack.duration}
            </div>
 
            {selectedTrack.type === 'audio' ? (
              <audio
                ref={mediaRef}
                src={selectedTrack.src}
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setTrackDuration(e.currentTarget.duration)}
                onEnded={() => setIsPlaying(false)}
              />
            ) : (
              <video
                ref={mediaRef}
                src={selectedTrack.src}
                style={{ width: '90%', maxWidth: '320px', borderRadius: '14px', marginBottom: '18px', display: isPlaying ? 'block' : 'none' }}
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setTrackDuration(e.currentTarget.duration)}
                onEnded={() => setIsPlaying(false)}
                controls={isPlaying}
              />
            )}
 
            <div className="sg-progress-wrap">
              <div className="sg-progress-bar" onClick={handleSeek}>
                <div className="sg-progress-fill" style={{ width: `${progressPct}%` }} />
              </div>
              <div className="sg-time-row">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(trackDuration)}</span>
              </div>
            </div>
 
            <div className="sg-duration-selector">
              {[15, 30, 60, null].map((mins) => (
                <button
                  key={mins ?? 'inf'}
                  className={`sg-duration-chip${durationLimit === mins ? ' active' : ''}`}
                  onClick={() => selectDuration(mins)}
                >
                  {mins ? `${mins}'` : '∞'}
                </button>
              ))}
            </div>
 
            <button className="sg-play-btn" onClick={togglePlay}>
              {isPlaying ? '❚❚' : '▶'}
            </button>
          </div>
        )}
      </div>
 
      <a
        className="sg-whatsapp-btn"
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${lang === 'es' ? WHATSAPP_MSG_ES : WHATSAPP_MSG_EN}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t.whatsappFooter}
      </a>
    </div>
  );
}
 
