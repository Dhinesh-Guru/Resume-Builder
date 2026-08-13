import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_KEY_STORAGE = 'ats_gemini_api_key';

export function getStoredApiKey() {
  return localStorage.getItem(GEMINI_KEY_STORAGE) || '';
}

export function setStoredApiKey(key) {
  if (key) {
    localStorage.setItem(GEMINI_KEY_STORAGE, key.trim());
  } else {
    localStorage.removeItem(GEMINI_KEY_STORAGE);
  }
}

// Comprehensive Industry & Nuanced Sub-Role Keyword Dictionary
const KEYWORD_DICT = {
  // Culinary Sub-roles
  executive_chef: ['culinary arts', 'kitchen management', 'haccp', 'menu planning', 'recipe development', 'inventory control', 'food cost control', 'staff scheduling', 'catering', 'sanitation', 'culinary leadership'],
  chef: ['culinary arts', 'food safety', 'haccp', 'menu planning', 'recipe development', 'kitchen management', 'inventory control', 'food preparation', 'sanitation', 'plating', 'catering'],
  line_cook: ['line cook', 'food preparation', 'kitchen safety', 'sanitation', 'cooking techniques', 'menu items', 'grilling', 'sautéing', 'portion control', 'order execution'],
  kitchen_staff: ['kitchen staff', 'food preparation', 'sanitation', 'dishwashing', 'kitchen safety', 'inventory unboxing', 'workstation maintenance', 'basic knife skills', 'kitchen cleanliness'],
  baker: ['baking techniques', 'pastry design', 'oven control', 'dessert plating', 'dough preparation', 'confectionery', 'yeast management', 'sanitation'],

  // Healthcare Sub-roles
  doctor: ['patient care', 'clinical diagnosis', 'medical records', 'treatment planning', 'emr/ehr', 'pharmacology', 'patient assessment', 'medical ethics', 'surgery', 'triage'],
  nurse: ['patient care', 'vital signs', 'medication administration', 'patient assessment', 'icu/ccu', 'cpr/bls', 'emr/ehr', 'wound care', 'triage', 'phlebotomy'],

  // Education Sub-roles
  teacher: ['curriculum development', 'classroom management', 'lesson planning', 'student assessment', 'pedagogy', 'educational technology', 'mentoring', 'subject expertise'],
  professor: ['academic research', 'journal publications', 'university lecturing', 'grant writing', 'curriculum design', 'thesis supervision'],

  // Engineering Sub-roles
  civil: ['autocad', 'site supervision', 'structural design', 'cost estimation', 'revit', 'surveying', 'construction management', 'building codes', 'concrete design'],
  mechanical: ['solidworks', 'autocad', 'thermal analysis', 'manufacturing processes', 'gd&t', 'hvac', 'cad/cam', 'matlab', 'quality control'],
  electrical: ['circuit design', 'plc', 'scada', 'autocad electrical', 'power systems', 'matlab', 'microcontrollers', 'pcb layout', 'embedded systems'],

  // Sales & Support Sub-roles
  sales: ['lead generation', 'crm (salesforce/hubspot)', 'client relationship', 'b2b sales', 'cold calling', 'deal closing', 'negotiation', 'quota achievement', 'pipeline management'],
  support: ['customer support', 'active listening', 'crm software', 'troubleshooting', 'ticket management', 'call center', 'communication', 'conflict resolution'],
  driver: ['route planning', 'vehicle maintenance', 'safe driving', 'fleet management', 'logistics', 'dispatch', 'timely delivery', 'road safety'],

  // Finance & Accounting
  accountant: ['accounting', 'taxation', 'tally prime', 'gst', 'quickbooks', 'excel', 'reconciliation', 'audit', 'finance', 'ledger', 'balance sheet', 'payroll', 'compliance'],

  // Software & Tech Sub-roles
  frontend_dev: ['react', 'html/css', 'javascript', 'typescript', 'ui/ux', 'responsive design', 'redux', 'tailwind', 'webpack', 'rest apis'],
  backend_dev: ['node.js', 'express', 'python', 'sql', 'postgresql', 'mongodb', 'redis', 'api architecture', 'docker', 'microservices'],
  fullstack_dev: ['javascript', 'python', 'react', 'node.js', 'sql', 'git', 'api', 'framework', 'database', 'frontend', 'backend', 'fullstack', 'html/css', 'agile'],
  devops: ['docker', 'kubernetes', 'aws', 'ci/cd', 'terraform', 'linux', 'bash', 'jenkins', 'monitoring'],
  qa_automation: ['selenium', 'qa automation', 'cypress', 'playwright', 'api testing', 'postman', 'automation frameworks', 'jenkins'],
  qa_tester: ['manual testing', 'jira', 'bug tracking', 'defect report', 'test cases', 'regression testing', 'user acceptance testing'],

  // Data & Analytics Sub-roles
  data_analyst: ['sql', 'excel (vlookup/pivot)', 'tableau', 'power bi', 'data analysis', 'metrics', 'dashboard', 'data visualization'],
  data_scientist: ['python', 'machine learning', 'r', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'statistics', 'a/b testing'],

  // Management & Design
  project: ['agile/scrum', 'jira', 'budget management', 'stakeholder communication', 'risk management', 'project timelines', 'pmp', 'kanban', 'milestones'],
  designer: ['figma', 'ui/ux design', 'adobe xd', 'wireframing', 'user research', 'prototyping', 'design systems', 'photoshop', 'illustrator'],
  marketing: ['seo', 'google ads', 'social media marketing', 'content strategy', 'google analytics', 'email campaigns', 'conversion optimization'],
  hr: ['talent acquisition', 'screening & interviewing', 'ats software', 'onboarding', 'employee relations', 'payroll management', 'hr compliance']
};

/**
 * Maps any free-text job title or role variation to its specific domain keywords.
 */
function getKeywordsForJobTitle(jobTitle) {
  const lower = (jobTitle || '').toLowerCase();

  // Culinary Sub-role Differentiation
  if (/(executive chef|head cook|sous chef|culinary director)/i.test(lower)) {
    return KEYWORD_DICT.executive_chef;
  }
  if (/(baker|pastry|confectioner)/i.test(lower)) {
    return KEYWORD_DICT.baker;
  }
  if (/(kitchen staff|kitchen helper|dishwasher|steward|utility)/i.test(lower)) {
    return KEYWORD_DICT.kitchen_staff;
  }
  if (/(line cook|prep cook|short order cook)/i.test(lower)) {
    return KEYWORD_DICT.line_cook;
  }
  if (/(cook|chef|culinary|food|restaurant)/i.test(lower)) {
    return KEYWORD_DICT.chef;
  }

  // Software Sub-role Differentiation
  if (/(frontend|ui developer|web developer)/i.test(lower)) {
    return KEYWORD_DICT.frontend_dev;
  }
  if (/(backend|server engineer|api developer)/i.test(lower)) {
    return KEYWORD_DICT.backend_dev;
  }
  if (/(devops|cloud|site reliability|sre|infrastructure)/i.test(lower)) {
    return KEYWORD_DICT.devops;
  }
  if (/(developer|engineer|programmer|fullstack|software)/i.test(lower)) {
    return KEYWORD_DICT.fullstack_dev;
  }

  // QA Sub-role Differentiation
  if (/(automation|selenium|cypress|sdet)/i.test(lower)) {
    return KEYWORD_DICT.qa_automation;
  }
  if (/(tester|qa|quality|manual)/i.test(lower)) {
    return KEYWORD_DICT.qa_tester;
  }

  // Data Sub-role Differentiation
  if (/(scientist|machine learning|ai|ml)/i.test(lower)) {
    return KEYWORD_DICT.data_scientist;
  }
  if (/(analyst|data|bi|tableau|power bi)/i.test(lower)) {
    return KEYWORD_DICT.data_analyst;
  }

  // Healthcare
  if (/(doctor|physician|surgeon|medical|dentist)/i.test(lower)) {
    return KEYWORD_DICT.doctor;
  }
  if (/(nurse|nursing|patient|healthcare)/i.test(lower)) {
    return KEYWORD_DICT.nurse;
  }

  // Education
  if (/(professor|lecturer|university faculty)/i.test(lower)) {
    return KEYWORD_DICT.professor;
  }
  if (/(teacher|educator|instructor|tutor)/i.test(lower)) {
    return KEYWORD_DICT.teacher;
  }

  // Engineering
  if (/(civil|site|construction|structural)/i.test(lower)) {
    return KEYWORD_DICT.civil;
  }
  if (/(mechanical|hvac|cad|solidworks|plant)/i.test(lower)) {
    return KEYWORD_DICT.mechanical;
  }
  if (/(electrical|electronics|circuit|plc)/i.test(lower)) {
    return KEYWORD_DICT.electrical;
  }

  // Finance & Business
  if (/(accountant|accounting|tax|audit|finance|tally|gst)/i.test(lower)) {
    return KEYWORD_DICT.accountant;
  }
  if (/(sales|bdm|executive|business development)/i.test(lower)) {
    return KEYWORD_DICT.sales;
  }
  if (/(support|customer|service|call center|helpdesk|bpo)/i.test(lower)) {
    return KEYWORD_DICT.support;
  }
  if (/(driver|logistics|fleet|delivery|transport)/i.test(lower)) {
    return KEYWORD_DICT.driver;
  }
  if (/(project|product|manager|scrum|agile|pmp)/i.test(lower)) {
    return KEYWORD_DICT.project;
  }
  if (/(designer|ui|ux|figma|graphic)/i.test(lower)) {
    return KEYWORD_DICT.designer;
  }
  if (/(marketing|seo|sem|digital|social media)/i.test(lower)) {
    return KEYWORD_DICT.marketing;
  }
  if (/(hr|recruiter|talent|human resources)/i.test(lower)) {
    return KEYWORD_DICT.hr;
  }

  // Fallback for unique job titles
  return [
    `${jobTitle} domain knowledge`,
    'problem solving',
    'team collaboration',
    'quality control',
    'process improvement',
    'time management',
    'documentation'
  ];
}

/**
 * Single Unified Role Match Scoring Calculation
 */
function calculateRoleMatchScore(resumeText, jobTitle, keywords) {
  const lowerText = (resumeText || '').toLowerCase();
  const lowerTitle = (jobTitle || '').toLowerCase();
  const titleWords = lowerTitle.split(/[\s\-\/]+/).filter(w => w.length > 2);

  let matches = 0;
  keywords.forEach(kw => {
    if (lowerText.includes(kw.toLowerCase())) matches++;
  });

  const keywordRatio = keywords.length > 0 ? matches / keywords.length : 0.5;
  const keywordScore = Math.min(100, Math.round(keywordRatio * 100));

  const titleMatchBonus = titleWords.some(w => lowerText.includes(w)) ? 15 : 0;
  
  const finalJobMatch = Math.min(98, Math.max(30, Math.round((keywordScore * 0.7) + titleMatchBonus + 10)));
  return {
    jobMatchScore: finalJobMatch,
    keywordScore,
    matchedCount: matches,
    totalKeywords: keywords.length
  };
}

/**
 * Queries Google AI Studio ModelCatalog to find the single active model endpoint for the key,
 * excluding deprecated models (e.g. gemini-2.5-flash).
 */
async function discoverModelEndpoint(apiKey) {
  try {
    const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (listRes.ok) {
      const listData = await listRes.json();
      if (listData.models && Array.isArray(listData.models)) {
        // Filter generateContent models and EXCLUDE deprecated ones
        const validModels = listData.models.filter(m => {
          if (!m.supportedGenerationMethods || !m.supportedGenerationMethods.includes('generateContent')) {
            return false;
          }
          const name = (m.name || '').toLowerCase();
          return !name.includes('2.5') && !name.includes('deprecated') && !name.includes('bison') && !name.includes('embed');
        });

        // Prioritize active models: gemini-1.5-flash -> gemini-1.5-pro -> gemini-2.0-flash
        const preferred = validModels.find(m => m.name.includes('gemini-1.5-flash')) ||
                          validModels.find(m => m.name.includes('gemini-1.5-pro')) ||
                          validModels.find(m => m.name.includes('gemini-2.0-flash')) ||
                          validModels[0];

        if (preferred && preferred.name) {
          const modelPath = preferred.name.startsWith('models/') ? preferred.name : `models/${preferred.name}`;
          console.log(`Selected active model endpoint: ${modelPath}`);
          return `https://generativelanguage.googleapis.com/v1beta/${modelPath}:generateContent`;
        }
      }
    } else {
      const errJson = await listRes.json().catch(() => ({}));
      if (errJson?.error?.message) {
        throw new Error(errJson.error.message);
      }
    }
  } catch (e) {
    if (e.message && e.message.toLowerCase().includes('key')) {
      throw e;
    }
  }

  // Fallback endpoint if discovery catalog fails
  return 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
}

/**
 * Robust JSON extractor that handles markdown fences, unescaped characters,
 * control sequences, and trailing commas.
 */
function extractFirstJsonObject(str) {
  if (!str) return null;
  
  let clean = str.replace(/```json/gi, '').replace(/```/g, '').trim();

  // Try direct parse first
  try {
    return JSON.parse(clean);
  } catch (e) {
    // Sanitize unescaped control characters in strings
    const sanitized = clean.replace(/[\u0000-\u001F]+/g, ' ');
    try {
      return JSON.parse(sanitized);
    } catch (e2) {
      // Isolate JSON object via regex
      const jsonMatch = sanitized.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const rawObj = jsonMatch[0];
        try {
          return JSON.parse(rawObj);
        } catch (e3) {
          try {
            // Remove trailing commas before closing braces/brackets
            return JSON.parse(rawObj.replace(/,\s*([\}\]])/g, '$1'));
          } catch (e4) {
            console.warn('All JSON parsing attempts failed:', e4);
          }
        }
      }
    }
  }

  return null;
}

/**
 * Fast REST API call to Google Gemini AI using JSON mode (response_mime_type).
 */
export async function analyzeResumeWithGemini(resumeText, jobTitle) {
  const apiKey = getStoredApiKey() ? getStoredApiKey().trim() : '';

  if (apiKey) {
    let targetUrl = '';
    try {
      targetUrl = await discoverModelEndpoint(apiKey);
    } catch (keyErr) {
      console.error('API key error:', keyErr);
      const fallback = performLocalATSAnalysis(resumeText, jobTitle);
      return {
        ...fallback,
        apiError: keyErr.message || 'Invalid Gemini API key provided.'
      };
    }

    const prompt = `
You are an expert ATS Auditor and Senior HR Recruiter.
Analyze the following resume text specifically for the target job position: "${jobTitle}".

RESUME TEXT:
"""
${resumeText.slice(0, 4000)}
"""

Evaluate:
1. Overall ATS Formatting & Readability (0-100)
2. Job Relevance & Keyword Alignment for ${jobTitle} (0-100)
3. Formatting Score (0-100)

Return ONLY a raw JSON object (no markdown, no conversational text) with this exact key structure:
{
  "overallScore": 75,
  "jobMatchScore": 68,
  "formattingScore": 82,
  "keywordScore": 70,
  "summary": "Detailed 2 sentence summary of resume strengths and alignment.",
  "missingKeywords": ["important_keyword1", "important_keyword2"],
  "passedChecks": ["Valid contact info found", "Standard sections present"],
  "warnings": ["Lacks numerical metrics"],
  "recommendations": ["Add quantified achievements to experience bullets", "Include missing domain keywords for ${jobTitle}"]
}`;

    try {
      const response = await fetch(`${targetUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: "application/json"
          }
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const errMsg = errData?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
        console.warn(`Gemini REST endpoint ${targetUrl} failed:`, errMsg);
        const fallback = performLocalATSAnalysis(resumeText, jobTitle);
        return {
          ...fallback,
          apiError: errMsg
        };
      }

      const data = await response.json();
      const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!responseText) {
        throw new Error('Empty response received from Gemini API.');
      }

      const parsed = extractFirstJsonObject(responseText);
      if (!parsed) {
        throw new Error('Could not parse valid JSON from Gemini AI output.');
      }

      // Compute local baseline rules for fallbacks
      const localBaseline = performLocalATSAnalysis(resumeText, jobTitle);

      // Normalize numerical scores
      const overallScore = Math.min(100, Math.max(10, parseInt(parsed.overallScore || parsed.overall_score || parsed.overall || localBaseline.overallScore)));
      const jobMatchScore = Math.min(100, Math.max(10, parseInt(parsed.jobMatchScore || parsed.job_match_score || parsed.jobMatch || localBaseline.jobMatchScore)));
      const formattingScore = Math.min(100, Math.max(10, parseInt(parsed.formattingScore || parsed.formatting_score || parsed.formatting || localBaseline.formattingScore)));
      const keywordScore = Math.min(100, Math.max(10, parseInt(parsed.keywordScore || parsed.keyword_score || localBaseline.keywordScore)));

      // Merge passedChecks, missingKeywords, recommendations so they are NEVER empty!
      const passedChecks = Array.isArray(parsed.passedChecks) && parsed.passedChecks.length > 0 
        ? parsed.passedChecks 
        : localBaseline.passedChecks;

      const missingKeywords = Array.isArray(parsed.missingKeywords) && parsed.missingKeywords.length > 0 
        ? parsed.missingKeywords 
        : localBaseline.missingKeywords;

      const recommendations = Array.isArray(parsed.recommendations) && parsed.recommendations.length > 0 
        ? parsed.recommendations 
        : localBaseline.recommendations;

      // Always calculate the single #1 BEST role match across ALL industries independently!
      const bestMatchingRole = detectBestMatchingRole(resumeText);

      return {
        overallScore,
        jobMatchScore,
        formattingScore,
        keywordScore,
        summary: parsed.summary || localBaseline.summary,
        missingKeywords,
        passedChecks,
        warnings: Array.isArray(parsed.warnings) && parsed.warnings.length > 0 ? parsed.warnings : localBaseline.warnings,
        recommendations,
        bestMatchingRole,
        source: 'gemini-ai'
      };
    } catch (err) {
      console.error('Gemini AI API REST failed:', err);
      const fallback = performLocalATSAnalysis(resumeText, jobTitle);
      return {
        ...fallback,
        apiError: err?.message || 'Gemini API connection failed.'
      };
    }
  }

  return performLocalATSAnalysis(resumeText, jobTitle);
}

/**
 * Evaluates the resume text across ALL role categories in KEYWORD_DICT
 * to find the single BEST fitting job role for the candidate's resume.
 */
function detectBestMatchingRole(resumeText) {
  let bestRoleKey = 'fullstack_dev';
  let maxScore = -1;

  const ROLE_DISPLAY_NAMES = {
    executive_chef: 'Executive Chef / Head Cook',
    chef: 'Chef / Culinary Professional',
    line_cook: 'Line Cook / Prep Cook',
    kitchen_staff: 'Kitchen Staff / Helper',
    baker: 'Pastry Chef / Baker',
    doctor: 'Medical Doctor / Physician',
    nurse: 'Staff Nurse / Healthcare Specialist',
    teacher: 'Teacher / Academic Educator',
    professor: 'University Professor / Academic Researcher',
    civil: 'Civil Engineer / Site Supervisor',
    mechanical: 'Mechanical Engineer',
    electrical: 'Electrical Engineer',
    sales: 'Sales Executive / BDM',
    support: 'Customer Support Representative',
    driver: 'Logistics & Fleet Driver',
    accountant: 'Accountant / Finance Executive',
    frontend_dev: 'Frontend Developer',
    backend_dev: 'Backend Developer',
    fullstack_dev: 'Software Developer / Engineer',
    devops: 'DevOps / Cloud Engineer',
    qa_automation: 'QA Automation Engineer',
    qa_tester: 'QA / Software Tester',
    data_analyst: 'Data Analyst',
    data_scientist: 'Data Scientist / Machine Learning Engineer',
    project: 'Project / Product Manager',
    designer: 'UI/UX & Graphic Designer',
    marketing: 'Digital Marketing Specialist',
    hr: 'HR Manager / Recruiter'
  };

  for (const [key, keywords] of Object.entries(KEYWORD_DICT)) {
    const roleName = ROLE_DISPLAY_NAMES[key] || capitalizeWords(key);
    const result = calculateRoleMatchScore(resumeText, roleName, keywords);
    if (result.jobMatchScore > maxScore) {
      maxScore = result.jobMatchScore;
      bestRoleKey = key;
    }
  }

  const bestTitle = ROLE_DISPLAY_NAMES[bestRoleKey] || capitalizeWords(bestRoleKey);
  const bestKeywords = KEYWORD_DICT[bestRoleKey] || [];
  const finalBestResult = calculateRoleMatchScore(resumeText, bestTitle, bestKeywords);

  return {
    title: bestTitle,
    matchScore: finalBestResult.jobMatchScore
  };
}

/**
 * Robust local NLP & ATS rule evaluation algorithm
 */
export function performLocalATSAnalysis(resumeText, jobTitle) {
  const lowerText = (resumeText || '').toLowerCase();

  // Find domain keyword list for the SPECIFIC target title tested in dropdown
  const targetKeywords = getKeywordsForJobTitle(jobTitle);

  // Calculate Job Match Score for the tested title (Varies with Job Title)
  const matchResult = calculateRoleMatchScore(resumeText, jobTitle, targetKeywords);
  const jobMatchScore = matchResult.jobMatchScore;
  const keywordScore = matchResult.keywordScore;

  // Check missing keywords
  const missingKeywords = targetKeywords.filter(kw => !lowerText.includes(kw.toLowerCase()));

  // Check standard sections
  const sections = ['experience', 'education', 'skills', 'summary', 'projects'];
  const foundSections = sections.filter(sec => lowerText.includes(sec));
  const sectionScore = (foundSections.length / sections.length) * 100;

  const hasQuantifiedResults = /\b(\d+%|\$\d+|\d+\+|\d+ years?|\d+ projects?)\b/i.test(resumeText);
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText);
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText);

  // Formatting & Structure Score (Constant for the resume document itself)
  const formattingScore = Math.round((sectionScore * 0.6) + (hasEmail ? 20 : 0) + (hasPhone ? 20 : 0));
  
  // Overall ATS Quality Score: Measures standalone document parseability, structure & metrics compliance.
  // CONSTANT for the same resume regardless of target job title!
  const overallScore = Math.round((formattingScore * 0.7) + (hasQuantifiedResults ? 20 : 5) + (foundSections.length >= 4 ? 10 : 0));

  const passedChecks = [];
  const warnings = [];
  const recommendations = [];

  if (hasEmail) passedChecks.push('Valid Email address detected');
  else warnings.push('No email address found in the header');

  if (hasPhone) passedChecks.push('Phone number formatting detected');
  else warnings.push('No phone contact number found');

  if (foundSections.length >= 4) passedChecks.push(`Standard ATS section headings found (${foundSections.join(', ')})`);
  else warnings.push('Missing common section headings like Summary, Skills, or Experience');

  if (hasQuantifiedResults) {
    passedChecks.push('Contains quantified achievements (percentages, revenue, numbers)');
  } else {
    warnings.push('Lacks measurable numbers or percentages in work experience bullets');
    recommendations.push('Add numerical achievements to your experience bullets (e.g. "Increased efficiency by 25%", "Managed 10+ projects")');
  }

  if (missingKeywords.length > 0) {
    recommendations.push(`Include key domain skills for ${jobTitle}: ${missingKeywords.slice(0, 4).join(', ')}`);
  }

  recommendations.push('Use simple, single-column formatting without tables, graphics, or complex headers for maximum ATS compatibility');

  // Detect Best Role Match across ALL categories independently
  const bestMatchingRole = detectBestMatchingRole(resumeText);

  return {
    overallScore: Math.min(98, Math.max(35, overallScore)),
    jobMatchScore: Math.min(99, Math.max(30, jobMatchScore)),
    formattingScore: Math.min(100, Math.max(40, formattingScore)),
    keywordScore,
    summary: `Your resume demonstrates an overall ATS Document Quality Score of ${overallScore}% and a ${jobMatchScore}% specific match for the ${jobTitle} position.`,
    missingKeywords: missingKeywords.slice(0, 6),
    passedChecks,
    warnings,
    recommendations,
    bestMatchingRole,
    source: 'smart-heuristic'
  };
}

function capitalizeWords(str) {
  if (!str) return '';
  return str.replace(/\b\w/g, c => c.toUpperCase());
}
