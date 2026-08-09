/* Custom Palette & Variables */
:root {
  /* Daydream Yellows */
  --yellow-light: #FFF9E3;
  --yellow-soft: #FFF6C1;
  --yellow-mid: #FFEDA8;
  --yellow-accent: #FBE7A1;
  --yellow-deep: #FFE18A;

  /* Slate Blues */
  --blue-darkest: #0D273D;
  --blue-brand: #3E6985;
  --blue-mid: #8AA7BC;
  --blue-soft: #A6BED1;
  --blue-light: #CDD7DF;

  /* Typography & Surfaces */
  --bg-page: #FAF8F2;
  --card-bg: #FFFFFF;
  --text-main: #0D273D;
  --text-muted: #3E6985;
  
  --radius-lg: 20px;
  --radius-md: 12px;
  --radius-pill: 999px;
  --shadow-soft: 0 10px 25px rgba(13, 39, 61, 0.06);
}

/* Base Setup */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--bg-page);
  color: var(--text-main);
  line-height: 1.6;
  min-height: 100vh;
}

/* Glass Header */
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 8%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--blue-light);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  position: relative;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: var(--blue-brand);
  border: 1px solid var(--blue-darkest);
  display: flex;
  justify-content: center;
  align-items: center;
}

.cross-line {
  position: absolute;
  background-color: var(--card-bg);
  border-radius: 2px;
}

.cross-v { width: 4px; height: 16px; }
.cross-h { width: 16px; height: 4px; }

.logo-text {
  font-size: 20px;
  font-weight: 800;
  color: var(--blue-darkest);
  letter-spacing: -0.5px;
}

.logo-accent {
  color: var(--blue-brand);
  font-weight: 700;
}

.lang-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-muted);
  font-weight: 600;
}

select {
  padding: 8px 16px;
  border-radius: var(--radius-pill);
  border: 1.5px solid var(--blue-soft);
  background-color: var(--card-bg);
  font-size: 14px;
  font-weight: 600;
  color: var(--blue-darkest);
  cursor: pointer;
  outline: none;
  transition: all 0.25s ease;
}

select:hover {
  border-color: var(--blue-brand);
  box-shadow: 0 4px 12px rgba(62, 105, 133, 0.15);
}

/* Layout */
.app-container {
  max-width: 680px;
  margin: 40px auto 80px auto;
  padding: 0 20px;
}

.hero-section {
  text-align: center;
  margin-bottom: 28px;
}

h2 {
  font-size: 32px;
  font-weight: 800;
  color: var(--blue-darkest);
  margin-bottom: 10px;
  letter-spacing: -0.8px;
}

.subtitle {
  font-size: 16px;
  color: var(--text-muted);
  max-width: 500px;
  margin: 0 auto;
}

/* Search Box */
.search-box {
  display: flex;
  background: var(--card-bg);
  border-radius: var(--radius-pill);
  padding: 6px 6px 6px 20px;
  box-shadow: var(--shadow-soft);
  border: 2px solid var(--blue-light);
  align-items: center;
  margin-bottom: 18px;
  transition: all 0.25s ease;
}

.search-box:focus-within {
  border-color: var(--blue-brand);
  box-shadow: 0 10px 30px rgba(62, 105, 133, 0.15);
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 12px;
}

.search-icon {
  width: 20px;
  height: 20px;
  color: var(--blue-brand);
}

input[type="text"] {
  width: 100%;
  border: none;
  outline: none;
  font-size: 15px;
  font-weight: 500;
  color: var(--blue-darkest);
  background: transparent;
}

input[type="text"]::placeholder {
  color: var(--blue-mid);
}

button#search-btn {
  background: var(--blue-brand);
  color: var(--card-bg);
  border: none;
  padding: 12px 24px;
  border-radius: var(--radius-pill);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

button#search-btn:hover {
  background: var(--blue-darkest);
  transform: scale(1.02);
}

/* Soft Yellow Tags */
.quick-tags {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 32px;
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 600;
}

.tag-btn {
  background: var(--yellow-soft);
  color: var(--blue-darkest);
  border: 1px solid var(--yellow-deep);
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag-btn:hover {
  background: var(--yellow-accent);
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(255, 225, 138, 0.4);
}

/* Result Card */
#results-card {
  background: var(--card-bg);
  padding: 32px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
  border: 1px solid var(--blue-light);
  animation: cardPop 0.35s ease forwards;
}

@keyframes cardPop {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.category-badge {
  display: inline-block;
  background: var(--yellow-soft);
  color: var(--blue-darkest);
  border: 1px solid var(--yellow-deep);
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin-bottom: 12px;
}

/* Card Header Flex Layout */
.card-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 18px;
}

.card-header-row h1 {
  font-size: 24px;
  font-weight: 800;
  color: var(--blue-darkest);
  margin-bottom: 0 !important;
  letter-spacing: -0.4px;
}

/* Styled Text-to-Speech Button */
.listen-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: var(--yellow-soft);
  color: var(--blue-darkest);
  border: 1.5px solid var(--yellow-deep);
  padding: 8px 16px;
  border-radius: var(--radius-pill);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.listen-btn:hover {
  background-color: var(--yellow-accent);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 225, 138, 0.4);
}

.speaker-icon {
  width: 16px;
  height: 16px;
  color: var(--blue-darkest);
}

/* Speaking Active State */
.listen-btn.speaking {
  background-color: var(--blue-brand);
  color: #ffffff;
  border-color: var(--blue-darkest);
}

.listen-btn.speaking .speaker-icon {
  color: #ffffff;
  animation: pulse 1.2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}

.info-section {
  margin-bottom: 22px;
}

.info-section:last-child { margin-bottom: 0; }

#results-card h3 {
  font-size: 15px;
  font-weight: 700;
  color: var(--blue-brand);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

#results-card p {
  font-size: 15px;
  color: var(--blue-darkest);
  line-height: 1.6;
}

.action-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 8px;
}

.action-item {
  background: var(--yellow-light);
  border-left: 4px solid var(--yellow-deep);
  padding: 14px 16px;
  border-radius: 8px var(--radius-md) var(--radius-md) 8px;
  font-size: 14px;
  color: var(--blue-darkest);
  line-height: 1.5;
  transition: all 0.2s ease;
}

.action-item:hover {
  background: var(--yellow-soft);
  transform: translateX(4px);
}

.action-item strong {
  color: var(--blue-darkest);
}

.disclaimer {
  margin-top: 36px;
  font-size: 12px;
  color: var(--blue-mid);
  line-height: 1.5;
  text-align: center;
  padding: 0 10px;
}
