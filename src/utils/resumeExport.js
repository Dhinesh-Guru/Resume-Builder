import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Downloads standard ATS-friendly 100% Vector Native Text PDF with selectable text & embedded metadata
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
    const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    if (!allowTwoPages) {
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const width = imgWidth * ratio;
      const height = imgHeight * ratio;
      const xOffset = Math.max(0, (pdfWidth - width) / 2);
      pdf.addImage(imgData, 'JPEG', xOffset, 0, width, height);
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
 * Text is 100% selectable, copyable, crisp, and ATS compliant.
 */
export function exportNativeVectorPdf(resumeData, filename = 'ATS_Resume.pdf', allowTwoPages = false) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = 210;
  const pdfHeight = 297;
  const margin = 15;
  const contentWidth = pdfWidth - (margin * 2);

  // Embed resume JSON metadata inside PDF metadata for instant loss-less re-importing
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

  let y = 15;

  const checkPageBreak = (neededHeight) => {
    if (y + neededHeight > pdfHeight - 12) {
      if (allowTwoPages) {
        pdf.addPage();
        y = 15;
      }
    }
  };

  // 1. Header Name
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.setTextColor(17, 24, 39);
  pdf.text((resumeData.fullName || 'YOUR NAME').toUpperCase(), pdfWidth / 2, y, { align: 'center' });
  y += 6;

  // Job Title
  if (resumeData.jobTitle) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(55, 65, 81);
    pdf.text(resumeData.jobTitle, pdfWidth / 2, y, { align: 'center' });
    y += 5;
  }

  // Contact Line
  const contactParts = [
    resumeData.email,
    resumeData.phone,
    resumeData.location,
    resumeData.linkedin,
    resumeData.github
  ].filter(Boolean);

  if (contactParts.length > 0) {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.5);
    pdf.setTextColor(75, 85, 99);
    pdf.text(contactParts.join(' • '), pdfWidth / 2, y, { align: 'center' });
    y += 5;
  }

  // Header Divider
  pdf.setDrawColor(17, 24, 39);
  pdf.setLineWidth(0.4);
  pdf.line(margin, y, pdfWidth - margin, y);
  y += 6;

  const renderSectionHeader = (title) => {
    checkPageBreak(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(17, 24, 39);
    pdf.text(title.toUpperCase(), margin, y);
    y += 1.5;
    pdf.setDrawColor(17, 24, 39);
    pdf.setLineWidth(0.3);
    pdf.line(margin, y, pdfWidth - margin, y);
    y += 4.5;
  };

  // 2. Summary
  if (resumeData.summary) {
    renderSectionHeader('PROFESSIONAL SUMMARY');
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(55, 65, 81);
    const summaryLines = pdf.splitTextToSize(resumeData.summary, contentWidth);
    summaryLines.forEach(line => {
      checkPageBreak(4.2);
      pdf.text(line, margin, y);
      y += 4.2;
    });
    y += 2.5;
  }

  // 3. Technical Skills
  const LABEL_MAP = {
    languages: 'Programming Languages',
    frameworks: 'Frameworks & Libraries',
    tools: 'Developer Tools & DBs',
    testingTypes: 'Testing Types',
    testingTools: 'Testing Tools',
    bugTrackers: 'Bug Tracking',
    software: 'Software Proficiency',
    accountingTypes: 'Accounting Domains',
    methodologies: 'Project Methodologies',
    pmTools: 'Management Tools',
    designTools: 'Design Tools',
    channels: 'Marketing Channels',
    marketingTools: 'Marketing Tools',
    hrTools: 'HRMS & ATS Tools',
    crmTools: 'CRM Tools',
    devopsTools: 'CI/CD & IaC Tools',
    cloudPlatforms: 'Cloud Platforms',
    osProficiency: 'Operating Systems',
    specializedSkills: 'Domain Skills',
    coreTools: 'Tools & Technologies'
  };

  const hasExtra = resumeData.extraAnswers && Object.values(resumeData.extraAnswers).some(v => v && v.trim());
  if (hasExtra || resumeData.skills || resumeData.otherSkills) {
    renderSectionHeader('TECHNICAL SKILLS');

    if (hasExtra) {
      Object.entries(resumeData.extraAnswers).forEach(([key, val]) => {
        if (val && val.trim()) {
          checkPageBreak(4.5);
          const label = (LABEL_MAP[key] || key) + ': ';
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(9);
          pdf.setTextColor(17, 24, 39);
          pdf.text(label, margin, y);
          const labelWidth = pdf.getTextWidth(label);

          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(55, 65, 81);
          const valLines = pdf.splitTextToSize(val, contentWidth - labelWidth);
          valLines.forEach((vLine, vIdx) => {
            if (vIdx === 0) {
              pdf.text(vLine, margin + labelWidth, y);
            } else {
              checkPageBreak(4.2);
              pdf.text(vLine, margin + 4, y);
            }
            y += 4.2;
          });
        }
      });
    }

    if (resumeData.otherSkills && resumeData.otherSkills.trim()) {
      checkPageBreak(4.5);
      const label = 'Additional Tools & Software: ';
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.setTextColor(17, 24, 39);
      pdf.text(label, margin, y);
      const labelWidth = pdf.getTextWidth(label);

      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(55, 65, 81);
      const valLines = pdf.splitTextToSize(resumeData.otherSkills, contentWidth - labelWidth);
      valLines.forEach((vLine, vIdx) => {
        if (vIdx === 0) {
          pdf.text(vLine, margin + labelWidth, y);
        } else {
          checkPageBreak(4.2);
          pdf.text(vLine, margin + 4, y);
        }
        y += 4.2;
      });
    }

    if (!hasExtra && resumeData.skills) {
      checkPageBreak(4.5);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(55, 65, 81);
      const sLines = pdf.splitTextToSize(resumeData.skills, contentWidth);
      sLines.forEach(l => {
        checkPageBreak(4.2);
        pdf.text(l, margin, y);
        y += 4.2;
      });
    }

    y += 2.5;
  }

  // 4. Work Experience
  const experiences = resumeData.experiences || [];
  const validExp = experiences.filter(e => e.jobTitle?.trim() || e.company?.trim());
  if (validExp.length > 0) {
    renderSectionHeader('WORK EXPERIENCE');
    validExp.forEach(exp => {
      checkPageBreak(7);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9.5);
      pdf.setTextColor(17, 24, 39);
      const titleText = exp.jobTitle || 'Role Title';
      pdf.text(titleText, margin, y);
      const titleWidth = pdf.getTextWidth(titleText);

      if (exp.company) {
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(55, 65, 81);
        pdf.text(` — ${exp.company}`, margin + titleWidth, y);
      }

      if (exp.startDate || exp.endDate) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8.5);
        pdf.setTextColor(75, 85, 99);
        const dateStr = `${exp.startDate || ''} – ${exp.endDate || 'Present'}`;
        pdf.text(dateStr, pdfWidth - margin, y, { align: 'right' });
      }
      y += 4.2;

      if (exp.responsibilities) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(55, 65, 81);
        const bullets = exp.responsibilities.split('\n').map(b => b.trim()).filter(Boolean);
        bullets.forEach(b => {
          const cleanB = b.replace(/^•\s*/, '');
          const bLines = pdf.splitTextToSize(cleanB, contentWidth - 4);
          bLines.forEach((bLine, bIdx) => {
            checkPageBreak(4.2);
            if (bIdx === 0) {
              pdf.text('•', margin + 1, y);
              pdf.text(bLine, margin + 5, y);
            } else {
              pdf.text(bLine, margin + 5, y);
            }
            y += 4.2;
          });
        });
      }
      y += 2;
    });
    y += 1.5;
  }

  // 5. Key Projects
  const projects = resumeData.projects || [];
  const validProj = projects.filter(p => p.title?.trim() || p.description?.trim());
  if (validProj.length > 0) {
    renderSectionHeader('KEY PROJECTS');
    validProj.forEach((proj, pIdx) => {
      checkPageBreak(7);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9.5);
      pdf.setTextColor(17, 24, 39);
      pdf.text(proj.title || `Project #${pIdx + 1}`, margin, y);
      y += 4.2;

      if (proj.techStack) {
        checkPageBreak(4.2);
        pdf.setFont('helvetica', 'italic');
        pdf.setFontSize(8.5);
        pdf.setTextColor(75, 85, 99);
        pdf.text(`Tech Stack: ${proj.techStack}`, margin, y);
        y += 4.2;
      }

      if (proj.description) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(55, 65, 81);
        const pBullets = proj.description.split('\n').map(b => b.trim()).filter(Boolean);
        pBullets.forEach(b => {
          const cleanB = b.replace(/^•\s*/, '');
          const bLines = pdf.splitTextToSize(cleanB, contentWidth - 4);
          bLines.forEach((bLine, bIdx) => {
            checkPageBreak(4.2);
            if (bIdx === 0) {
              pdf.text('•', margin + 1, y);
              pdf.text(bLine, margin + 5, y);
            } else {
              pdf.text(bLine, margin + 5, y);
            }
            y += 4.2;
          });
        });
      }
      y += 2;
    });
    y += 1.5;
  }

  // 6. Certifications
  const certs = resumeData.certifications || [];
  const validCerts = certs.filter(c => c.name?.trim());
  if (validCerts.length > 0) {
    renderSectionHeader('CERTIFICATIONS & ACHIEVEMENTS');
    validCerts.forEach(cert => {
      checkPageBreak(4.5);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.setTextColor(17, 24, 39);
      pdf.text(cert.name, margin, y);
      const nameWidth = pdf.getTextWidth(cert.name);

      if (cert.issuer) {
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(75, 85, 99);
        pdf.text(` — ${cert.issuer}`, margin + nameWidth, y);
      }

      if (cert.year) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8.5);
        pdf.setTextColor(75, 85, 99);
        pdf.text(cert.year, pdfWidth - margin, y, { align: 'right' });
      }
      y += 4.5;
    });
    y += 2;
  }

  // 7. Education
  const educations = (resumeData.educations && resumeData.educations.length > 0)
    ? resumeData.educations.filter(ed => ed.degree?.trim() || ed.university?.trim())
    : (resumeData.degree || resumeData.university ? [{ degree: resumeData.degree, fieldOfStudy: resumeData.fieldOfStudy, university: resumeData.university, gradYear: resumeData.gradYear }] : []);

  if (educations.length > 0) {
    renderSectionHeader('EDUCATION');
    educations.forEach(edu => {
      checkPageBreak(7);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9.5);
      pdf.setTextColor(17, 24, 39);
      const degText = `${edu.degree || ''}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}${edu.score ? ` — ${edu.score}` : ''}`;
      pdf.text(degText, margin, y);

      if (edu.gradYear) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8.5);
        pdf.setTextColor(75, 85, 99);
        pdf.text(edu.gradYear, pdfWidth - margin, y, { align: 'right' });
      }
      y += 4.2;

      if (edu.university) {
        checkPageBreak(4.2);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8.5);
        pdf.setTextColor(75, 85, 99);
        pdf.text(edu.university, margin, y);
        y += 4.5;
      }
    });
  }

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
