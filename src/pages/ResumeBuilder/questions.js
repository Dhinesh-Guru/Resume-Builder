export const JOB_SPECIFIC_QUESTIONS = {
  dev: [
    { id: 'languages', label: 'Programming Languages', type: 'text', placeholder: 'JavaScript, Python, Java, C++, TypeScript', required: true },
    { id: 'frameworks', label: 'Frameworks & Libraries', type: 'text', placeholder: 'React, Node.js, Express, Next.js, Django', required: true },
    { id: 'projects', label: 'Key Projects', type: 'textarea', placeholder: 'Project Name - Brief description, tech stack used, key outcome (e.g. E-Commerce Store using MERN stack, processed $10k+ sales)' },
    { id: 'tools', label: 'Developer Tools & DBs', type: 'text', placeholder: 'Git, Docker, PostgreSQL, MongoDB, AWS' }
  ],
  qa_tester: [
    { id: 'testingTypes', label: 'Testing Types', type: 'text', placeholder: 'Manual Testing, Automated Testing, Regression, API Testing, Performance Testing', required: true },
    { id: 'testingTools', label: 'Testing Tools & Frameworks', type: 'text', placeholder: 'Selenium, Postman, Cypress, JUnit, Playwright', required: true },
    { id: 'bugTrackers', label: 'Bug Tracking & Management', type: 'text', placeholder: 'Jira, Bugzilla, TestRail, Azure DevOps' },
    { id: 'testArtifacts', label: 'Test Deliverables', type: 'textarea', placeholder: 'Authored 200+ Test Cases, Test Plans, Defect Reports with 98% resolution rate' }
  ],
  quality_analyst: [
    { id: 'qualityStandards', label: 'Quality Standards & Frameworks', type: 'text', placeholder: 'ISO 9001, Six Sigma, CMMI, TQM', required: true },
    { id: 'auditExp', label: 'Audit & Process Inspection', type: 'textarea', placeholder: 'Conducted internal quality audits, identified process bottlenecks, reduced defect rate by 25%' },
    { id: 'tools', label: 'QC Tools & Methodologies', type: 'text', placeholder: 'Pareto Charts, Fishbone Diagrams, SPC, Root Cause Analysis' }
  ],
  data_analyst: [
    { id: 'analysisTools', label: 'Analytics & BI Tools', type: 'text', placeholder: 'SQL, Python (Pandas/NumPy), Tableau, Power BI, Excel (VLOOKUP, Pivot)', required: true },
    { id: 'datasets', label: 'Data Sources & Modeling', type: 'text', placeholder: 'Relational DBs, Data Warehouses, ETL Pipelines' },
    { id: 'insights', label: 'Key Analytical Achievements', type: 'textarea', placeholder: 'Built interactive dashboard tracking $2M monthly sales, automated data cleaning reducing report prep time by 40%' }
  ],
  accountant: [
    { id: 'software', label: 'Accounting Software', type: 'text', placeholder: 'Tally Prime, QuickBooks, SAP FICO, MS Excel', required: true },
    { id: 'certifications', label: 'Financial Certifications', type: 'text', placeholder: 'CA, CPA, ACCA, CFA, CMA' },
    { id: 'accountingTypes', label: 'Key Domains', type: 'text', placeholder: 'Taxation (GST/TDS), Financial Auditing, Payroll, Accounts Payable/Receivable' },
    { id: 'achievements', label: 'Financial Impact', type: 'textarea', placeholder: 'Managed yearly budget of $1.5M, streamlined audit reconciliation reducing errors by 30%' }
  ],
  project_mgr: [
    { id: 'methodologies', label: 'Project Methodologies', type: 'text', placeholder: 'Agile, Scrum, Kanban, Waterfall, PMI-PMP', required: true },
    { id: 'pmTools', label: 'Management Tools', type: 'text', placeholder: 'Jira, Asana, Trello, MS Project, Slack' },
    { id: 'teamMetrics', label: 'Team Size & Budget Managed', type: 'text', placeholder: 'Cross-functional team of 15+ engineers, $500k budget' },
    { id: 'achievements', label: 'Key Accomplishments', type: 'textarea', placeholder: 'Delivered 5 enterprise software projects on time and 10% under budget' }
  ],
  designer: [
    { id: 'designTools', label: 'Design Tools', type: 'text', placeholder: 'Figma, Adobe XD, Photoshop, Illustrator, After Effects', required: true },
    { id: 'specialization', label: 'Design Specialties', type: 'text', placeholder: 'UI/UX Design, Wireframing, Design Systems, Mobile App Design' },
    { id: 'portfolioUrl', label: 'Portfolio Link / Behance', type: 'text', placeholder: 'https://behance.net/yourprofile or https://dribbble.com/yourname' },
    { id: 'impact', label: 'Key Design Achievements', type: 'textarea', placeholder: 'Redesigned checkout flow increasing user conversion by 18%' }
  ],
  marketing: [
    { id: 'channels', label: 'Marketing Channels', type: 'text', placeholder: 'SEO, Google Ads, Meta Ads, Email Marketing, Content Strategy', required: true },
    { id: 'marketingTools', label: 'Tools & Platforms', type: 'text', placeholder: 'Google Analytics, HubSpot, SEMrush, Mailchimp' },
    { id: 'campaignMetrics', label: 'Campaign Impact', type: 'textarea', placeholder: 'Scaled organic traffic by 150% in 6 months, managed $20k monthly ad spend generating 3x ROAS' }
  ],
  hr_recruiter: [
    { id: 'hrTools', label: 'HRMS & ATS Tools', type: 'text', placeholder: 'Workday, BambooHR, LinkedIn Recruiter, Greenhouse, Zoho Recruit', required: true },
    { id: 'recruitmentVolume', label: 'Hiring Volume & Domains', type: 'text', placeholder: 'Hired 50+ tech & non-tech roles annually across US & APAC' },
    { id: 'hrInitiatives', label: 'HR Initiatives & Compliance', type: 'textarea', placeholder: 'Revamped onboarding workflow reducing 90-day employee attrition by 20%' }
  ],
  sales_exec: [
    { id: 'crmTools', label: 'CRM & Sales Tools', type: 'text', placeholder: 'Salesforce, HubSpot CRM, Zoho CRM, Outreach', required: true },
    { id: 'targetsAchieved', label: 'Quota & Revenue Performance', type: 'text', placeholder: 'Consistently achieved 120% of quarterly sales quota ($800k ARR)' },
    { id: 'salesType', label: 'Sales Domain', type: 'text', placeholder: 'B2B SaaS, Enterprise Sales, Cold Outreach, Deal Closure' }
  ],
  devops: [
    { id: 'cloudPlatforms', label: 'Cloud Platforms', type: 'text', placeholder: 'AWS, Azure, Google Cloud Platform (GCP)', required: true },
    { id: 'devopsTools', label: 'CI/CD & IaC Tools', type: 'text', placeholder: 'Docker, Kubernetes, Terraform, Jenkins, GitHub Actions, Ansible', required: true },
    { id: 'monitoring', label: 'Monitoring & Logging', type: 'text', placeholder: 'Prometheus, Grafana, ELK Stack, Datadog' }
  ],
  sys_admin: [
    { id: 'osProficiency', label: 'Operating Systems', type: 'text', placeholder: 'Linux (Ubuntu/CentOS/RHEL), Windows Server, Active Directory', required: true },
    { id: 'networking', label: 'Networking & Security', type: 'text', placeholder: 'DNS, DHCP, VPN, Firewalls, Cisco, Backup & Recovery' },
    { id: 'scripting', label: 'Scripting & Automation', type: 'text', placeholder: 'Bash, PowerShell, Python' }
  ]
};

// Generic fallback questions for custom user-entered job titles
export const DEFAULT_EXTRA_QUESTIONS = [
  { id: 'specializedSkills', label: 'Key Domain Skills', type: 'text', placeholder: 'List key technical or domain skills relevant to this role', required: true },
  { id: 'coreTools', label: 'Tools & Technologies', type: 'text', placeholder: 'Tools, software, or equipment used daily' },
  { id: 'keyProjects', label: 'Notable Achievements or Projects', type: 'textarea', placeholder: 'Describe 1-2 major achievements or projects for this role' }
];
