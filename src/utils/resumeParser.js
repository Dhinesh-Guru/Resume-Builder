/**
 * Parses raw text extracted from a PDF/DOCX/TXT resume
 * into a structured formData object for the Resume Builder.
 */
export function parseResumeTextToFormData(text) {
  if (!text) return null;

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  
  // Extract Email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : '';

  // Extract Phone (Indian & Global formats)
  const phoneMatch = text.match(/(?:\+91[\s\-]?)?[6-9]\d{9}|\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/);
  const phone = phoneMatch ? phoneMatch[0] : '';

  // Extract LinkedIn
  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9%_\-]+/i);
  const linkedin = linkedinMatch ? linkedinMatch[0] : '';

  // Extract GitHub / Portfolio
  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9%_\-]+/i);
  const github = githubMatch ? githubMatch[0] : '';

  // Extract Name (First valid text line before email/phone)
  let fullName = '';
  for (let i = 0; i < Math.min(6, lines.length); i++) {
    const line = lines[i];
    if (
      !line.includes('@') && 
      !line.toLowerCase().includes('http') && 
      !line.toLowerCase().includes('resume') &&
      !line.toLowerCase().includes('curriculum') &&
      !/\d{5,}/.test(line) &&
      line.length > 2 && line.length < 50
    ) {
      fullName = line.replace(/^[^\w]+|[^\w]+$/g, '');
      break;
    }
  }

  // Extract Location (City, State / Country)
  let location = '';
  const locationMatch = text.match(/([A-Z][a-zA-Z\s]+,\s*[A-Z][a-zA-Z\s]+)|(Chennai|Bengaluru|Bangalore|Hyderabad|Mumbai|Delhi|Pune|Kolkata|Coimbatore|Madurai|Trichy|Salem|Kochi|Tirunelveli|Rajapalayam)[^,\n]*/i);
  if (locationMatch) {
    location = locationMatch[0].trim();
  }

  // Section Headers for Parsing
  const sectionHeaders = [
    'PROFESSIONAL SUMMARY', 'SUMMARY', 'PROFILE', 'OBJECTIVE',
    'TECHNICAL SKILLS', 'SKILLS', 'CORE COMPETENCIES', 'TECHNOLOGIES', 'OTHER SKILLS',
    'WORK EXPERIENCE', 'EXPERIENCE', 'EMPLOYMENT HISTORY',
    'KEY PROJECTS', 'PROJECTS', 'PERSONAL PROJECTS',
    'CERTIFICATIONS & ACHIEVEMENTS', 'CERTIFICATIONS', 'ACHIEVEMENTS',
    'EDUCATION', 'ACADEMIC QUALIFICATIONS'
  ];

  const parsedData = {
    fullName,
    email,
    phone,
    location,
    linkedin,
    github,
    summary: '',
    otherSkills: '',
    experiences: [],
    projects: [],
    certifications: [],
    educations: [],
    extraAnswers: {}
  };

  let currentSection = 'HEADER';
  const sectionContent = {};

  lines.forEach(line => {
    const upperLine = line.toUpperCase();
    const matchedHeader = sectionHeaders.find(h => upperLine === h || upperLine.startsWith(h + ' ') || upperLine.endsWith(' ' + h));
    
    if (matchedHeader) {
      if (matchedHeader.includes('SUMMARY') || matchedHeader.includes('PROFILE') || matchedHeader.includes('OBJECTIVE')) {
        currentSection = 'SUMMARY';
      } else if (matchedHeader.includes('SKILL') || matchedHeader.includes('COMPETENC') || matchedHeader.includes('TECHNOLOG')) {
        currentSection = 'SKILLS';
      } else if (matchedHeader.includes('EXPERIENCE') || matchedHeader.includes('EMPLOYMENT')) {
        currentSection = 'EXPERIENCE';
      } else if (matchedHeader.includes('PROJECT')) {
        currentSection = 'PROJECTS';
      } else if (matchedHeader.includes('CERTIF') || matchedHeader.includes('ACHIEVE')) {
        currentSection = 'CERTIFICATIONS';
      } else if (matchedHeader.includes('EDUCATION') || matchedHeader.includes('ACADEMIC')) {
        currentSection = 'EDUCATION';
      }
      if (!sectionContent[currentSection]) sectionContent[currentSection] = [];
    } else {
      if (!sectionContent[currentSection]) sectionContent[currentSection] = [];
      sectionContent[currentSection].push(line);
    }
  });

  // 1. Summary
  if (sectionContent.SUMMARY) {
    parsedData.summary = sectionContent.SUMMARY.join(' ');
  }

  // 2. Skills
  if (sectionContent.SKILLS) {
    parsedData.otherSkills = sectionContent.SKILLS.join(', ');
  }

  // 3. Projects
  if (sectionContent.PROJECTS) {
    const projLines = sectionContent.PROJECTS;
    let currentProj = null;

    projLines.forEach(l => {
      if (l.toLowerCase().startsWith('tech stack:') || l.toLowerCase().startsWith('technologies:')) {
        if (currentProj) {
          currentProj.techStack = l.replace(/^tech stack:\s*/i, '').replace(/^technologies:\s*/i, '');
        }
      } else if (l.startsWith('•') || l.startsWith('-') || l.startsWith('*')) {
        if (currentProj) {
          currentProj.description += (currentProj.description ? '\n' : '') + l;
        }
      } else if (l.length > 3 && l.length < 80 && !l.includes('@')) {
        if (currentProj && (currentProj.title || currentProj.description)) {
          parsedData.projects.push(currentProj);
        }
        currentProj = { title: l, techStack: '', description: '' };
      } else if (currentProj) {
        currentProj.description += (currentProj.description ? '\n' : '') + l;
      }
    });
    if (currentProj && (currentProj.title || currentProj.description)) {
      parsedData.projects.push(currentProj);
    }
  }

  // 4. Experiences
  if (sectionContent.EXPERIENCE) {
    const expLines = sectionContent.EXPERIENCE;
    let currentExp = null;

    expLines.forEach(l => {
      if (l.startsWith('•') || l.startsWith('-') || l.startsWith('*')) {
        if (currentExp) {
          currentExp.responsibilities += (currentExp.responsibilities ? '\n' : '') + l;
        }
      } else if (/\b(20\d\d|19\d\d|present|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/i.test(l)) {
        if (currentExp) {
          currentExp.endDate = l;
        }
      } else if (l.length > 3 && l.length < 80 && !l.includes('@')) {
        if (currentExp && (currentExp.jobTitle || currentExp.responsibilities)) {
          parsedData.experiences.push(currentExp);
        }
        const parts = l.split(/—|-|\|/);
        currentExp = { 
          jobTitle: parts[0]?.trim() || l, 
          company: parts[1]?.trim() || '', 
          startDate: '', 
          endDate: '', 
          responsibilities: '' 
        };
      } else if (currentExp) {
        currentExp.responsibilities += (currentExp.responsibilities ? '\n' : '') + l;
      }
    });
    if (currentExp && (currentExp.jobTitle || currentExp.responsibilities)) {
      parsedData.experiences.push(currentExp);
    }
  }

  // 5. Certifications
  if (sectionContent.CERTIFICATIONS) {
    sectionContent.CERTIFICATIONS.forEach(l => {
      if (l.length > 3) {
        const yearMatch = l.match(/\b(20\d\d|19\d\d)\b/);
        const parts = l.split(/—|-|\|/);
        parsedData.certifications.push({
          name: parts[0]?.trim() || l,
          issuer: parts[1]?.trim() || '',
          year: yearMatch ? yearMatch[0] : ''
        });
      }
    });
  }

  // 6. Educations
  if (sectionContent.EDUCATION) {
    const eduLines = sectionContent.EDUCATION;
    let currentEdu = null;

    eduLines.forEach(l => {
      const yearMatch = l.match(/\b(20\d\d|19\d\d)\b/);
      const scoreMatch = l.match(/(\d+(?:\.\d+)?\s*%|\d+(?:\.\d+)?\s*CGPA)/i);

      if (/bachelor|master|diploma|hsc|sslc|b\.e|b\.tech|m\.e|m\.tech|b\.sc|m\.sc|bca|mca|10th|12th|school|university|college|degree/i.test(l)) {
        if (currentEdu && (currentEdu.degree || currentEdu.university)) {
          parsedData.educations.push(currentEdu);
        }
        currentEdu = {
          degree: l,
          fieldOfStudy: '',
          university: '',
          gradYear: yearMatch ? yearMatch[0] : '',
          score: scoreMatch ? scoreMatch[0] : ''
        };
      } else if (currentEdu) {
        if (yearMatch && !currentEdu.gradYear) currentEdu.gradYear = yearMatch[0];
        if (scoreMatch && !currentEdu.score) currentEdu.score = scoreMatch[0];
        if (!currentEdu.university) currentEdu.university = l;
      }
    });
    if (currentEdu && (currentEdu.degree || currentEdu.university)) {
      parsedData.educations.push(currentEdu);
    }
  }

  // Ensure default non-empty arrays for form inputs
  if (parsedData.projects.length === 0) {
    parsedData.projects = [{ title: '', techStack: '', description: '' }];
  }
  if (parsedData.experiences.length === 0) {
    parsedData.experiences = [{ jobTitle: '', company: '', startDate: '', endDate: '', responsibilities: '' }];
  }
  if (parsedData.educations.length === 0) {
    parsedData.educations = [{ degree: "Bachelor's Degree", fieldOfStudy: '', university: '', gradYear: '', score: '' }];
  }

  return parsedData;
}
