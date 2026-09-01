/* Structured content model for the site.

   Everything here is transcribed from the resume PDFs in /assets/resume.
   Regenerate the wording from a new set with `python3 tools/read_resumes.py`
   and edit the matching entry below — the page reads nothing from the PDFs at
   runtime, so a download and the text beside it only agree if both are updated.

   Shape: competencies, selected impact and bullet ordering belong to a LENS
   (they are identical in that lens's government and private editions); the
   tagline and professional summary belong to an EDITION. */

const PROFILE = {
  name: 'William G. Lewis',
  short: 'W. G. Lewis',
  location: 'Montgomery, AL',
  email: 'william.glewis17@gmail.com',
  phone: '334-652-2601',
  linkedin: { url: 'https://linkedin.com/in/williamlewis06', label: 'linkedin.com/in/williamlewis06' },
  github: { url: 'https://github.com/aws-dev-wgl', label: 'github.com/aws-dev-wgl' },
  clearance: 'Active Top Secret (TS) Clearance · SCI Eligible · IT-1 · Security+ (DoD 8140/8570 IAT Level II) · AWS GovCloud IL2-IL6'
};

const SECTORS = {
  gov: { id: 'gov', label: 'Cleared / Government', short: 'Cleared' },
  private: { id: 'private', label: 'Private Sector', short: 'Private' }
};

/* ---------------------------------------------------------------------------
   Role lenses. Five tracks, each with a government and a private-sector
   edition. The lens drives the hero, summary, competencies, impact, capability
   list, bullet ordering, page accent, and which resume is offered.
--------------------------------------------------------------------------- */
const LENSES = [
  {
    id: 'platform',
    label: 'Cloud Platform',
    title: 'Principal Cloud & Platform Engineer',
    accent: '#F2A93B',
    accentInk: '#8A5605',
    blurb: 'Multi-account AWS platforms, infrastructure as code, and technical ownership.',
    competencies: [
      { group: 'Platform Architecture', items: ['AWS', 'AWS GovCloud', 'EC2', 'VPC', 'Transit Gateway', 'IAM', 'Lambda', 'S3', 'ECS', 'RDS', 'multi-account and multi-region delivery'] },
      { group: 'Infrastructure as Code', items: ['Terraform', 'CloudFormation', 'Ansible', 'reusable modules', 'environment redeployment', 'CIDR enforcement'] },
      { group: 'Platform Delivery', items: ['GitLab CI/CD', 'Jenkins', 'Docker', 'Amazon ECR', 'Kubernetes/EKS', 'GitOps', 'cross-domain code promotion'] },
      { group: 'Observability', items: ['OpenSearch', 'Fluent Bit', 'CloudWatch', 'OpenSearch Dashboards', 'Dynatrace', 'SIEM pipelines'] },
      { group: 'Security', items: ['Zero Trust Architecture', 'AppGate SDP', 'Palo Alto NGFW', 'IAM', 'WAF', 'GuardDuty', 'KMS', 'CloudTrail', 'NIST RMF'] },
      { group: 'Engineering', items: ['Python', 'Bash', 'PowerShell', 'Boto3', 'RESTful APIs', 'YAML', 'JSON', 'Agile Scrum leadership'] },
    ],
    impact: [
      { title: 'Classified Platform Ownership',
        body: 'Directed engineering across Zero Trust networking, NGFW operations, CI/CD automation, SIEM observability, and ATO compliance from initial IATT through production hardening and customer onboarding.' },
      { title: 'Reusable Platform Standards',
        body: 'Standardized Terraform deployment scripts with CIDR enforcement and environment-variable injection, reducing estimated deployment errors by 60-70% and eliminating manual provisioning overhead.' },
      { title: 'Mission-Customer Expansion',
        body: 'Assessed onboarding process gaps, created the IL4/IL5 onboarding epic, and delivered a repeatable architecture enabling new mission-customer expansion on the CNAP platform.' },
    ],
    /* Each edition leads with the bullet its resume leads with. */
    bulletOrder: {
      oteemo: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      bakertilly: [0, 1, 2],
      saic: [0, 1, 2, 3, 4, 5, 6],
      directviz: [0, 1],
      leidos: [0, 1, 2],
    },
    editions: {
      private: {
        tagline: 'AWS · Platform Engineering · Infrastructure Automation',
        summary: 'Principal-level Cloud and Platform Engineer with 7+ years of experience across AWS architecture, Infrastructure as Code, CI/CD, containers, observability, security, migration, and production operations. Provides technical ownership while building reusable Terraform patterns, multi-account delivery automation, cross-account backup workflows, and monitoring systems. Brings architecture-level judgment without losing the hands-on depth required to make platform standards work in production.',
        file: 'William-G-Lewis_Principal-Cloud-Platform-Engineer.pdf'
      },
      gov: {
        tagline: 'AWS GovCloud · Technical Leadership · DevSecOps',
        summary: 'Principal-level Cloud and Platform Engineer with 7+ years of progressively responsible experience delivering secure AWS GovCloud environments across IL2-IL6. Serves as the primary technical owner of a classified platform spanning Terraform, cross-domain CI/CD, Zero Trust networking, Palo Alto NGFW operations, SIEM observability, AI infrastructure, customer onboarding, and RMF/ATO execution. Establishes reusable platform standards while remaining hands-on in implementation, troubleshooting, and operational handoff.',
        file: 'William-G-Lewis_Principal-Cloud-Platform-Engineer_Cleared.pdf'
      },
    }
  },
  {
    id: 'devsecops',
    label: 'DevSecOps',
    title: 'Cloud & DevSecOps Architect',
    accent: '#5AA9E6',
    accentInk: '#1F5C8C',
    blurb: 'Secure delivery pipelines, compliance automation, and change control.',
    competencies: [
      { group: 'Cloud & IaC', items: ['AWS', 'AWS GovCloud', 'EC2', 'VPC', 'Transit Gateway', 'IAM', 'Lambda', 'S3', 'ECS', 'RDS', 'Terraform', 'CloudFormation', 'Ansible'] },
      { group: 'CI/CD & DevOps', items: ['GitLab CI/CD', 'Jenkins', 'Docker', 'Amazon ECR', 'Kubernetes/EKS', 'GitOps', 'cross-domain code promotion'] },
      { group: 'Security Engineering', items: ['AppGate SDP', 'Palo Alto NGFW', 'PAN-OS', 'IAM', 'WAF', 'GuardDuty', 'KMS', 'CloudTrail', 'ACAS', 'STIG', 'CIS Benchmarks'] },
      { group: 'Compliance', items: ['NIST 800-53', 'DoD RMF', 'ATO', 'IATT', 'ConMon', 'POA&M', 'eMASS', 'IRP', 'VMP', 'CMP', 'SAR'] },
      { group: 'Observability', items: ['OpenSearch', 'Fluent Bit', 'Lambda SIEM pipelines', 'CloudWatch', 'OpenSearch Dashboards', 'Dynatrace'] },
      { group: 'Automation', items: ['Python', 'Bash', 'PowerShell', 'Boto3', 'RESTful APIs', 'YAML', 'JSON'] },
    ],
    impact: [
      { title: 'Diode-Constrained CI/CD',
        body: 'Architected a high-side GitLab CI/CD and versioned S3 cross-domain staging workflow for secure Infrastructure as Code promotion into an air-gapped environment where no off-the-shelf delivery solution existed.' },
      { title: 'Repeatable Terraform Delivery',
        body: 'Standardized per-component Terraform deployment scripts with CIDR enforcement and environment-variable injection, reducing estimated deployment errors by 60-70% and eliminating manual provisioning overhead.' },
      { title: 'RMF & Authorization Execution',
        body: 'Directed five IATT Test Plan sprint cycles, authored the ATO documentation suite, coordinated with ISSM and SCA-R stakeholders, and closed POA&Ms across ACAS, STIG, and AWS Foundations controls.' },
    ],
    /* Each edition leads with the bullet its resume leads with. */
    bulletOrder: {
      oteemo: [2, 1, 7, 0, 5, 9, 4, 6, 3, 8],
      bakertilly: [0, 1, 2],
      saic: [0, 1, 2, 3, 4, 5, 6],
      directviz: [0, 1],
      leidos: [0, 1, 2],
    },
    editions: {
      private: {
        tagline: 'AWS · Infrastructure as Code · Secure Delivery',
        summary: 'Cloud and DevSecOps Architect with 7+ years of experience connecting AWS architecture, Infrastructure as Code, CI/CD, containers, security, observability, and production operations. Built reusable Terraform deployment patterns that reduced estimated deployment errors by 60-70%, led multi-region cloud migration work, and delivered automation across 24 AWS accounts. Brings hands-on engineering depth to platform standards, secure delivery, modernization, and operational readiness.',
        file: 'William-G-Lewis_Cloud-DevSecOps-Architect.pdf'
      },
      gov: {
        tagline: 'AWS GovCloud · Secure CI/CD · RMF',
        summary: 'Cloud and DevSecOps Architect with 7+ years of experience engineering secure AWS platforms and delivery systems, including classified AWS GovCloud environments across IL2-IL6. Owns the intersection of Terraform, cross-domain GitLab CI/CD, container delivery, Zero Trust networking, observability, security-control implementation, and RMF/ATO execution. Designs repeatable platform patterns that continue to work under diode restrictions, air gaps, and high-assurance operational constraints.',
        file: 'William-G-Lewis_Cloud-DevSecOps-Architect_Cleared.pdf'
      },
    }
  },
  {
    id: 'sre',
    label: 'SRE & Reliability',
    title: 'Cloud SRE & Platform Reliability Engineer',
    accent: '#3FBFA2',
    accentInk: '#0B6A55',
    blurb: 'Availability, observability, incident response, and toil reduction.',
    competencies: [
      { group: 'Reliability Engineering', items: ['Availability validation', 'incident triage', 'patching', 'operational readiness', 'service-level agreement support', 'toil reduction'] },
      { group: 'Observability', items: ['CloudWatch', 'CloudWatch Canaries', 'OpenSearch', 'Fluent Bit', 'OpenSearch Dashboards', 'Dynatrace', 'Amazon SNS', 'Microsoft Teams alerting'] },
      { group: 'Cloud & Platform', items: ['AWS', 'AWS GovCloud', 'EC2', 'Elastic Beanstalk', 'VPC', 'IAM', 'Lambda', 'S3', 'RDS', 'Terraform', 'CloudFormation'] },
      { group: 'Automation', items: ['PowerShell', 'Ansible', 'Jenkins', 'GitLab CI/CD', 'Python', 'Bash', 'Boto3'] },
      { group: 'Systems', items: ['Red Hat Enterprise Linux', 'Solaris 10', 'Docker', 'Kubernetes/EKS', 'Active Directory'] },
      { group: 'Security Operations', items: ['ACAS', 'STIG', 'TLS remediation', 'Palo Alto NGFW', 'SIEM', 'NIST RMF'] },
    ],
    impact: [
      { title: 'Availability Automation',
        body: 'Automated application availability validation using PowerShell, Ansible, and Jenkins and developed SSL-certificate monitoring, supporting systems governed by a 99.99999% uptime service-level agreement.' },
      { title: 'Operational Observability',
        body: 'Designed the program\'s first end-to-end Fluent Bit-to-OpenSearch SIEM pipeline with IAM authentication, index architecture, and dashboards; also built CloudWatch uptime monitoring for Elastic Beanstalk and EC2.' },
      { title: 'Proactive Detection',
        body: 'Designed CloudWatch Canaries and Amazon SNS-to-Microsoft Teams alerting, reducing mean time to detection for infrastructure incidents.' },
    ],
    /* Each edition leads with the bullet its resume leads with. */
    bulletOrder: {
      oteemo: [4, 0, 1, 6, 2, 7, 5, 9, 3, 8],
      bakertilly: [0, 1, 2],
      saic: [0, 1, 2, 3, 4, 5, 6],
      directviz: [0, 1],
      leidos: [0, 1, 2],
    },
    editions: {
      private: {
        tagline: 'AWS · Observability · Reliability Automation',
        summary: 'Cloud Site Reliability and Platform Engineer with 7+ years of experience improving AWS availability, observability, automation, incident response, and production readiness. Built CloudWatch Canaries, dashboards, Active Directory reporting, repeatable availability checks, and OpenSearch telemetry while supporting systems governed by a 99.99999% uptime service-level agreement. Reduces operational toil by replacing repetitive validation and provisioning work with dependable automation.',
        file: 'William-G-Lewis_Cloud-SRE-Platform-Reliability.pdf'
      },
      gov: {
        tagline: 'AWS GovCloud · Observability · Mission Reliability',
        summary: 'Cloud Site Reliability and Platform Engineer with 7+ years of experience supporting high-availability mission systems and secure AWS GovCloud platforms. Automates availability validation, builds SIEM and operational telemetry, performs Tier 2/3 incident triage, and strengthens reliability through Infrastructure as Code, CI/CD, patching, vulnerability remediation, and operational documentation. Supported systems governed by a 99.99999% uptime service-level agreement and now owns reliability across a classified IL6 platform.',
        file: 'William-G-Lewis_Cloud-SRE-Platform-Reliability_Cleared.pdf'
      },
    }
  },
  {
    id: 'ai',
    label: 'AI Infrastructure',
    title: 'AI Infrastructure & LLMOps Engineer',
    accent: '#A98CE8',
    accentInk: '#59389E',
    blurb: 'Private model serving, RAG retrieval, and GPU platform foundations.',
    competencies: [
      { group: 'AI Infrastructure', items: ['Local LLM inference', 'Ollama', 'GPU EC2', 'NVIDIA T4', 'Open WebUI', 'FastAPI', 'AWS Bedrock'] },
      { group: 'RAG & Search', items: ['Retrieval-Augmented Generation', 'OpenSearch retrieval', 'query-generation pipelines', 'OpenSearch Dashboards'] },
      { group: 'Cloud & IaC', items: ['AWS GovCloud', 'EC2', 'VPC', 'IAM', 'Lambda', 'API Gateway', 'DynamoDB', 'S3', 'ECS', 'RDS', 'Terraform', 'CloudFormation', 'Ansible'] },
      { group: 'Platform Delivery', items: ['GitLab CI/CD', 'Jenkins', 'Docker', 'Amazon ECR', 'Kubernetes/EKS', 'GitOps', 'cross-domain code promotion'] },
      { group: 'Observability', items: ['OpenSearch', 'Fluent Bit', 'CloudWatch', 'Lambda SIEM pipelines', 'Dynatrace'] },
      { group: 'Languages & APIs', items: ['Python', 'Bash', 'PowerShell', 'Boto3', 'RESTful APIs', 'YAML', 'JSON'] },
    ],
    impact: [
      { title: 'CNAP Log Analyst Agent',
        body: 'Pioneered and deployed a production GPU-backed local LLM inference platform in an air-gapped DoD environment with zero commercial cloud dependency; integrated OpenSearch RAG for natural- language investigation of Palo Alto and AppGate security data, resolved a production credential-rotation defect, and delivered operational documentation for classified handoff.' },
      { title: 'CNAP AI SIEM Chatbot',
        body: 'Designed the architecture and proof of concept for a classified AI security-intelligence chatbot; defined the LLM integration layer, OpenSearch query-generation pipeline, and GovCloud deployment model, then presented the design to C1 Cohort leadership and secured go/no-go approval for AI VPC expansion.' },
      { title: 'AI Cloud Sentiment Analysis & Summarizer',
        body: 'Built a serverless transcript-analysis platform with AWS Bedrock, Lambda, DynamoDB, and API Gateway, generating structured AI summaries through a REST API and reducing latency by 50% through architecture optimization.' },
    ],
    /* Each edition leads with the bullet its resume leads with. */
    bulletOrder: {
      oteemo: [8, 4, 7, 2, 1, 0, 5, 9, 6, 3],
      bakertilly: [0, 1, 2],
      saic: [0, 1, 2, 3, 4, 5, 6],
      directviz: [0, 1],
      leidos: [0, 1, 2],
    },
    editions: {
      private: {
        tagline: 'AWS · Model Serving · Retrieval-Augmented Generation',
        summary: 'AI Infrastructure and LLMOps Engineer with 7+ years of cloud and platform engineering experience building operational model-serving, retrieval-augmented generation, and AWS platform foundations. Delivered GPU-backed private LLM infrastructure, OpenSearch retrieval, and a serverless AWS Bedrock transcript-analysis service that reduced latency by 50%. Connects AI workloads to the production systems they depend on: compute, APIs, automation, CI/CD, observability, networking, security, and operational handoff.',
        file: 'William-G-Lewis_AI-Infrastructure-LLMOps-Engineer.pdf'
      },
      gov: {
        tagline: 'Classified AI Platforms · AWS GovCloud · RAG',
        summary: 'AI Infrastructure and LLMOps Engineer with 7+ years of cloud and platform engineering experience and hands-on ownership of private large language model inference, retrieval-augmented generation, GPU-backed compute, and security telemetry in air-gapped AWS GovCloud environments. Pioneered a program\'s first operational AI security capability and designed an executive proof of concept for classified AI-enabled investigation. Combines model- serving infrastructure with Terraform, GitLab CI/CD, OpenSearch, Docker, observability, security controls, and operational documentation.',
        file: 'William-G-Lewis_AI-Infrastructure-LLMOps-Engineer_Cleared.pdf'
      },
    }
  },
  {
    id: 'zerotrust',
    label: 'Zero Trust Security',
    title: 'Cloud Security & Zero Trust Architect',
    accent: '#E4715C',
    accentInk: '#A33420',
    blurb: 'Software-defined perimeter, NGFW lifecycle, and RMF/ATO execution.',
    competencies: [
      { group: 'Zero Trust & Network Security', items: ['Zero Trust Architecture', 'microsegmentation', 'AppGate SDP', 'Palo Alto NGFW', 'PAN-OS', 'firewall policy governance'] },
      { group: 'AWS Security', items: ['IAM', 'WAF', 'GuardDuty', 'KMS', 'CloudTrail', 'VPC', 'Transit Gateway', 'AWS GovCloud'] },
      { group: 'Security Controls', items: ['STIG', 'ACAS', 'CIS Benchmarks', 'SCAP', 'vulnerability remediation', 'TLS modernization'] },
      { group: 'Compliance', items: ['NIST 800-53', 'DoD RMF', 'ATO', 'IATT', 'ConMon', 'POA&M', 'eMASS', 'IRP', 'VMP', 'CMP', 'SAR'] },
      { group: 'Security Observability', items: ['OpenSearch', 'Fluent Bit', 'Lambda SIEM pipelines', 'CloudWatch', 'OpenSearch Dashboards'] },
      { group: 'Automation & Delivery', items: ['Terraform', 'CloudFormation', 'Ansible', 'GitLab CI/CD', 'Jenkins', 'Docker', 'Python', 'PowerShell', 'Bash'] },
    ],
    impact: [
      { title: 'AppGate Zero Trust Deployment',
        body: 'Led AppGate Controller, Portal, and Gateway deployment and hardening across TEST and PROD, configuring entitlement governance, CIS Benchmark controls, and SCAP-validated posture for mission-customer onboarding.' },
      { title: 'Palo Alto NGFW Governance',
        body: 'Governed licensing, PAN-OS upgrades from 10.2.8 to 11.0.3, patching, and policy hardening across TEST and PROD while maintaining security compliance with zero unplanned downtime.' },
      { title: 'Security Control Evidence',
        body: 'Directed IATT execution and authored the ATO documentation suite while closing POA&Ms across ACAS, STIG, and AWS Foundations controls to deliver a compliant RMF package.' },
    ],
    /* Each edition leads with the bullet its resume leads with. */
    bulletOrder: {
      oteemo: [5, 6, 9, 4, 0, 7, 2, 1, 3, 8],
      bakertilly: [0, 1, 2],
      saic: [0, 1, 2, 3, 4, 5, 6],
      directviz: [0, 1],
      leidos: [0, 1, 2],
    },
    editions: {
      private: {
        tagline: 'AWS Security · Identity · Network Protection',
        summary: 'Cloud Security and Zero Trust Architect with 7+ years of experience across identity, network protection, encryption, audit logging, vulnerability remediation, Infrastructure as Code, and observability in AWS platforms. Led Zero Trust and next-generation firewall hardening, maintained security compliance through platform upgrades with zero unplanned downtime, and delivered TLS modernization across production environments. Combines security architecture with hands-on cloud and platform engineering.',
        file: 'William-G-Lewis_Cloud-Security-Zero-Trust-Architect.pdf'
      },
      gov: {
        tagline: 'AWS GovCloud · AppGate SDP · Palo Alto NGFW',
        summary: 'Cloud Security and Zero Trust Architect with 7+ years of cloud engineering experience and hands-on ownership of classified AWS GovCloud security across IL2-IL6. Leads AppGate Software-Defined Perimeter deployment, Palo Alto NGFW lifecycle and policy hardening, IAM-integrated SIEM telemetry, vulnerability remediation, STIG/CIS control validation, and RMF/ATO execution. Converts architecture and NIST 800-53 requirements into implemented, testable, and operational security controls.',
        file: 'William-G-Lewis_Cloud-Security-Zero-Trust-Architect_Cleared.pdf'
      },
    }
  },
];

/* ---------------------------------------------------------------------------
   Career history. Role, organisation, dates, stack and bullet text are the same
   in all ten editions — only the order of the bullets changes, which each
   lens's `bulletOrder` above supplies.
--------------------------------------------------------------------------- */
const EXPERIENCE = [
  {
    id: 'oteemo',
    org: 'SAIC / Oteemo',
    program: 'CNAP Program, Gunter AFB',
    role: 'Lead Cloud & Platform Engineer, IL6 Technical Lead (Platform & Security Architecture)',
    period: 'Nov 2023 — Present',
    current: true,
    context: 'Platform & security architecture',
    stack: ['AWS GovCloud (IL4/IL5/IL6)', 'AppGate SDP', 'Palo Alto NGFW (PAN-OS)', 'Terraform', 'GitLab CI/CD', 'OpenSearch', 'Fluent Bit', 'Ollama', 'NIST RMF'],
    bullets: [
      'Served as primary technical owner of the CNAP IL6 platform, directing engineering across Zero Trust networking, NGFW operations, CI/CD automation, SIEM observability, and ATO compliance from initial IATT through production hardening and customer onboarding.',
      'Standardized Terraform Infrastructure as Code across the classified stack through per-component deployment scripts with CIDR enforcement and environment-variable injection, reducing estimated deployment errors by 60-70% and eliminating manual provisioning overhead.',
      'Architected a high-side CI/CD pipeline for diode-constrained Infrastructure as Code delivery, engineering a versioned S3 cross-domain staging workflow that solved a classified automation problem with no off-the-shelf solution.',
      'Established the IL4/IL5 customer onboarding framework: assessed process gaps, created the onboarding epic, and delivered a repeatable architecture enabling mission-customer expansion on the CNAP platform.',
      'Designed and owned the program\'s classified SIEM pipeline from zero (Fluent Bit to OpenSearch) with IAM-based authentication, index architecture, and operational dashboards, delivering the team\'s first end-to-end log visibility.',
      'Led AppGate Software-Defined Perimeter deployment and Zero Trust hardening across TEST and PROD, configuring entitlement governance, CIS Benchmark controls, and SCAP-validated posture; established the operational Zero Trust baseline for SAOC customer onboarding.',
      'Governed the Palo Alto NGFW lifecycle, including licensing, PAN-OS version upgrades (10.2.8 to 11.0.3), patching, and policy hardening across TEST and PROD simultaneously, maintaining security compliance with zero unplanned downtime.',
      'Containerized and delivered hardened application stacks with Docker and Amazon ECR into the air-gapped IL6 environment in compliance with STIG and CIS Benchmark controls.',
      'Pioneered the program\'s first AI-enabled security operations capability: deployed a local LLM inference platform in a classified, air-gapped environment, enabling natural-language investigation against live security log data, a capability with no prior program equivalent.',
      'Directed IATT Test Plan execution across five sprint cycles, coordinating with ISSM and SCA-R, authoring the full ATO documentation suite (IRP, ConMon, VMP, CMP, SAR), and closing POA&Ms across ACAS, STIG, and AWS Foundations to deliver a compliant RMF package.',
    ]
  },
  {
    id: 'bakertilly',
    org: 'Baker Tilly',
    role: 'Senior AWS Cloud Consultant',
    period: 'Dec 2021 — Jun 2023',
    context: 'Commercial cloud migration',
    stack: ['AWS Commercial', 'Terraform', 'CloudWatch', 'Docker', 'RDS', 'Multi-Region Migration'],
    bullets: [
      'Led a multi-region cloud migration from Rackspace to AWS using modular Terraform stacks, standardizing provisioning patterns and reducing manual configuration overhead across customer environments.',
      'Built cross-account RDS backup automation and Docker image pipelines for ARM and x86, improving data resilience and standardizing secure CI/CD delivery.',
      'Designed proactive monitoring through CloudWatch Canaries and Amazon SNS-to-Microsoft Teams integration, reducing mean time to detection for infrastructure incidents.',
    ]
  },
  {
    id: 'saic',
    org: 'SAIC',
    role: 'Senior Cloud Engineer',
    period: 'Aug 2020 — Dec 2023',
    context: 'Multi-account AWS operations',
    stack: ['AWS', 'CloudFormation', 'Ansible', 'Jenkins', 'Git', 'PowerShell', 'CloudWatch', 'Elastic Beanstalk', 'EC2', 'ACAS', 'F5', 'Solaris 10'],
    bullets: [
      'Drove Tier 2 and Tier 3 support triage by monitoring and troubleshooting problems, implementing scheduled and emergency patches, running ACAS scans, and executing engineering plans for application- and platform-level updates.',
      'Deployed Infrastructure as Code changes across 24 AWS accounts and DEV/TEST/PROD environments using CloudFormation and Ansible, with Git for version control and Jenkins for continuous integration and delivery.',
      'Developed an automated Active Directory user report for key government stakeholders using Jenkins, PowerShell, and Ansible.',
      'Automated application availability validation using PowerShell, Ansible, and Jenkins, supporting a 99.99999% system uptime service-level agreement.',
      'Created a CloudWatch uptime-monitoring dashboard for Elastic Beanstalk and EC2 performance, improving resource visibility and response times.',
      'Led the TLS 1.0-to-1.2 transition across DEV/TEST/PROD environments, remediating F5 firewall findings and maintaining DoD cybersecurity compliance.',
      'Administered patching and quality analysis for Solaris 10 systems through a complex multi-step procedure, maintaining compliance and availability for mission-critical ESB legacy systems.',
    ]
  },
  {
    id: 'directviz',
    org: 'Direct Viz Solutions',
    role: 'RHEL Cloud System Administrator',
    period: 'Oct 2019 — Feb 2020',
    context: 'Linux platform operations',
    stack: ['Red Hat Enterprise Linux', 'Cloud Infrastructure', 'Middleware', 'OS Patching', 'Performance Monitoring'],
    bullets: [
      'Managed cloud infrastructure services, applying middleware and operating-system updates while identifying and resolving performance inefficiencies.',
      'Developed, configured, and supported cloud platforms and infrastructure for optimal performance and reliability.',
    ]
  },
  {
    id: 'leidos',
    org: 'Leidos',
    role: 'Cloud System Integrator',
    period: 'Jun 2018 — Oct 2019',
    context: '24/7 high-availability operations',
    stack: ['Cloud Migration', 'Configuration Management Database', 'SSL/TLS Monitoring', 'Application Support', '24/7 Operations'],
    bullets: [
      'Collaborated with technical leads to support application migrations and provided 24/7 operational support to maintain customer service and system availability.',
      'Built a Configuration Management Database to track resources, reduce downtime, and improve patching efficiency.',
      'Developed a system to monitor expiring SSL certificates, maintaining continuous compliance and supporting a 99.99999% availability service-level agreement.',
    ]
  },
];
/* ---------------------------------------------------------------------------
   Metrics. `text` values are shown verbatim; numeric values count up on scroll.
--------------------------------------------------------------------------- */
const METRICS = [
  { value: 7, suffix: '+', label: 'Years in cloud & platform engineering', note: 'Since 2018' },
  { value: 24, label: 'AWS accounts under automated delivery', note: 'DEV / TEST / PROD' },
  { value: 65, prefix: '~', suffix: '%', display: '60–70%', label: 'Less manual provisioning effort and deployment error', note: 'Reusable Terraform + CI/CD patterns' },
  { value: 50, suffix: '%', label: 'Latency reduction on a serverless AI summarizer', note: 'Bedrock · Lambda · DynamoDB' },
  { text: '99.99999%', label: 'Availability SLA supported', note: 'Automated validation & reporting' },
  { text: 'IL2–IL6', label: 'AWS GovCloud impact levels delivered', note: 'Up to air-gapped IL6', sector: 'gov' }
];

/* The classified-environment spec sheet from the master resume. */
const CLASSIFIED_PROFILE = [
  { k: 'Clearance', v: 'Active Top Secret (TS), SCI Eligible, IT-1' },
  { k: 'Classification levels', v: 'AWS GovCloud IL2, IL4, IL5, IL6 (DoD classified)' },
  { k: 'Delivery model', v: 'Diode-restricted cross-domain pipelines, air-gapped Infrastructure as Code, no direct internet path' },
  { k: 'Compliance', v: 'NIST 800-53, DoD RMF, ATO, IATT, ConMon, ACAS, STIG, CIS Benchmarks, eMASS' },
  { k: 'Zero Trust', v: 'AppGate SDP — Controller, Portal, Gateway: deployment, hardening, entitlement governance' },
  { k: 'Network security', v: 'Palo Alto NGFW (PAN-OS): lifecycle management, version governance, firewall policy ownership' },
  { k: 'Observability', v: 'Fluent Bit, OpenSearch, Lambda, CloudWatch — end-to-end SIEM pipeline ownership' },
  { k: 'AI systems', v: 'Local LLM inference on GPU EC2, OpenSearch RAG, zero commercial cloud dependency' }
];

/* ---------------------------------------------------------------------------
   Signature AI infrastructure projects, from the master resume.
--------------------------------------------------------------------------- */
const PROJECTS = [
  {
    name: 'CNAP Log Analyst Agent',
    context: 'Production AI SIEM · AWS GovCloud IL6',
    status: 'In production',
    lead: 'The program\u2019s first operational AI security capability: a production LLM inference platform deployed in an air-gapped DoD environment with zero commercial cloud dependency.',
    body: 'A GPU-backed inference stack on NVIDIA T4 serves natural-language log investigation against Palo Alto and AppGate data through an OpenSearch RAG pipeline — a classified security operations interface with no prior equivalent in the program. Shipped alongside a fix for a production credential-rotation defect that was blocking deployment, plus full operational documentation for classified handoff.',
    stack: ['NVIDIA T4 GPU EC2', 'Ollama', 'OpenSearch RAG', 'Open WebUI', 'Palo Alto + AppGate telemetry']
  },
  {
    name: 'CNAP AI SIEM Chatbot',
    context: 'Architecture & executive proof of concept',
    status: 'Approved for AI VPC expansion',
    lead: 'Architecture and proof of concept for an AI-powered security intelligence chatbot scoped for classified program use.',
    body: 'Defined the LLM integration layer, the OpenSearch query-generation pipeline, and the GovCloud deployment model, then presented to C1 Cohort leadership — securing stakeholder alignment and go/no-go approval for AI VPC expansion.',
    stack: ['LLM integration layer', 'OpenSearch query generation', 'AWS GovCloud']
  },
  {
    name: 'AI Cloud Sentiment Analysis & Summarizer',
    context: 'Serverless LLM pipeline',
    status: '50% latency reduction',
    lead: 'A serverless transcript-analysis platform generating structured AI summaries over a REST API.',
    body: 'Built on AWS Bedrock, Lambda, DynamoDB, and API Gateway, with a 50% latency reduction achieved through architecture optimization.',
    stack: ['AWS Bedrock', 'Lambda', 'DynamoDB', 'API Gateway', 'Python']
  }
];

/* Architecture walkthrough: the IL6 platform, node by node. */
const ARCH_NODES = {
  repo: {
    name: 'IaC repository',
    side: 'Low side',
    body: 'Terraform modules, CIDR enforcement rules, and environment injection live in version control with branching and change-control standards, so every platform change is reviewable before it goes anywhere.'
  },
  pipeline: {
    name: 'GitLab CI/CD',
    side: 'Low side',
    body: 'Validation and plan stages run on the low side. The pipeline never reaches into the enclave directly — its only output is a versioned artifact staged for transfer.'
  },
  staging: {
    name: 'Versioned S3 staging',
    side: 'Low side',
    body: 'Each promotion is written as an immutable, versioned object. Versioning is what makes the one-way hop auditable: the artifact that crossed can always be identified after the fact.'
  },
  diode: {
    name: 'Data diode',
    side: 'Boundary',
    body: 'The single crossing point, and it is physically one-way. Nothing inside the enclave can call back out, so the CI/CD design has to push complete, self-sufficient artifacts rather than pull dependencies at apply time.'
  },
  apply: {
    name: 'Terraform apply',
    side: 'IL6 enclave',
    body: 'Inside the enclave, the staged artifact is applied against AWS GovCloud. Reusable deployment patterns cut manual provisioning effort and deployment error by an estimated 60–70%.'
  },
  edge: {
    name: 'AppGate SDP + Palo Alto NGFW',
    side: 'IL6 enclave',
    body: 'Zero Trust access is brokered per-identity by AppGate Controller, Portal, and Gateway with governed entitlements; Palo Alto NGFW carries the traffic policy. Licensing, PAN-OS upgrades, and policy hardening ran with zero unplanned downtime.'
  },
  workloads: {
    name: 'Platform workloads',
    side: 'IL6 enclave',
    body: 'Kubernetes-ready application delivery on hardened baselines, onboarded through a repeatable IL4/IL5 architecture framework that let new mission customers join the platform.'
  },
  telemetry: {
    name: 'Fluent Bit → OpenSearch',
    side: 'IL6 enclave',
    body: 'Fluent Bit ships application and security telemetry into OpenSearch, backing operational dashboards and SIEM views that made platform behavior visible to operators.'
  },
  llm: {
    name: 'GPU LLM + RAG',
    side: 'IL6 enclave',
    body: 'The program’s first operational AI security capability: a GPU-backed local model retrieving against the OpenSearch index. Analysts ask questions in natural language, and neither the prompts nor the telemetry leave the enclave.'
  },
  compliance: {
    name: 'ACAS / SCAP → RMF',
    side: 'IL6 enclave',
    body: 'Scanning and CIS/SCAP control validation feed the evidence trail behind IATT execution and ATO documentation across TEST and PROD.'
  }
};
/* ---------------------------------------------------------------------------
   Certifications, clearance and education, as listed on every edition.
--------------------------------------------------------------------------- */
const CREDENTIALS = [
  { name: 'AWS Certified Solutions Architect – Associate', meta: 'Amazon Web Services · 2022', kind: 'cert' },
  { name: 'AWS Certified SysOps Administrator – Associate', meta: 'Amazon Web Services · 2023', kind: 'cert' },
  { name: 'CompTIA Security+ CE', meta: 'Active', kind: 'cert' },
  { name: 'AWS Certified AI Practitioner', meta: 'In progress', kind: 'cert' },
  { name: 'Active Top Secret (TS) Security Clearance', meta: 'SCI Eligible · IT-1', kind: 'clearance' },
  { name: 'DoD 8140 / 8570 IAT Level II', meta: 'Compliant', kind: 'clearance' },
  { name: 'B.S. Computer Science', meta: 'Alabama State University · Cum Laude · December 2018', kind: 'education' }
];

const PUBLICATIONS = [
  'Authored documentation defining Infrastructure as Code deployment best practices for GitHub, environment-redeployment procedures, and branching strategies for Infrastructure as Code environments.',
  'Published articles on cloud infrastructure management and optimization techniques.'
];

const AFFILIATIONS = [
  'Alpha Phi Alpha Fraternity, Inc. (2016–present)',
  'National Society of Black Engineers (2018–present)',
  'Scouting America (2023–present)'
];

/* The full-detail Word resume the tailored PDFs are cut from. */
const MASTER = {
  badge: 'Master edition · full detail',
  title: 'Lead Cloud & Platform Engineer',
  tagline: 'Cloud Security & Zero Trust · AI Infrastructure · DevSecOps',
  summary: 'Senior cloud and platform engineer with 7+ years of ownership in classified AWS GovCloud environments (IL2–IL6) and an active Top Secret clearance. Directed the full engineering lifecycle of a DoD CNAP program: Zero Trust architecture deployment, diode-constrained CI/CD, SIEM observability, and ATO compliance execution under NIST 800-53 and DoD RMF.',
  note: 'Every project and every bullet in one document, in Word format. The five tracks above are cut from this.',
  file: 'William-G-Lewis_Complete-Resume.docx'
};

const SITE = { PROFILE, SECTORS, LENSES, MASTER, CLASSIFIED_PROFILE, PROJECTS,
               PUBLICATIONS, AFFILIATIONS, EXPERIENCE, METRICS, CREDENTIALS, ARCH_NODES };
