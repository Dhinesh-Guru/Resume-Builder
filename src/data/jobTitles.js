export const CURATED_JOB_TITLES = [
  { id: 'dev', title: 'Software Developer / Engineer', icon: 'Code', category: 'Engineering' },
  { id: 'qa_tester', title: 'QA / Software Tester', icon: 'Bug', category: 'Engineering' },
  { id: 'quality_analyst', title: 'Quality Analyst', icon: 'CheckCircle2', category: 'Quality & Process' },
  { id: 'data_analyst', title: 'Data Analyst / Scientist', icon: 'BarChart3', category: 'Data & AI' },
  { id: 'accountant', title: 'Accountant / Finance Specialist', icon: 'Calculator', category: 'Finance' },
  { id: 'project_mgr', title: 'Project / Product Manager', icon: 'Kanban', category: 'Management' },
  { id: 'designer', title: 'UI/UX & Graphic Designer', icon: 'Palette', category: 'Design' },
  { id: 'marketing', title: 'Digital Marketing Specialist', icon: 'Megaphone', category: 'Marketing' },
  { id: 'hr_recruiter', title: 'HR Manager / Recruiter', icon: 'Users', category: 'Human Resources' },
  { id: 'sales_exec', title: 'Sales Executive / BDM', icon: 'TrendingUp', category: 'Sales' },
  { id: 'devops', title: 'DevOps / Cloud Engineer', icon: 'Server', category: 'Engineering' },
  { id: 'sys_admin', title: 'System Administrator', icon: 'HardDrive', category: 'IT & Infrastructure' }
];

// Comprehensive dictionary of recognized job roles, titles, and professional designations
const RECOGNIZED_JOB_ROLES = new Set([
  'developer', 'engineer', 'tester', 'analyst', 'manager', 'designer', 'specialist',
  'consultant', 'assistant', 'executive', 'officer', 'lead', 'intern', 'administrator',
  'admin', 'director', 'associate', 'technician', 'accountant', 'architect', 'scientist',
  'worker', 'operator', 'supervisor', 'coordinator', 'trainee', 'programmer',
  'writer', 'editor', 'advocate', 'lawyer', 'doctor', 'nurse', 'pharmacist',
  'teacher', 'professor', 'instructor', 'trainer', 'auditor', 'advisor', 'agent',
  'strategist', 'recruiter', 'head', 'chief', 'vp', 'president', 'founder',
  'software', 'hardware', 'frontend', 'backend', 'fullstack', 'web', 'mobile',
  'cloud', 'devops', 'security', 'cyber', 'network', 'system', 'data', 'ai', 'ml',
  'database', 'qa', 'quality', 'product', 'project', 'scrum', 'agile', 'ui', 'ux',
  'graphic', 'content', 'digital', 'marketing', 'sales', 'hr', 'finance', 'banking',
  'accounting', 'tax', 'audit', 'legal', 'business', 'operations', 'logistics',
  'supply', 'chain', 'customer', 'support', 'service', 'retail', 'store', 'event',
  'media', 'video', 'audio', 'sound', '3d', 'vfx', 'game', 'embedded', 'iot',
  'civil', 'mechanical', 'electrical', 'electronics', 'chemical', 'biotech',
  'researcher', 'statistician', 'freelancer', 'copywriter', 'seo', 'sem', 'pilot',
  'chef', 'cook', 'kitchen', 'staff', 'helper', 'crew', 'caterer', 'baker', 'barista',
  'butcher', 'pastry', 'host', 'hostess', 'steward', 'dishwasher', 'cleaner', 'utility',
  'frontdesk', 'desk', 'member', 'personnel', 'driver', 'cashier', 'receptionist', 'clerk',
  'plumber', 'electrician', 'mechanic', 'welder', 'carpenter', 'mason', 'guard',
  'firefighter', 'police', 'telecaller', 'bpo', 'kpo', 'collector', 'inspector',
  'surveyor', 'lab', 'pathologist', 'radiologist', 'optometrist', 'physiotherapist',
  'veterinary', 'dentist', 'surgeon', 'dermatologist', 'psychiatrist', 'pediatrician',
  'microbiologist', 'biochemist', 'physicist', 'chemist', 'astronomer', 'geologist',
  'metallurgist', 'telecom', 'robotics', 'automation', 'vlsi', 'sre', 'dba', 'etl',
  'payroll', 'compliance', 'underwriter', 'actuary', 'trader', 'broker', 'janitor',
  'custodian', 'gardener', 'farmer', 'tutor', 'lecturer', 'dean', 'principal',
  'apprentice', 'housekeeper', 'nanny', 'chauffeur', 'attendant', 'sailor', 'constable',
  'soldier', 'airman', 'cadet', 'bouncer', 'warden', 'peon', 'proprietor'
]);

/**
 * Validates free-text custom job titles.
 * Ensures the title is an actual, recognized job role and NOT a random/gibberish word.
 */
export function validateJobTitle(input) {
  if (!input || typeof input !== 'string') {
    return { valid: false, message: 'Please enter a target job title.' };
  }
  
  const trimmed = input.trim();
  
  if (trimmed.length < 3) {
    return { valid: false, message: 'Job title is too short (minimum 3 characters required).' };
  }
  
  if (trimmed.length > 60) {
    return { valid: false, message: 'Job title is too long (maximum 60 characters).' };
  }

  // Must contain letters
  if (!/[a-zA-Z]/.test(trimmed)) {
    return { valid: false, message: 'Job title must contain valid alphabetical letters.' };
  }

  // Disallow numbers or special characters other than spaces, hyphens, slashes, and ampersands
  if (/[^a-zA-Z\s\-\/\&]/.test(trimmed)) {
    return { valid: false, message: 'Job title should only contain letters, spaces, hyphens (-), and slashes (/).' };
  }

  const lower = trimmed.toLowerCase();
  const words = lower.split(/[\s\-\/\&]+/).filter(w => w.length > 0);

  // Keyboard mashing & unpronounceable sequence check
  const keyboardMashRegex = /(asdf|sdfg|dfgh|fghj|ghjk|hjkl|qwerty|werty|ertyu|rtyui|tyuio|yuiop|zxcv|xcvb|cvbn|vbnm|uhds|hdsf|dsfd|fdsa|lkjh|kjhg|jhgf|hgfd|gfdsa)/i;
  if (keyboardMashRegex.test(lower)) {
    return { 
      valid: false, 
      message: `"${trimmed}" is not a recognized job title. Please enter an actual job title (e.g. Cyber Security Specialist, Kitchen Staff).` 
    };
  }

  // Check for 3+ consecutive unpronounceable consonants
  if (/[^aeiouy\s\-\/\&]{4,}/i.test(lower)) {
    return { 
      valid: false, 
      message: `"${trimmed}" contains invalid character combinations. Please enter a valid job title.` 
    };
  }

  // Check for repeated identical characters (e.g., 'aaa', 'zzzz')
  if (/(.)\1{2,}/.test(lower)) {
    return { 
      valid: false, 
      message: 'Please enter a valid job title without repeated characters.' 
    };
  }

  // MANDATORY REQUIREMENT: At least one word in the custom job title MUST match a recognized job role term
  const hasRecognizedRole = words.some(w => RECOGNIZED_JOB_ROLES.has(w));

  if (!hasRecognizedRole) {
    return { 
      valid: false, 
      message: `"${trimmed}" is not recognized as a valid job title. Custom titles must include a real role (e.g., Developer, Engineer, Tester, Analyst, Manager, Kitchen Staff, Specialist, Officer, Accountant, etc.).` 
    };
  }

  return { valid: true, sanitized: trimmed };
}
