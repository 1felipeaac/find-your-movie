
export function handleDrawLimit() {
    const MAX_DRAWS = 4;
    const COOLDOWN_MS = 6 * 60 * 60 * 1000;
    const now = Date.now();

    const resetTime = Number(localStorage.getItem('fym_resetTime')) || 0;
    let drawCount = Number(localStorage.getItem('fym_drawCount')) || 0;

    if (now > resetTime) {
      
      drawCount = 0;
      localStorage.setItem('fym_resetTime', (now + COOLDOWN_MS).toString());
    }

    if (drawCount >= MAX_DRAWS) {

      return false; 
    }

    localStorage.setItem('fym_drawCount', (drawCount + 1).toString());

    return true;
  }