import { useState, useMemo } from 'react';
import { WebsiteContent, Project } from '../types/content';
import { assetUrl } from '../lib/asset-url';
import { ProjectDialog } from '../components/ProjectDialog';
import styles from './Projects.module.css';

interface ProjectsProps {
  content: WebsiteContent;
}

function formatCategory(cat: string): string {
  if (cat.toLowerCase() === 'rekhatan') return 'रेखाटने';
  return cat.charAt(0).toUpperCase() + cat.slice(1);
}

export default function Projects({ content }: ProjectsProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projects = content.projects || [];

  const categories = useMemo(() => {
    const cats = new Set<string>();
    projects.forEach(p => {
      if (p.category) cats.add(p.category.toLowerCase());
    });
    return ['all', ...Array.from(cats)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') return projects;
    return projects.filter(p => (p.category || '').toLowerCase() === activeCategory);
  }, [projects, activeCategory]);

  return (
    <div className={`animate-fade-in ${styles.page}`}>
      <section className={styles.headerSection}>
        <div className="container">
          <h1 className="text-display-2">Selected Work</h1>
          <p className="lead" style={{ maxWidth: '40rem', color: 'var(--color-stone)' }}>
            A collection of our architecture, interior design, and renovation projects.
          </p>
        </div>
      </section>

      <section className={styles.filterSection}>
        <div className="container">
          <div className={styles.filterScroll}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`${styles.filterBtn} ${activeCategory === cat ? styles.active : ''}`}
              >
                {cat === 'all' ? 'All Projects' : formatCategory(cat)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.gridSection}>
        <div className="container">
          {filteredProjects.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No projects found for this category.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {filteredProjects.map((project, idx) => (
                <button
                  key={project.id || idx}
                  className={styles.projectCard}
                  onClick={() => setSelectedProject(project)}
                  aria-label={`View details for ${project.title}`}
                >
                  <div className={styles.imageWrapper}>
                    {project.thumbnail ? (
                       <img 
                         src={assetUrl(project.thumbnail)} 
                         alt={project.title}
                         loading="lazy"
                         className={styles.image}
                       />
                    ) : (
                       <div className={styles.noImage}>No Image</div>
                    )}
                    <div className={styles.overlay}>
                      <span className={styles.category}>{formatCategory(project.category)}</span>
                      <h3 className={styles.title}>{project.title}</h3>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <ProjectDialog 
        project={selectedProject} 
        isOpen={selectedProject !== null} 
        onClose={() => setSelectedProject(null)} 
        formatCategory={formatCategory}
      />
    </div>
  );
}
