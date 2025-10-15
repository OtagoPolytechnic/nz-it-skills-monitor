// Normalises a raw job title into one of our entry-level role buckets.

const BUCKETS = {
  'Software Developer': [
    'software developer','software engineer','full stack','backend','.net','java developer',
    'python developer','node developer','typescript developer','react developer (full stack)',
    'graduate developer','junior developer','grad software','junior software'
  ],
  'Web / Front-end Developer': [
    'front end','frontend','web developer','ui developer','javascript developer (front)',
    'react developer','angular developer','vue developer','html','css'
  ],
  'QA / Tester / Test Analyst': [
    'qa','quality assurance','tester','test analyst','automation tester','manual tester','software tester'
  ],
  'IT Support / Service Desk': [
    'it support','service desk','helpdesk','help desk','desktop support','support analyst'
  ],
  'Systems Admin / DevOps (Junior)': [
    'systems administrator','sysadmin','linux admin','windows admin','devops','site reliability','sre',
    'infrastructure engineer','platform engineer'
  ],
  'Data Analyst / BI': [
    'data analyst','business intelligence','bi analyst','power bi','tableau','insights analyst','reporting analyst'
  ],
  'Database (DBA) / ETL': [
    'dba','database administrator','etl','data engineer (junior)','ssis','ssrs'
  ],
  'Cybersecurity / SOC': [
    'cyber','security analyst','soc analyst','siem','vulnerability','secops'
  ],
  'Business Analyst': [
    'business analyst','ba','requirements analyst'
  ],
  'Game Dev / Technical Artist': [
    'game developer','unity','unreal','technical artist','game programmer'
  ],
};

const TITLE_FIELDS = ['title','job_title','position','role','name'];

export function categoriseEntryLevelRole(job = {}) {
  let rawTitle = '';
  for (const f of TITLE_FIELDS) {
    if (typeof job[f] === 'string' && job[f].trim()) { rawTitle = job[f]; break; }
  }
  if (!rawTitle) return null;

  const title = rawTitle.toLowerCase();
  const isGradOrJunior = /\b(junior|graduate|grad|entry|trainee)\b/.test(title);

  for (const [bucket, keywords] of Object.entries(BUCKETS)) {
    for (const k of keywords) {
      if (title.includes(k)) return bucket;
    }
  }
  if (isGradOrJunior && /\b(dev|engineer|developer|programmer)\b/.test(title)) {
    return 'Software Developer';
  }
  return null;
}

export default categoriseEntryLevelRole;
