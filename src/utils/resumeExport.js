import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Downloads standard ATS-friendly PDF of the element
 */
export async function exportResumeToPdf(elementId, filename = 'ATS_Resume.pdf') {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Resume element not found for export');

  const canvas = await html2canvas(element, {
    scale: 2, // High resolution
    useCORS: true,
    backgroundColor: '#ffffff'
  });

  const imgData = canvas.toDataURL('image/jpeg', 1.0);
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  
  const width = imgWidth * ratio;
  const height = imgHeight * ratio;

  pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
  pdf.save(filename);
}

/**
 * Downloads ATS-safe raw text version (.txt)
 */
export function exportResumeToTxt(resumeData, filename = 'ATS_Resume.txt') {
  let txt = `${(resumeData.fullName || 'RESUME').toUpperCase()}\n`;
  txt += `${resumeData.email || ''} | ${resumeData.phone || ''} | ${resumeData.location || ''}\n`;
  if (resumeData.linkedin) txt += `LinkedIn: ${resumeData.linkedin}\n`;
  if (resumeData.github) txt += `Portfolio: ${resumeData.github}\n`;
  txt += `\n=========================================\n`;
  txt += `TARGET POSITION: ${resumeData.jobTitle || ''}\n`;
  txt += `=========================================\n\n`;

  if (resumeData.summary) {
    txt += `PROFESSIONAL SUMMARY\n--------------------\n${resumeData.summary}\n\n`;
  }

  if ((resumeData.extraAnswers && Object.keys(resumeData.extraAnswers).length > 0) || resumeData.otherSkills) {
    txt += `TECHNICAL SKILLS\n----------------\n`;
    if (resumeData.extraAnswers) {
      for (const [key, value] of Object.entries(resumeData.extraAnswers)) {
        if (value) {
          txt += `${key.toUpperCase()}: ${value}\n`;
        }
      }
    }
    if (resumeData.otherSkills) {
      txt += `OTHER SKILLS: ${resumeData.otherSkills}\n`;
    }
    txt += `\n`;
  } else if (resumeData.skills) {
    txt += `CORE SKILLS\n-----------\n${resumeData.skills}\n\n`;
  }

  if (resumeData.experiences && resumeData.experiences.length > 0) {
    txt += `WORK EXPERIENCE\n---------------\n`;
    resumeData.experiences.forEach(exp => {
      txt += `${exp.jobTitle || 'Role'} - ${exp.company || 'Company'} (${exp.startDate || ''} to ${exp.endDate || 'Present'})\n`;
      if (exp.responsibilities) {
        txt += `${exp.responsibilities}\n`;
      }
      txt += `\n`;
    });
  }

  if (resumeData.projects && resumeData.projects.length > 0) {
    const validProjects = resumeData.projects.filter(p => p.title || p.description);
    if (validProjects.length > 0) {
      txt += `KEY PROJECTS\n------------\n`;
      validProjects.forEach(proj => {
        txt += `${proj.title || 'Project'}${proj.techStack ? ` (Tech: ${proj.techStack})` : ''}\n`;
        if (proj.description) {
          txt += `${proj.description}\n`;
        }
        txt += `\n`;
      });
    }
  }

  if (resumeData.certifications && resumeData.certifications.length > 0) {
    const validCerts = resumeData.certifications.filter(c => c.name);
    if (validCerts.length > 0) {
      txt += `CERTIFICATIONS & ACHIEVEMENTS\n-----------------------------\n`;
      validCerts.forEach(cert => {
        txt += `${cert.name}${cert.issuer ? ` - ${cert.issuer}` : ''}${cert.year ? ` (${cert.year})` : ''}\n`;
      });
      txt += `\n`;
    }
  }

  const educations = resumeData.educations && resumeData.educations.length > 0 
    ? resumeData.educations 
    : (resumeData.degree || resumeData.university ? [{ degree: resumeData.degree, fieldOfStudy: resumeData.fieldOfStudy, university: resumeData.university, gradYear: resumeData.gradYear }] : []);

  if (educations.length > 0) {
    txt += `EDUCATION\n---------\n`;
    educations.forEach(edu => {
      txt += `${edu.degree || ''}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}\n`;
      if (edu.university || edu.gradYear) {
        txt += `${edu.university || ''} (${edu.gradYear || ''})\n`;
      }
      txt += `\n`;
    });
  }

  const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
