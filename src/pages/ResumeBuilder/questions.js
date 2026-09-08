export const JOB_SPECIFIC_QUESTIONS = {
  dev: [
    { id: 'languages', label: 'Programming Languages', type: 'text', placeholder: 'JavaScript, Python, Java, C++, TypeScript', required: true },
    { id: 'frameworks', label: 'Frameworks & Libraries', type: 'text', placeholder: 'React, Node.js, Express, Next.js, Django', required: true },
    { id: 'tools', label: 'Developer Tools & DBs', type: 'text', placeholder: 'Git, Docker, PostgreSQL, MongoDB, AWS' }
  ],
  qa_tester: [
    { id: 'testingTypes', label: 'Testing Types', type: 'text', placeholder: 'Manual Testing, Automated Testing, Regression, API Testing', required: true },
    { id: 'testingTools', label: 'Testing Tools & Frameworks', type: 'text', placeholder: 'Selenium, Postman, Cypress, JUnit, Playwright', required: true },
    { id: 'bugTrackers', label: 'Bug Tracking & Management', type: 'text', placeholder: 'Jira, Bugzilla, TestRail, Azure DevOps' }
  ],
  quality_analyst: [
    { id: 'qualityStandards', label: 'Quality Standards & Frameworks', type: 'text', placeholder: 'ISO 9001, Six Sigma, CMMI, TQM', required: true },
    { id: 'tools', label: 'QC Tools & Methodologies', type: 'text', placeholder: 'Pareto Charts, Fishbone Diagrams, SPC, Root Cause Analysis' }
  ],
  data_analyst: [
    { id: 'analysisTools', label: 'Analytics & BI Tools', type: 'text', placeholder: 'SQL, Python (Pandas/NumPy), Tableau, Power BI, Excel', required: true },
    { id: 'datasets', label: 'Data Sources & Modeling', type: 'text', placeholder: 'Relational DBs, Data Warehouses, ETL Pipelines' }
  ],
  accountant: [
    { id: 'software', label: 'Accounting Software', type: 'text', placeholder: 'Tally Prime, QuickBooks, SAP FICO, MS Excel', required: true },
    { id: 'accountingTypes', label: 'Key Domains', type: 'text', placeholder: 'Taxation (GST/TDS), Financial Auditing, Payroll, Accounts Payable/Receivable' }
  ],
  project_mgr: [
    { id: 'methodologies', label: 'Project Methodologies', type: 'text', placeholder: 'Agile, Scrum, Kanban, Waterfall, PMI-PMP', required: true },
    { id: 'pmTools', label: 'Management Tools', type: 'text', placeholder: 'Jira, Asana, Trello, MS Project, Slack' },
    { id: 'teamMetrics', label: 'Team Size & Budget Managed', type: 'text', placeholder: 'Cross-functional team of 15+ engineers, $500k budget' }
  ],
  designer: [
    { id: 'designTools', label: 'Design Tools', type: 'text', placeholder: 'Figma, Adobe XD, Photoshop, Illustrator, After Effects', required: true },
    { id: 'specialization', label: 'Design Specialties', type: 'text', placeholder: 'UI/UX Design, Wireframing, Design Systems, Mobile App Design' },
    { id: 'portfolioUrl', label: 'Portfolio Link / Behance', type: 'text', placeholder: 'https://behance.net/yourprofile or https://dribbble.com/yourname' }
  ],
  marketing: [
    { id: 'channels', label: 'Marketing Channels', type: 'text', placeholder: 'SEO, Google Ads, Meta Ads, Email Marketing, Content Strategy', required: true },
    { id: 'marketingTools', label: 'Tools & Platforms', type: 'text', placeholder: 'Google Analytics, HubSpot, SEMrush, Mailchimp' }
  ],
  hr_recruiter: [
    { id: 'hrTools', label: 'HRMS & ATS Tools', type: 'text', placeholder: 'Workday, BambooHR, LinkedIn Recruiter, Greenhouse, Zoho Recruit', required: true },
    { id: 'recruitmentVolume', label: 'Hiring Volume & Domains', type: 'text', placeholder: 'Hired 50+ tech & non-tech roles annually across US & APAC' }
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
  { id: 'coreTools', label: 'Tools & Technologies', type: 'text', placeholder: 'Tools, software, or equipment used daily' }
];
