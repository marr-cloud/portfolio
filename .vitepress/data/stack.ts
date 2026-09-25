export interface StackGroup {
  title: string
  title_en: string
  icon: string
  items: string[]
  /** Optional English overrides for items that aren't language-neutral. */
  items_en?: string[]
}

export const stack: StackGroup[] = [
  { title: 'Cloud (AWS)', title_en: 'Cloud (AWS)', icon: 'cloud',
    items: ['VPC', 'ALB', 'CloudFront', 'Route 53', 'WAF', 'Aurora', 'ECS Fargate', 'Lambda'] },
  { title: 'Contenedores', title_en: 'Containers', icon: 'containers',
    items: ['Docker', 'Docker Compose', 'Kubernetes', 'ECS Fargate'] },
  { title: 'CI/CD', title_en: 'CI/CD', icon: 'ci-cd',
    items: ['GitHub Actions', 'Pipelines multi-entorno'],
    items_en: ['GitHub Actions', 'Multi-environment pipelines'] },
  { title: 'IaC & Scripting', title_en: 'IaC & Scripting', icon: 'iac',
    items: ['Bash', 'PowerShell', 'Automatización de infraestructura'],
    items_en: ['Bash', 'PowerShell', 'Infrastructure automation'] },
  { title: 'Observabilidad', title_en: 'Monitoring', icon: 'monitoring',
    items: ['Prometheus', 'Grafana', 'CloudWatch', 'Amazon Managed Prometheus'] },
  { title: 'Bases de datos', title_en: 'Databases', icon: 'database',
    items: ['PostgreSQL', 'RDS', 'Aurora', 'LibSQL/Turso', 'Redis/MemoryDB', 'RabbitMQ'] },
  { title: 'Web', title_en: 'Web', icon: 'web',
    items: ['Hono', 'Astro', 'Vue/Nuxt', 'Tailwind CSS', 'Cloudflare Workers'] },
  { title: 'Lenguajes', title_en: 'Languages', icon: 'languages',
    items: ['TypeScript', 'Go', 'Rust', 'Shell'] },
  { title: 'Identidad', title_en: 'Identity', icon: 'identity',
    items: ['Keycloak'] }
]
