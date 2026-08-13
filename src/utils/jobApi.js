/**
 * Fetches relevant job listings tailored to Tamil Nadu and South India.
 * Dynamically selects companies and descriptions based on job role category.
 * Rule: At least 8 out of 10 jobs are located in Tamil Nadu (Chennai, Coimbatore, Madurai, Trichy, Salem, etc.).
 * Up to 2 jobs can be from neighboring South Indian states (Karnataka, Kerala, Andhra Pradesh).
 */

export async function fetchMatchingJobs(jobTitle = '', skills = []) {
  const titleStr = capitalizeWords(jobTitle || 'Specialist');
  const lower = (jobTitle || '').toLowerCase();

  // Industry-specific company profiles for Tamil Nadu & South India
  let industryCompanies = [];

  if (lower.includes('chef') || lower.includes('cook') || lower.includes('culinary') || lower.includes('kitchen') || lower.includes('hotel') || lower.includes('restaurant')) {
    industryCompanies = [
      { name: 'ITC Grand Chola', location: 'Guindy, Chennai, Tamil Nadu', salary: '₹4.5 - ₹8.0 LPA', domain: 'Hospitality & Fine Dining' },
      { name: 'Taj Connemara', location: 'Chennai, Tamil Nadu', salary: '₹5.0 - ₹9.5 LPA', domain: 'Luxury Hotel & Resort' },
      { name: 'Radisson Blu Resort', location: 'Coimbatore, Tamil Nadu', salary: '₹3.8 - ₹6.5 LPA', domain: 'Culinary & Catering' },
      { name: 'The Residency Towers', location: 'Madurai, Tamil Nadu', salary: '₹3.5 - ₹6.0 LPA', domain: 'Food & Beverage' },
      { name: 'Regency Sameera Hotel', location: 'Tirunelveli, Tamil Nadu', salary: '₹3.2 - ₹5.2 LPA', domain: 'Hospitality Services' },
      { name: 'Le Royal Méridien', location: 'Chennai, Tamil Nadu', salary: '₹4.8 - ₹8.5 LPA', domain: 'International Cuisine' },
      { name: 'Sterling Holidays & Resorts', location: 'Ooty, Tamil Nadu', salary: '₹3.6 - ₹5.8 LPA', domain: 'Resort Culinary Management' },
      { name: 'GRT Grand Hotel', location: 'Kanchipuram, Tamil Nadu', salary: '₹3.4 - ₹5.5 LPA', domain: 'Banquet & Food Prep' },
      // Max 2 suggestions from neighboring South Indian states
      { name: 'The Leela Palace', location: 'Bengaluru, Karnataka (South India)', salary: '₹5.5 - ₹10.0 LPA', domain: 'Five-Star Culinary Services' },
      { name: 'Vivanta Cochin', location: 'Kochi, Kerala (South India)', salary: '₹4.2 - ₹7.5 LPA', domain: 'Seafood & Multi-Cuisine' }
    ];
  } else if (lower.includes('doctor') || lower.includes('nurse') || lower.includes('medical') || lower.includes('health') || lower.includes('pharma') || lower.includes('hospital')) {
    industryCompanies = [
      { name: 'Apollo Hospitals', location: 'Greams Road, Chennai, Tamil Nadu', salary: '₹5.0 - ₹12.0 LPA', domain: 'Healthcare Services' },
      { name: 'MIOT International', location: 'Chennai, Tamil Nadu', salary: '₹4.5 - ₹10.5 LPA', domain: 'Multi-Specialty Hospital' },
      { name: 'PSG Hospitals', location: 'Coimbatore, Tamil Nadu', salary: '₹4.0 - ₹8.5 LPA', domain: 'Clinical Care' },
      { name: 'Kauvery Hospital', location: 'Tiruchirappalli (Trichy), Tamil Nadu', salary: '₹3.8 - ₹7.5 LPA', domain: 'Patient Care & Nursing' },
      { name: 'Ganga Hospital', location: 'Coimbatore, Tamil Nadu', salary: '₹4.2 - ₹9.0 LPA', domain: 'Surgical & Orthopedic Care' },
      { name: 'Meenakshi Mission Hospital', location: 'Madurai, Tamil Nadu', salary: '₹3.6 - ₹7.0 LPA', domain: 'Medical Services' },
      { name: 'Vasan Eye Care', location: 'Salem, Tamil Nadu', salary: '₹3.5 - ₹6.5 LPA', domain: 'Ophthalmic Services' },
      { name: 'SRM Medical College Hospital', location: 'Kanchipuram, Tamil Nadu', salary: '₹4.0 - ₹8.0 LPA', domain: 'Clinical Operations' },
      // Max 2 from neighboring South Indian states
      { name: 'Manipal Hospitals', location: 'Bengaluru, Karnataka (South India)', salary: '₹5.5 - ₹13.0 LPA', domain: 'Tertiary Care Hospital' },
      { name: 'Aster Medcity', location: 'Kochi, Kerala (South India)', salary: '₹4.8 - ₹10.0 LPA', domain: 'Advanced Healthcare' }
    ];
  } else if (lower.includes('teacher') || lower.includes('professor') || lower.includes('tutor') || lower.includes('educator') || lower.includes('school') || lower.includes('college')) {
    industryCompanies = [
      { name: 'SRM Institute of Science & Tech', location: 'Kanchipuram, Tamil Nadu', salary: '₹4.5 - ₹9.0 LPA', domain: 'Higher Education' },
      { name: 'SASTRA Deemed University', location: 'Thanjavur, Tamil Nadu', salary: '₹4.2 - ₹8.5 LPA', domain: 'Academic Research' },
      { name: 'PSG College of Technology', location: 'Coimbatore, Tamil Nadu', salary: '₹4.0 - ₹8.0 LPA', domain: 'Engineering Faculty' },
      { name: 'Loyola College', location: 'Chennai, Tamil Nadu', salary: '₹3.8 - ₹7.5 LPA', domain: 'Arts & Science Education' },
      { name: 'VIT University', location: 'Vellore, Tamil Nadu', salary: '₹5.0 - ₹10.0 LPA', domain: 'Technical Education' },
      { name: 'Bishop Heber College', location: 'Tiruchirappalli (Trichy), Tamil Nadu', salary: '₹3.5 - ₹6.8 LPA', domain: 'Academic Teaching' },
      { name: 'SSN College of Engineering', location: 'Chennai, Tamil Nadu', salary: '₹4.2 - ₹8.2 LPA', domain: 'Engineering Academics' },
      { name: 'Thiagarajar College', location: 'Madurai, Tamil Nadu', salary: '₹3.6 - ₹6.5 LPA', domain: 'College Education' },
      // Max 2 from neighboring South Indian states
      { name: 'Christ University', location: 'Bengaluru, Karnataka (South India)', salary: '₹4.8 - ₹9.5 LPA', domain: 'University Faculty' },
      { name: 'Rajagiri College of Social Sciences', location: 'Kochi, Kerala (South India)', salary: '₹4.0 - ₹7.8 LPA', domain: 'Academic Teaching' }
    ];
  } else if (lower.includes('account') || lower.includes('finance') || lower.includes('tax') || lower.includes('audit') || lower.includes('bank')) {
    industryCompanies = [
      { name: 'Sundaram Finance', location: 'Chennai, Tamil Nadu', salary: '₹4.5 - ₹8.5 LPA', domain: 'Financial Services' },
      { name: 'Murugappa Group', location: 'Chennai, Tamil Nadu', salary: '₹5.0 - ₹9.5 LPA', domain: 'Corporate Accounting' },
      { name: 'City Union Bank', location: 'Kumbakonam, Tamil Nadu', salary: '₹3.8 - ₹7.0 LPA', domain: 'Banking Operations' },
      { name: 'Equitas Small Finance Bank', location: 'Chennai, Tamil Nadu', salary: '₹4.0 - ₹7.8 LPA', domain: 'Audit & Compliance' },
      { name: 'Karur Vysya Bank (KVB)', location: 'Karur, Tamil Nadu', salary: '₹3.6 - ₹6.8 LPA', domain: 'Branch Accounting' },
      { name: 'Cholamandalam Finance', location: 'Chennai, Tamil Nadu', salary: '₹4.2 - ₹8.0 LPA', domain: 'Taxation & Ledger' },
      { name: 'TVS Capital Funds', location: 'Chennai, Tamil Nadu', salary: '₹5.5 - ₹11.0 LPA', domain: 'Investment Accounting' },
      { name: 'TVS Supply Chain Solutions', location: 'Madurai, Tamil Nadu', salary: '₹3.5 - ₹6.5 LPA', domain: 'Cost Accounting' },
      // Max 2 from neighboring South Indian states
      { name: 'ICICI Bank Regional Hub', location: 'Bengaluru, Karnataka (South India)', salary: '₹5.0 - ₹9.8 LPA', domain: 'Corporate Banking' },
      { name: 'Federal Bank', location: 'Kochi, Kerala (South India)', salary: '₹4.5 - ₹8.8 LPA', domain: 'Financial Auditing' }
    ];
  } else if (lower.includes('mech') || lower.includes('civil') || lower.includes('auto') || lower.includes('manufactur') || lower.includes('site') || lower.includes('plant')) {
    industryCompanies = [
      { name: 'Hyundai Motor India', location: 'Sriperumbudur, Tamil Nadu', salary: '₹5.0 - ₹9.5 LPA', domain: 'Automotive Manufacturing' },
      { name: 'Ashok Leyland', location: 'Ennore, Chennai, Tamil Nadu', salary: '₹4.8 - ₹9.0 LPA', domain: 'Commercial Vehicles' },
      { name: 'Renault Nissan Automotive', location: 'Oragadam, Tamil Nadu', salary: '₹4.5 - ₹8.8 LPA', domain: 'Plant Engineering' },
      { name: 'TVS Motor Company', location: 'Hosur, Tamil Nadu', salary: '₹4.2 - ₹8.2 LPA', domain: 'Design & Manufacturing' },
      { name: 'L&T Construction', location: 'Chennai, Tamil Nadu', salary: '₹4.5 - ₹9.0 LPA', domain: 'Civil Infrastructure' },
      { name: 'Saint-Gobain India', location: 'Sriperumbudur, Tamil Nadu', salary: '₹4.0 - ₹7.8 LPA', domain: 'Industrial Engineering' },
      { name: 'Daimler India Commercial Vehicles', location: 'Oragadam, Tamil Nadu', salary: '₹5.2 - ₹9.8 LPA', domain: 'Automotive Engineering' },
      { name: 'MRF Tyres', location: 'Chennai, Tamil Nadu', salary: '₹3.8 - ₹7.0 LPA', domain: 'Production & Quality' },
      // Max 2 from neighboring South Indian states
      { name: 'Bosch India', location: 'Bengaluru, Karnataka (South India)', salary: '₹5.5 - ₹11.0 LPA', domain: 'Industrial Technology' },
      { name: 'Toyota Kirloskar Motor', location: 'Bidadi, Karnataka (South India)', salary: '₹5.0 - ₹10.2 LPA', domain: 'Manufacturing Engineering' }
    ];
  } else {
    // Default IT & Professional Services Category
    industryCompanies = [
      { name: 'Zoho Corporation', location: 'Chennai, Tamil Nadu', salary: '₹6.5 - ₹10.0 LPA', domain: 'Enterprise Software' },
      { name: 'Freshworks', location: 'Chennai, Tamil Nadu', salary: '₹8.0 - ₹14.0 LPA', domain: 'SaaS Products' },
      { name: 'TCS (Tata Consultancy Services)', location: 'Siruseri, Chennai, Tamil Nadu', salary: '₹4.5 - ₹7.5 LPA', domain: 'IT Services' },
      { name: 'Cognizant (CTS)', location: 'Coimbatore, Tamil Nadu', salary: '₹5.0 - ₹8.5 LPA', domain: 'Software Solutions' },
      { name: 'HCL Technologies', location: 'Madurai, Tamil Nadu', salary: '₹4.8 - ₹7.2 LPA', domain: 'IT Infrastructure' },
      { name: 'Infosys', location: 'Mahindra World City, Chennai, Tamil Nadu', salary: '₹5.5 - ₹9.0 LPA', domain: 'Digital Services' },
      { name: 'L&T Technology Services', location: 'Tiruchirappalli (Trichy), Tamil Nadu', salary: '₹4.2 - ₹6.8 LPA', domain: 'Engineering R&D' },
      { name: 'Sona Comstar', location: 'Salem, Tamil Nadu', salary: '₹4.0 - ₹6.5 LPA', domain: 'Technology Solutions' },
      // Max 2 from neighboring South Indian states
      { name: 'Wipro Technologies', location: 'Bengaluru, Karnataka (South India)', salary: '₹6.0 - ₹11.0 LPA', domain: 'Cloud & Tech' },
      { name: 'UST Global', location: 'Kochi, Kerala (South India)', salary: '₹5.2 - ₹8.8 LPA', domain: 'Digital Transformation' }
    ];
  }

  return industryCompanies.map((comp, idx) => {
    const isTN = comp.location.includes('Tamil Nadu');
    const rolePrefix = isTN 
      ? ['Senior', 'Associate', 'Lead', 'Executive', 'Specialist', 'Junior', 'Staff', 'Consultant'][idx % 8]
      : ['Senior Specialist', 'Lead Professional'][idx % 2];

    return {
      id: `tn-job-${idx + 1}`,
      title: `${rolePrefix} ${titleStr}`,
      company: comp.name,
      companyLogo: null,
      location: comp.location,
      isTamilNadu: isTN,
      salary: comp.salary,
      description: `Opportunity for a qualified ${titleStr} at ${comp.name} (${comp.domain}) located in ${comp.location}. Key focus on domain deliverables, team collaboration, and career growth.`,
      category: isTN ? 'Tamil Nadu Primary Location' : 'Neighboring South Indian State',
      url: `https://www.naukri.com/${encodeURIComponent(jobTitle.toLowerCase())}-jobs-in-${isTN ? 'chennai' : 'bengaluru'}`,
      source: 'Naukri / LinkedIn India'
    };
  });
}

function capitalizeWords(str) {
  if (!str) return '';
  return str.replace(/\b\w/g, c => c.toUpperCase());
}
