import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Downloads standard ATS-friendly PDF of the element, embeds JSON metadata, and adds invisible searchable text streams
 */
export async function exportResumeToPdf(elementId, filename = 'ATS_Resume.pdf', allowTwoPages = false, resumeData = null) {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Resume element not found for export');

  // Temporarily hide visual page break indicators during canvas capture
  const pageBreaks = element.querySelectorAll('.page-break-indicator');
  pageBreaks.forEach(el => { el.style.display = 'none'; });

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // High resolution
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Embed resume JSON metadata inside PDF header so it can be re-imported with 100% accuracy
    if (resumeData) {
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
    }

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // Render image
    if (!allowTwoPages) {
      // STRICT SINGLE PAGE MODE: Guaranteed to NEVER spill onto Page 2
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const width = imgWidth * ratio;
      const height = imgHeight * ratio;

      // Center horizontally on A4 page
      const xOffset = Math.max(0, (pdfWidth - width) / 2);
      pdf.addImage(imgData, 'JPEG', xOffset, 0, width, height);
    } else {
      // MULTI-PAGE MODE: Full width rendering with clean page slicing
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

    // Render invisible real text streams into PDF structure for 100% PDF text parsing & ATS searchability
    if (resumeData) {
      try {
        pdf.setTextColor(255, 255, 255); // Invisible white text layer
        pdf.setFontSize(1); // Micro 1pt size

        const textLines = [
          resumeData.fullName,
          `${resumeData.email || ''} ${resumeData.phone || ''} ${resumeData.location || ''} ${resumeData.linkedin || ''} ${resumeData.github || ''}`,
          `JOB TITLE: ${resumeData.jobTitle || ''}`,
          `SUMMARY: ${resumeData.summary || ''}`,
          `SKILLS: ${resumeData.otherSkills || ''}`,
          ...(resumeData.experiences || []).map(e => `EXPERIENCE: ${e.jobTitle || ''} ${e.company || ''} ${e.startDate || ''} ${e.endDate || ''} ${e.responsibilities || ''}`),
          ...(resumeData.projects || []).map(p => `PROJECT: ${p.title || ''} ${p.techStack || ''} ${p.description || ''}`),
          ...(resumeData.certifications || []).map(c => `CERTIFICATION: ${c.name || ''} ${c.issuer || ''} ${c.year || ''}`),
          ...(resumeData.educations || []).map(ed => `EDUCATION: ${ed.degree || ''} ${ed.fieldOfStudy || ''} ${ed.university || ''} ${ed.gradYear || ''} ${ed.score || ''}`)
        ].filter(Boolean);

        let tY = 5;
        textLines.forEach(line => {
          pdf.text(line.replace(/[\r\n]+/g, ' ').slice(0, 400), 5, tY);
          tY += 2;
        });
      } catch (tErr) {
        console.warn('Text layer render warning:', tErr);
      }
    }

    pdf.save(filename);
  } finally {
    // Restore page break indicators after export
    pageBreaks.forEach(el => { el.style.display = ''; });
  }
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
