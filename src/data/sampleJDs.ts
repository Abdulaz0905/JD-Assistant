import { SampleJD } from '../types';

export const SAMPLE_JDS: SampleJD[] = [
  {
    id: 'fintech-fullstack',
    title: 'Senior Full-Stack Engineer',
    company: 'ArcPay Financial',
    badge: 'FinTech / Payments',
    tagline: 'Hybrid SF • $175k-$210k • No Visa Sponsorship',
    jdText: `Role: Senior Full-Stack Engineer (Core Ledger & Checkout)
Company: ArcPay Financial Inc.
Location: San Francisco, CA (Hybrid: 2 days in office / 3 days remote)
Employment Type: Full-time

About ArcPay:
ArcPay is the modern payment infrastructure powering next-generation B2B marketplaces.
We process over $4B in annualized transaction volume across 12 countries.

What You Will Do:
- Architect, build, and maintain mission-critical double-entry ledger systems and checkout APIs.
- Design event-driven microservices capable of handling 50,000+ financial events per second with zero data loss.
- Collaborate with frontend engineers to build snappy, accessible merchant dashboards using React, TypeScript, and Tailwind CSS.
- Own services end-to-end, from technical design doc to CI/CD deployment, observability (Datadog/OpenTelemetry), and incident remediation.
- Participate in a shared on-call rotation (approx. 1 week every 6 weeks) supporting Tier-1 transaction routing services.

Requirements:
- 5+ years of software engineering experience building production web applications and distributed systems.
- Proficient in Go (Golang) or modern concurrent languages (e.g., Rust, Java) for backend services.
- Strong hands-on experience with modern React (hooks, state management, performance optimization) and TypeScript.
- Deep expertise in relational database modeling and ACID guarantees with PostgreSQL, including indexing and query optimization.
- Experience with asynchronous messaging pipelines using Apache Kafka or AWS SQS/SNS.
- Solid understanding of web security, PCI-DSS compliance concepts, and idempotent API design.

Compensation & Benefits:
- Base Salary Range: $175,000 - $210,000 USD depending on experience and interview evaluation.
- Equity: Meaningful early-stage stock option grant with standard 4-year vesting and 1-year cliff.
- 401(k) retirement plan with an immediate 4% company match.
- Comprehensive health, dental, and vision insurance covered at 100% for employees and 75% for dependents.
- $1,500 annual home-office setup stipend and $1,000 annual continuous learning budget.

Work Authorization & Visa Policy:
- Candidates must be currently authorized to work in the United States on a full-time, permanent basis.
- Note: We are strictly unable to sponsor or transfer employment visas (such as H-1B, TN, O-1, or OPT STEM extensions) for this role at this time.`,
    sampleResume: `ALEX RIVERA
Full-Stack Software Engineer • San Francisco, CA • alex.rivera@example.com

SUMMARY
Full-Stack Engineer with 6 years of experience building scalable web applications and payment APIs.
Specialized in TypeScript/React frontends and Node.js/Go microservices with PostgreSQL and Redis.

TECHNICAL SKILLS
- Languages: TypeScript, JavaScript, Go, Python, SQL
- Frontend: React 18, Next.js, Redux Toolkit, Tailwind CSS, Vite, Jest
- Backend & Data: Node.js, Express, Go, PostgreSQL, Redis, REST, GraphQL
- Cloud & DevOps: AWS (EC2, S3, RDS), Docker, GitHub Actions, Datadog

EXPERIENCE
Staff / Senior Frontend Engineer | Veloce Payments (2022 - Present)
- Led frontend architecture for consumer checkout flows processing $1.2M daily, reducing cart abandonment by 14%.
- Migrated legacy dashboard to React 18 and Tailwind CSS, improving Core Web Vitals LCP from 3.8s to 1.1s.
- Built internal reconciliation tooling in Go and PostgreSQL to detect discrepancies between Stripe webhooks and local database.

Software Engineer | Nova Commerce (2019 - 2022)
- Developed merchant inventory microservices in Node.js and PostgreSQL.
- Implemented asynchronous order notifications using AWS SQS and Redis caching.
- Maintained 99.95% uptime and participated in weekly on-call rotations.

EDUCATION
B.S. in Computer Science, University of California, Davis (2019)`,
  },
  {
    id: 'healthtech-pm',
    title: 'Lead AI Product Manager',
    company: 'Vitalis Health',
    badge: 'HealthTech / AI Agents',
    tagline: '100% Remote US • Clinical AI • No Salary Stated',
    jdText: `Role: Lead AI Product Manager (Clinical Intelligence & Workflow Automation)
Company: Vitalis Health
Location: 100% Remote (Must reside within the United States)
Department: AI & Clinical Innovation

About the Role:
Vitalis Health is pioneering ambient clinical documentation and AI assistant copilots for physicians in acute hospital networks.
We are looking for a Lead AI Product Manager to spearhead our generative clinical agent platform.
You will bridge medical clinicians, deep learning research scientists, and hospital IT leadership.

Key Responsibilities:
- Define product strategy, roadmaps, and PRDs for LLM-powered ambient clinical transcription and automated EHR charting.
- Partner with clinicians and AI research engineers to evaluate LLM hallucination rates, clinical safety guardrails, and latency benchmarks.
- Lead integrations with major Electronic Health Record (EHR) systems including Epic (FHIR APIs) and Cerner.
- Establish trust-and-safety metrics, bias audits, and physician satisfaction scoring (NPS).
- Ensure strict compliance with HIPAA, HITECH, FDA SaMD regulations, and SOC2 Type II requirements.

Qualifications:
- 5+ years of technical product management experience, with at least 2+ years leading AI/ML or LLM-native applications.
- Demonstrated experience working in healthcare, digital health, or life sciences environments.
- Deep familiarity with EHR data standards: HL7, FHIR, and SMART-on-FHIR protocols.
- Proven track record taking 0-to-1 complex technical products to market with enterprise hospital or enterprise B2B customers.
- Exceptional executive communication skills capable of presenting to Chief Medical Officers and hospital boards.

Perks & Culture:
- 100% distributed remote-first company culture with bi-annual company-wide retreats.
- Unlimited Paid Time Off (PTO) with a mandatory minimum of 3 weeks taken annually.
- Comprehensive medical, dental, vision coverage, plus One Medical and mental health counseling stipends.
- Parental leave: 16 weeks fully paid for all new parents (birth, adoption, foster).`,
    sampleResume: `PRIYA PATEL
Product Leader — AI & Health Tech • Boston, MA • priya.patel@example.com

SUMMARY
Product Manager with 5 years experience scaling healthcare software and B2B SaaS. Proven track record launching ML-based diagnostic workflows and clinician tooling.

EXPERIENCE
Senior Product Manager | MedScreen AI (2021 - Present)
- Owned radiology triage AI assistant from discovery to FDA clearance and hospital network rollout across 18 clinics.
- Designed clinician feedback loops that reduced false positive notifications by 27%.
- Partnered with clinical advisory board to establish clinical safety metrics and HIPAA audits.

Product Manager | CareConnect Digital Health (2019 - 2021)
- Managed patient engagement portal with SMART-on-FHIR integrations for Epic and Cerner EHRs.
- Increased clinician daily active adoption by 40% through contextual alert design.

SKILLS
- Product Strategy, PRDs, Clinician Interviews, User Journey Mapping
- Healthcare Standards: HL7, FHIR, HIPAA, SOC 2
- AI/ML Concept Evaluation, Precision/Recall Tradeoffs, LLM Evaluation Frameworks`,
  },
  {
    id: 'cloud-sre',
    title: 'Staff Site Reliability Engineer (SRE)',
    company: 'CloudMesh Global',
    badge: 'Cloud Infrastructure / SRE',
    tagline: 'Global Remote • $210k-$245k • Multi-Region Kubernetes',
    jdText: `Job Title: Staff Site Reliability Engineer (Platform & Observability)
Company: CloudMesh Global
Work Arrangement: Worldwide Remote (Any timezone within UTC-8 to UTC+2)
Department: Core Infrastructure Engineering

Role Overview:
CloudMesh provides multi-cloud edge mesh networking for hyper-growth enterprises.
We operate across 45 edge regions handling 350+ Gbps of continuous traffic.
As a Staff SRE, you will set the technical vision for our global Kubernetes control planes and reliability architecture.

Core Responsibilities:
- Champion the architecture and automation of multi-region Kubernetes clusters running on AWS and bare-metal edge nodes.
- Implement GitOps workflows using ArgoCD, Helm, and Terraform infrastructure-as-code.
- Design resilient self-healing mechanisms and eBPF-based telemetry collectors for network packet inspection.
- Define SLIs, SLOs, and Error Budgets for customer-facing APIs, enforcing release freezes when budgets deplete.
- Lead high-severity incident commander duties during outages and facilitate blameless post-mortems with actionable prevention items.
- Mentor senior engineers across teams on chaos engineering practices and fault-injection testing.

Candidate Requirements:
- 8+ years in SRE, DevOps, or Infrastructure Engineering supporting high-availability, large-scale distributed systems (99.99%+ SLA).
- Expert mastery of Kubernetes internals (kube-apiserver, etcd tuning, CNI plugins, operator development in Go).
- Fluency in Infrastructure as Code using Terraform, Terragrunt, or Pulumi.
- Deep programming experience in Go, Python, or Rust for building internal reliability automation tooling.
- Advanced troubleshooting skills across Linux kernel subsystems, systemd, TCP/IP, DNS, and TLS termination.

Target Compensation:
- Base Compensation: $210,000 - $245,000 USD (or local currency equivalent for international contractors).
- Comprehensive global health insurance or local health stipend.
- $3,000 yearly equipment and conference travel budget.`,
    sampleResume: `MARCUS CHEN
Staff DevOps & Cloud Systems Engineer • Austin, TX • marcus.chen@example.com

SUMMARY
Infrastructure specialist with 9 years of experience designing cloud platforms on AWS and GCP. Deep expertise in Terraform, Docker containerization, and Prometheus/Grafana monitoring.

EXPERIENCE
Senior Cloud Architect | DataScale Inc (2020 - Present)
- Managed AWS infrastructure via Terraform for 80+ microservices across 3 US regions.
- Architected CI/CD pipelines in GitLab CI, reducing release lead time from 4 hours to 18 minutes.
- Implemented Datadog and Prometheus monitoring dashboards and configured PagerDuty alerting.

DevOps Engineer | Strata Security (2016 - 2020)
- Containerized monolithic applications into Docker and managed ECS clusters.
- Configured HashiCorp Vault for secrets management and automated SSL certificate rotation.
- Led blameless postmortems and reduced MTTR by 35%.

SKILLS
- Cloud: AWS, GCP, Terraform, Terragrunt, Docker, Linux, Bash, Python
- Observability: Prometheus, Grafana, Datadog, ELK Stack`,
  },
];
