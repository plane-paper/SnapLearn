export function formatTime(minutes: number): string {
    if (minutes === 0) return "0 min";
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 
      ? `${hours}h ${remainingMinutes}m` 
      : `${hours}h`;
  }
  
  