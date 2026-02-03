export const subjects = [
  { id:'eng',  title:'ENGLISH',        accent:'#22C1C3', desc:'Reading, writing & language arts', progress:68 },
  { id:'math', title:'MATHEMATICS',    accent:'#FF6B6B', desc:'Numbers, algebra & geometry',      progress:75 },
  { id:'sci',  title:'SCIENCE',        accent:'#27AE60', desc:'Biology, chemistry & physics',     progress:42 },
  { id:'soc',  title:'SOCIAL STUDIES', accent:'#F59E0B', desc:'History, geography & culture',     progress:56 },
];

export const stats = [
  { icon:'flame', label:'Learning Streak',   value:'7 days',  sub:'Keep it up!' },
  { icon:'check', label:'Lessons Completed', value:42,        sub:'This month' },
  { icon:'star',  label:'Avg. Score',        value:'86%',     sub:'Across quizzes' },
  { icon:'clock', label:'Time Spent',        value:'12h 20m', sub:'Last 7 days' },
];

export const recentActivity = [
  { title:'Finished "Fractions Basics"', date:'Today, 4:10 PM', subject:'MATHEMATICS', xp:15, color:'#FF6B6B', icon:'calc' },
  { title:'Watched "Plant Cells" video', date:'Today, 3:05 PM', subject:'SCIENCE',     xp:10, color:'#27AE60', icon:'leaf' },
  { title:'Quiz: Nouns & Verbs (9/10)',  date:'Yesterday',      subject:'ENGLISH',     xp:20, color:'#22C1C3', icon:'book' },
];

export const achievements = [
  { name:'Streak Starter',   caption:'3 days in a row' },
  { name:'Quiz Whiz',        caption:'3 quizzes ≥80%' },
  { name:'Science Explorer', caption:'Finished 5 science lessons' },
  { name:'Helper',           caption:'Shared 1 note' },
];

// For the heatmap/calendar widgets
export const activityByDay = (() => {
  const out:any[] = []; const today = new Date();
  for (let i=0;i<90;i++){ const d=new Date(today); d.setDate(d.getDate()-i);
    const minutes=Math.max(0,Math.round((Math.sin(i/6)+1)*15 + (Math.random()*30-10)));
    out.push({ date:d.toISOString().slice(0,10), minutes });
  }
  return out.reverse();
})();