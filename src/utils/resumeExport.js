import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Downloads 100% Vector Native Text PDF with editable text, full A4 page fill, and ATS compliance.
 */
export async function exportResumeToPdf(elementId, filename = 'ATS_Resume.pdf', allowTwoPages = false, resumeData = null) {
  if (resumeData) {
    return exportNativeVectorPdf(resumeData, filename, allowTwoPages);
  }

  // Fallback canvas export if resumeData is not provided
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Resume element not found for export');

  const pageBreaks = element.querySelectorAll('.page-break-indicator');
  pageBreaks.forEach(el => { el.style.display = 'none'; });

  try {
    const canvas = await html2canvas(element, { scale: 2.5, useCORS: true, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    if (!allowTwoPages) {
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const renderW = imgWidth * ratio;
      const renderH = imgHeight * ratio;
      const xOffset = (pdfWidth - renderW) / 2;
      const yOffset = (pdfHeight - renderH) / 2;
      pdf.addImage(imgData, 'JPEG', xOffset, yOffset, renderW, renderH);
    } else {
      const pageRenderWidth = pdfWidth;
      const pageRenderHeight = (imgHeight * pdfWidth) / imgWidth;
      let heightLeft = pageRenderHeight;
      let position = 0;
      pdf.addImage(imgData, 'JPEG', 0, position, pageRenderWidth, pageRenderHeight);
      heightLeft -= pdfHeight;
      while (heightLeft > 5) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pageRenderWidth, pageRenderHeight);
        heightLeft -= pdfHeight;
      }
    }

    pdf.save(filename);
  } finally {
    pageBreaks.forEach(el => { el.style.display = ''; });
  }
}

/**
 * Generates 100% True Vector Native Text PDF using jsPDF.
 * Uses a Two-Pass Auto-Fit Engine to measure exact document height and expand vertical Y-spacing
 * so that single-page resumes fill 92% - 95% of the A4 page height top-to-bottom without bottom gaps.
 */
export function exportNativeVectorPdf(resumeData, filename = 'ATS_Resume.pdf', allowTwoPages = false) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = 210;
  const pdfHeight = 297;
  const margin = 15;
  const contentWidth = pdfWidth - (margin * 2);

  try {
    pdf.setProperties({
      title: filename,
      subject: JSON.stringify(resumeData),
      author: resumeData.fullName || 'ATS Resume Builder',
      keywords: 'ATS_RESUME_BUILDER_DATA'
    });
  } catch (e) {
    console.warn('Failed to embed PDF metadata:', e);
  }

  const summaryLen = (resumeData.summary || '').length;
  const expCount = (resumeData.experiences || []).filter(e => e.jobTitle || e.company).length;
  const expBullets = (resumeData.experiences || []).reduce((acc, e) => acc + (e.responsibilities ? e.responsibilities.split('\n').length : 0), 0);
  const projCount = (resumeData.projects || []).filter(p => p.title || p.description).length;
  const projBullets = (resumeData.projects || []).reduce((acc, p) => acc + (p.description ? p.description.split('\n').length : 0), 0);
  const eduCount = (resumeData.educations || []).filter(ed => ed.degree || ed.university).length || 1;
  const certCount = (resumeData.certifications || []).filter(c => c.name).length;
  const skillCount = Object.keys(resumeData.extraAnswers || {}).length + (resumeData.otherSkills ? 1 : 0);

  const totalUnits = (summaryLen / 100) + (expCount * 2) + (expBullets * 1.2) + (projCount * 2) + (projBullets * 1.2) + (eduCount * 1.8) + (certCount * 1.2) + (skillCount * 1.2);

  let baseFs = 9.5;
  let headerFs = 10.5;
  let nameFs = 17;
  let titleFs = 10.5;

  if (totalUnits > 38) {
    baseFs = 8.8;
    headerFs = 10.0;
    nameFs = 15.5;
    titleFs = 10.0;
  } else if (totalUnits < 20) {
    baseFs = 10.0;
    headerFs = 11.0;
    nameFs = 18.0;
    titleFs = 11.0;
  }

  const initialSecGap = 5.5;
  const initialItemGap = 3.2;
  const initialLineH = baseFs * 0.44;

  const estimatedY = runRenderPass(initialSecGap, initialItemGap, initialLineH, false);

  let finalSecGap = initialSecGap;
  let finalItemGap = initialItemGap;
  let finalLineH = initialLineH;

  if (!allowTwoPages) {
    if (estimatedY < 250) {
      // Gently balance shorter documents without over-stretching line height
      const deficit = Math.min(18, 258 - estimatedY);
      finalSecGap = initialSecGap + Math.min(1.8, deficit * 0.12);
      finalItemGap = initialItemGap + Math.min(1.0, deficit * 0.08);
      finalLineH = initialLineH + Math.min(0.25, deficit * 0.015);
    } else if (estimatedY > 268) {
      // Slightly compress longer documents to guarantee fitting on 1 page comfortably
      const overflow = estimatedY - 265;
      finalSecGap = Math.max(4.0, initialSecGap - overflow * 0.12);
      finalItemGap = Math.max(2.2, initialItemGap - overflow * 0.08);
      finalLineH = Math.max(3.8, initialLineH - overflow * 0.015);
    }
  }

  runRenderPass(finalSecGap, finalItemGap, finalLineH, true);

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
      txt += `${edu.degree || ''}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}${edu.score ? ` (${edu.score})` : ''}\n`;
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

/**
 * Downloads full resume data as a structured JSON backup (.json)
 */
export function exportResumeToJson(resumeData, filename = 'ATS_Resume_Backup.json') {
  const jsonStr = JSON.stringify(resumeData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
