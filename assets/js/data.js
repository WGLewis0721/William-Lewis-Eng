/* Structured content model for the site.
   Every string below is drawn from one of the five resume editions in /assets/resume. */

const PROFILE = {
  name: 'William G. Lewis',
  short: 'W. G. Lewis',
  location: 'Montgomery, AL',
  email: 'william.glewis17@gmail.com',
  phone: '334-652-2601',
  linkedin: { url: 'https://linkedin.com/in/williamlewis06', label: 'linkedin.com/in/williamlewis06' },
  github: { url: 'https://github.com/aws-dev-wgl', label: 'github.com/aws-dev-wgl' },
  clearance: 'Active Top Secret (TS) · SCI Eligible · IT-1 · AWS GovCloud IL2–IL6'
};

const SECTORS = {
  gov: { id: 'gov', label: 'Cleared / Government', short: 'Cleared' },
  private: { id: 'private', label: 'Private Sector', short: 'Private' }
};

/* ---------------------------------------------------------------------------
   Role lenses. Each lens carries one or two editions (government / private),
   mirroring the resume variants. Switching the lens re-tints and re-renders
   the summary, competencies, impact cards, skill emphasis and resume download.
--------------------------------------------------------------------------- */
const LENSES = [
  {
    id: 'platform',
    label: 'Cloud Platform',
    accent: '#F2A93B',
    blurb: 'Multi-account AWS platforms, IaC, and production ownership.',
    editions: {
      private: {
        title: 'Principal Cloud & Platform Engineer',
        tagline: 'AWS · Platform Engineering · DevSecOps',
        summary: 'Senior cloud and platform engineer with 7+ years building AWS infrastructure, automation, observability, and secure delivery platforms. Brings practical ownership from multi-account cloud migration through production platform operations and AI-enabled infrastructure.',
        competencies: ['AWS', 'Terraform', 'CloudFormation', 'Ansible', 'Kubernetes/EKS', 'Docker', 'GitLab CI/CD', 'Jenkins', 'OpenSearch', 'CloudWatch', 'RDS', 'Python', 'Bash', 'Platform Automation'],
        impact: [
          { title: 'Multi-Account Platform Automation', body: 'Automated multi-account AWS delivery with Terraform, CloudFormation, Ansible, Git, and Jenkins across 24 environments.' },
          { title: 'Commercial Cloud Modernization', body: 'Migrated customer infrastructure to AWS through modular Terraform and created resilient backup and container delivery patterns.' }
        ],
        file: 'William-G-Lewis_Principal-Cloud-Platform-Engineer.docx'
      },
      gov: {
        title: 'Principal Cloud & Platform Engineer',
        tagline: 'AWS GovCloud · DevSecOps',
        summary: 'Senior cloud and platform engineer with 7+ years delivering secure AWS GovCloud platforms across IL2–IL6. Combines hands-on Terraform, Kubernetes, CI/CD, observability, Zero Trust, and RMF expertise with technical ownership of complex mission platforms.',
        competencies: ['AWS GovCloud (IL2–IL6)', 'Terraform', 'Ansible', 'CloudFormation', 'EKS', 'Docker', 'GitLab CI/CD', 'Jenkins', 'OpenSearch', 'CloudWatch', 'AppGate SDP', 'Palo Alto', 'NIST RMF', 'ATO'],
        impact: [
          { title: 'Classified Platform Engineering', body: 'Standardized Terraform deployment scripts, CIDR enforcement, and environment injection for a classified cloud stack; improved deployment consistency and reduced manual provisioning.' },
          { title: 'IL4/IL5 Customer Onboarding', body: 'Defined a repeatable architecture and onboarding framework that enabled new mission-customer expansion on the platform.' }
        ],
        file: 'William-G-Lewis_Principal-Cloud-Platform-Engineer_Cleared.docx'
      }
    }
  },
  {
    id: 'devsecops',
    label: 'DevSecOps',
    accent: '#3FBFA2',
    blurb: 'Secure delivery standards, pipeline hardening, and change control.',
    editions: {
      private: {
        title: 'Cloud & DevSecOps Architect',
        tagline: 'Secure Delivery · Automation',
        summary: 'Cloud and DevSecOps architect who turns security, compliance, infrastructure automation, and developer delivery into scalable platform patterns. Strong in AWS, Terraform, CI/CD, Kubernetes, monitoring, and pragmatic cloud modernization.',
        competencies: ['AWS', 'Terraform', 'CloudFormation', 'Ansible', 'GitLab CI/CD', 'Jenkins', 'Docker', 'Kubernetes', 'IAM', 'KMS', 'CloudTrail', 'GuardDuty', 'Security Automation', 'DevSecOps'],
        impact: [
          { title: 'Secure Delivery Standards', body: 'Created reusable IaC patterns and deployment documentation covering version control, branching, environment redeployment, and production change control.' },
          { title: 'Cloud Security Modernization', body: 'Led TLS modernization and vulnerability remediation across environments while protecting availability and delivery schedules.' }
        ],
        file: 'William-G-Lewis_Cloud-DevSecOps-Architect.docx'
      }
    }
  },
  {
    id: 'ai',
    label: 'AI Infrastructure',
    accent: '#A98CE8',
    blurb: 'Model serving, RAG retrieval, and GPU platform foundations.',
    editions: {
      private: {
        title: 'AI Infrastructure & LLMOps Engineer',
        tagline: 'AWS · RAG Platforms',
        summary: 'AI infrastructure and LLMOps engineer who builds production-ready model-serving, RAG, and cloud-platform foundations. Combines AWS, GPU infrastructure, OpenSearch, FastAPI, automation, and observability with proven platform-engineering experience.',
        competencies: ['LLMOps', 'RAG', 'AWS Bedrock', 'GPU EC2', 'Ollama', 'OpenSearch', 'FastAPI', 'Docker', 'Terraform', 'Kubernetes', 'CI/CD', 'CloudWatch', 'Python', 'Boto3'],
        impact: [
          { title: 'Serverless AI Summarizer', body: 'Built an AWS Bedrock, Lambda, DynamoDB, and API Gateway transcript-analysis service that generated structured summaries and reduced latency by 50%.' },
          { title: 'Private LLM Operations', body: 'Designed an operational model-serving stack with GPU compute, retrieval, telemetry, and secure deployment automation.' }
        ],
        file: 'William-G-Lewis_AI-Infrastructure-LLMOps-Engineer.docx'
      }
    }
  },
  {
    id: 'zerotrust',
    label: 'Zero Trust Security',
    accent: '#E4715C',
    blurb: 'SDP, NGFW lifecycle, and RMF/ATO execution in GovCloud.',
    editions: {
      gov: {
        title: 'Cloud Security & Zero Trust Architect',
        tagline: 'AWS GovCloud',
        summary: 'Cloud security and Zero Trust architect with deep experience securing AWS GovCloud environments through AppGate SDP, Palo Alto NGFW, IAM, STIG/CIS controls, vulnerability management, and RMF/ATO execution. Pairs architecture ownership with hands-on automation and operations.',
        competencies: ['Zero Trust Architecture', 'AppGate SDP', 'Palo Alto NGFW', 'PAN-OS', 'AWS GovCloud', 'IAM', 'STIG', 'CIS Benchmarks', 'ACAS', 'SCAP', 'NIST 800-53', 'RMF', 'ATO', 'eMASS'],
        impact: [
          { title: 'AppGate Zero Trust Deployment', body: 'Led AppGate Controller, Portal, and Gateway implementation across TEST and PROD, including entitlement governance, hardening, and validated baseline controls.' },
          { title: 'NGFW Lifecycle Ownership', body: 'Governed Palo Alto licensing, PAN-OS upgrades, patching, and policy hardening across environments with zero unplanned downtime.' }
        ],
        file: 'William-G-Lewis_Cloud-Security-Zero-Trust-Architect_Cleared.docx'
      }
    }
  }
];

/* ---------------------------------------------------------------------------
   Career history. Where the resume editions phrase a role differently for
   government and private-sector audiences, both phrasings are kept.
--------------------------------------------------------------------------- */
const EXPERIENCE = [
  {
    id: 'oteemo',
    org: 'SAIC / Oteemo',
    start: '2023-11', end: null,
    period: 'Nov 2023 — Present',
    current: true,
    role: { private: 'Lead Cloud & Platform Engineer', gov: 'Lead Cloud & Platform Engineer, IL6 Technical Lead' },
    context: { private: 'Secure cloud platform delivery', gov: 'CNAP Program · Gunter AFB' },
    bullets: {
      private: [
        'Lead secure cloud-platform delivery across infrastructure automation, Kubernetes-ready application delivery, observability, network security, and compliance engineering.',
        'Designed reusable Terraform deployment patterns and CI/CD workflows that reduced manual provisioning effort and deployment errors by an estimated 60–70%.',
        'Built an OpenSearch and Fluent Bit observability pipeline and operational dashboards that improved visibility into application and security telemetry.',
        'Delivered a private GPU-backed LLM and RAG environment for natural-language investigation of operational data.'
      ],
      gov: [
        'Own the technical delivery of an IL6 cloud platform spanning Zero Trust networking, Palo Alto NGFW operations, Terraform automation, CI/CD, SIEM observability, and RMF/ATO execution.',
        'Architected a diode-constrained GitLab CI/CD workflow and versioned S3 staging pattern for secure Infrastructure as Code promotion into an air-gapped environment.',
        "Built the program's first operational AI security capability: GPU-backed local LLM inference with OpenSearch RAG for natural-language security investigation.",
        'Led AppGate SDP hardening, CIS and SCAP control validation, IATT execution, and ATO documentation across TEST and PROD.'
      ]
    },
    stack: ['Terraform', 'GitLab CI/CD', 'Kubernetes', 'OpenSearch', 'Fluent Bit', 'AppGate SDP', 'Palo Alto NGFW', 'GPU EC2']
  },
  {
    id: 'bakertilly',
    org: 'Baker Tilly',
    start: '2021-12', end: '2023-06',
    period: 'Dec 2021 — Jun 2023',
    role: { private: 'Senior AWS Cloud Consultant', gov: 'Senior AWS Cloud Consultant' },
    context: { private: 'Commercial cloud migration', gov: 'Commercial cloud migration' },
    bullets: {
      private: [
        'Led a multi-region Rackspace-to-AWS migration using modular Terraform, standardizing secure provisioning across customer environments.',
        'Built cross-account RDS backup automation, Docker image pipelines, and CloudWatch Canaries with Teams alerting to improve resilience and incident detection.'
      ],
      gov: [
        'Led a multi-region Rackspace-to-AWS migration using modular Terraform, cross-account RDS backup automation, Docker image pipelines, and CloudWatch monitoring.'
      ]
    },
    stack: ['Terraform', 'AWS', 'RDS', 'Docker', 'CloudWatch Canaries']
  },
  {
    id: 'saic',
    org: 'SAIC',
    start: '2020-08', end: '2023-12',
    period: 'Aug 2020 — Dec 2023',
    role: { private: 'Senior Cloud Engineer', gov: 'Senior Cloud Engineer' },
    context: { private: 'Multi-account AWS operations', gov: 'Multi-account AWS operations' },
    bullets: {
      private: [
        'Deployed CloudFormation and Ansible changes across 24 AWS accounts and DEV/TEST/PROD environments using Git and Jenkins.',
        'Automated application availability checks and Active Directory reporting with PowerShell, Ansible, and Jenkins; supported a 99.99999% availability SLA.',
        'Improved platform security through patching, vulnerability remediation, TLS modernization, and CloudWatch service monitoring.'
      ],
      gov: [
        'Delivered CloudFormation and Ansible changes across 24 AWS accounts and DEV/TEST/PROD environments using Git and Jenkins.',
        'Automated availability validation and Active Directory reporting with PowerShell, Ansible, and Jenkins; supported a 99.99999% availability SLA.',
        'Performed Tier 2/3 triage, ACAS scanning, emergency and scheduled patching, TLS 1.0-to-1.2 remediation, and Solaris 10 maintenance.'
      ]
    },
    stack: ['CloudFormation', 'Ansible', 'Jenkins', 'PowerShell', 'Active Directory']
  },
  {
    id: 'directviz',
    org: 'Direct Viz Solutions',
    start: '2019-10', end: '2020-02',
    period: 'Oct 2019 — Feb 2020',
    role: { private: 'RHEL Cloud System Administrator', gov: 'RHEL Cloud System Administrator' },
    context: { private: 'Linux platform operations', gov: 'Linux platform operations' },
    bullets: [
      'Managed cloud infrastructure services, middleware and OS updates, and performance monitoring for reliable platform operations.'
    ],
    stack: ['RHEL', 'Middleware', 'Performance monitoring']
  },
  {
    id: 'leidos',
    org: 'Leidos',
    start: '2018-06', end: '2019-10',
    period: 'Jun 2018 — Oct 2019',
    role: { private: 'Cloud System Integrator', gov: 'Cloud System Integrator' },
    context: { private: '24/7 high-availability operations', gov: '24/7 high-availability operations' },
    bullets: [
      'Supported application migration, CMDB development, SSL certificate monitoring, and 24/7 operations for highly available systems.'
    ],
    stack: ['Application migration', 'CMDB', 'SSL lifecycle']
  }
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

/* ---------------------------------------------------------------------------
   Capability matrix. `lenses` marks which role lens emphasizes each skill.
--------------------------------------------------------------------------- */
const SKILL_DOMAINS = [
  {
    id: 'cloud', name: 'Cloud Platform', note: 'Commercial and GovCloud',
    skills: [
      { n: 'AWS', l: ['platform', 'devsecops', 'ai', 'zerotrust'] },
      { n: 'AWS GovCloud (IL2–IL6)', l: ['platform', 'zerotrust'] },
      { n: 'EC2 / GPU EC2', l: ['platform', 'ai'] },
      { n: 'Lambda', l: ['ai'] },
      { n: 'API Gateway', l: ['ai'] },
      { n: 'DynamoDB', l: ['ai'] },
      { n: 'RDS', l: ['platform'] },
      { n: 'S3 (versioned staging)', l: ['platform', 'devsecops'] },
      { n: 'IAM', l: ['devsecops', 'zerotrust'] },
      { n: 'KMS', l: ['devsecops'] }
    ]
  },
  {
    id: 'iac', name: 'Infrastructure as Code', note: 'Repeatable, reviewable delivery',
    skills: [
      { n: 'Terraform', l: ['platform', 'devsecops', 'ai', 'zerotrust'] },
      { n: 'CloudFormation', l: ['platform', 'devsecops'] },
      { n: 'Ansible', l: ['platform', 'devsecops'] },
      { n: 'Python / Boto3', l: ['platform', 'ai'] },
      { n: 'Bash', l: ['platform'] },
      { n: 'PowerShell', l: ['platform'] }
    ]
  },
  {
    id: 'delivery', name: 'Delivery & Orchestration', note: 'Pipelines and runtime',
    skills: [
      { n: 'GitLab CI/CD', l: ['platform', 'devsecops', 'zerotrust'] },
      { n: 'Jenkins', l: ['platform', 'devsecops'] },
      { n: 'Git', l: ['platform', 'devsecops'] },
      { n: 'Docker', l: ['platform', 'devsecops', 'ai'] },
      { n: 'Kubernetes / EKS', l: ['platform', 'devsecops', 'ai'] },
      { n: 'Change control & branching standards', l: ['devsecops'] }
    ]
  },
  {
    id: 'observability', name: 'Observability', note: 'Application and security telemetry',
    skills: [
      { n: 'OpenSearch', l: ['platform', 'ai', 'zerotrust'] },
      { n: 'Fluent Bit', l: ['platform', 'zerotrust'] },
      { n: 'CloudWatch', l: ['platform', 'devsecops', 'ai'] },
      { n: 'CloudWatch Canaries', l: ['platform'] },
      { n: 'SIEM dashboards', l: ['zerotrust'] },
      { n: 'Teams alerting', l: ['platform'] }
    ]
  },
  {
    id: 'security', name: 'Security & Zero Trust', note: 'Edge, identity, and hardening',
    skills: [
      { n: 'Zero Trust architecture', l: ['zerotrust'] },
      { n: 'AppGate SDP', l: ['zerotrust', 'platform'] },
      { n: 'Palo Alto NGFW / PAN-OS', l: ['zerotrust', 'platform'] },
      { n: 'CloudTrail', l: ['devsecops'] },
      { n: 'GuardDuty', l: ['devsecops'] },
      { n: 'TLS modernization', l: ['devsecops'] },
      { n: 'Vulnerability remediation', l: ['devsecops', 'zerotrust'] },
      { n: 'Security automation', l: ['devsecops'] }
    ]
  },
  {
    id: 'compliance', name: 'Compliance & Authorization', note: 'Evidence that stands up to an assessor',
    skills: [
      { n: 'NIST 800-53', l: ['zerotrust'] },
      { n: 'RMF', l: ['zerotrust', 'platform'] },
      { n: 'ATO / IATT', l: ['zerotrust', 'platform'] },
      { n: 'eMASS', l: ['zerotrust'] },
      { n: 'STIG', l: ['zerotrust'] },
      { n: 'CIS Benchmarks', l: ['zerotrust'] },
      { n: 'ACAS', l: ['zerotrust'] },
      { n: 'SCAP', l: ['zerotrust'] },
      { n: 'DoD 8140 / 8570 IAT II', l: ['zerotrust'] }
    ]
  },
  {
    id: 'ai', name: 'AI Infrastructure & LLMOps', note: 'Serving, retrieval, and evaluation plumbing',
    skills: [
      { n: 'AWS Bedrock', l: ['ai'] },
      { n: 'Retrieval-augmented generation (RAG)', l: ['ai', 'zerotrust'] },
      { n: 'Ollama', l: ['ai'] },
      { n: 'Local / private model serving', l: ['ai', 'zerotrust'] },
      { n: 'FastAPI', l: ['ai'] },
      { n: 'GPU compute provisioning', l: ['ai'] },
      { n: 'Inference telemetry', l: ['ai'] }
    ]
  },
  {
    id: 'systems', name: 'Systems & Operations', note: 'The layer underneath the platform',
    skills: [
      { n: 'RHEL', l: ['platform'] },
      { n: 'Solaris 10', l: [] },
      { n: 'Active Directory', l: ['platform'] },
      { n: 'Middleware & OS patching', l: ['platform', 'devsecops'] },
      { n: 'CMDB', l: [] },
      { n: 'SSL certificate lifecycle', l: ['devsecops'] },
      { n: 'Tier 2/3 incident triage', l: ['zerotrust'] }
    ]
  }
];

const CREDENTIALS = [
  { name: 'AWS Certified Solutions Architect – Associate', meta: 'Amazon Web Services · 2022', kind: 'cert' },
  { name: 'AWS Certified SysOps Administrator – Associate', meta: 'Amazon Web Services · 2023', kind: 'cert' },
  { name: 'CompTIA Security+ CE', meta: 'Active', kind: 'cert' },
  { name: 'Active Top Secret (TS) Clearance', meta: 'SCI Eligible · IT-1', kind: 'clearance' },
  { name: 'DoD 8140 / 8570 IAT Level II', meta: 'Compliant', kind: 'clearance' },
  { name: 'B.S. Computer Science', meta: 'Alabama State University · Cum Laude · December 2018', kind: 'education' }
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

const SITE = { PROFILE, SECTORS, LENSES, EXPERIENCE, METRICS, SKILL_DOMAINS, CREDENTIALS, ARCH_NODES };
