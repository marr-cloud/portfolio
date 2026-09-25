export interface StackGroup {
  title: string
  title_en: string
  items: string[]
}

export const stack: StackGroup[] = [
  { title: 'Cloud (AWS)', title_en: 'Cloud (AWS)',
    items: ['VPC', 'ALB', 'CloudFront', 'Route 53', 'WAF', 'Aurora', 'ECS Fargate', 'Lambda'] },
  { title: 'Contenedores', title_en: 'Containers',
    items: ['Docker', 'Docker Compose', 'Kubernetes', 'ECS Fargate'] },
  { title: 'CI/CD', title_en: 'CI/CD',
    items: ['GitHub Actions', 'Pipelines multi-entorno'] },
  { title: 'IaC & Scripting', title_en: 'IaC & Scripting',
    items: ['Bash', 'PowerShell', 'Automatización de infraestructura'] },
  { title: 'Observabilidad', title_en: 'Monitoring',
    items: ['Prometheus', 'Grafana', 'CloudWatch', 'Amazon Managed Prometheus'] },
  { title: 'Bases de datos', title_en: 'Databases',
    items: ['PostgreSQL', 'RDS', 'Aurora', 'LibSQL/Turso', 'Redis/MemoryDB', 'RabbitMQ'] },
  { title: 'Web', title_en: 'Web',
    items: ['Hono', 'Astro', 'Vue/Nuxt', 'Tailwind CSS', 'Cloudflare Workers'] },
  { title: 'Lenguajes', title_en: 'Languages',
    items: ['TypeScript', 'Go', 'Rust', 'Shell'] },
  { title: 'Identidad', title_en: 'Identity',
    items: ['Keycloak'] }
]
