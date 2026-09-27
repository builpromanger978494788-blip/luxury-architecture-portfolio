import { useEffect, useMemo, useState, type CSSProperties, type FormEvent, type MouseEvent } from 'react';
import { useWebsiteContent } from './hooks/useWebsiteContent';
import { assetUrl } from './lib/asset-url';
import { mountLegacyTheme } from './styles/legacy-theme';
import type { Project, WebsiteContent } from './types/content';
import { ProjectModal } from './components/ProjectModal';

type PageId = 'home' | 'projects' | 'about' | 'services' | 'contact';

const pages: Array<{ id: PageId; label: string }> = [
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
];

const classes = (...items: Array<string | boolean>) => items.filter(Boolean).join(' ');
const delay = (index: number) => index ? 'reveal-delay-' + Math.min(index, 4) : '';

function pageFromPathname(pathname: string): PageId {
  const path = pathname.replace(/^\//, '');
  return pages.find((page) => page.id !== 'home' && page.id === path)?.id ?? 'home';
}

function categoryLabel(category: string) {
  if (category.toLowerCase() === 'rekhatan') return 'रेखाटने';
  return category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Project';
}

function imageStyle(path?: string): CSSProperties | undefined {
  const url = assetUrl(path);
  return url ? { backgroundImage: 'url("' + url + '")' } : undefined;
}

function Footer({ content, navigate }: { content: WebsiteContent; navigate: (page: PageId) => void }) {
  const { footer } = content;
  return (
    <footer>
      <div className="footer-top">
        <div><div className="footer-logo">{footer.logo}</div><p className="footer-tagline">{footer.tagline}</p></div>
        <div className="footer-col">
          <h4>Studio</h4>
          <ul>{pages.filter((item) => item.id !== 'home').map((item) => <li key={item.id} role="button" tabIndex={0} onClick={() => navigate(item.id)} onKeyDown={(event) => event.key === 'Enter' && navigate(item.id)}>{item.label}</li>)}</ul>
        </div>
        <div className="footer-col"><h4>Contact</h4><ul><li>{footer.email}</li><li>{footer.phone}</li><li>{footer.locations}</li></ul></div>
        <div className="footer-col"><h4>Follow</h4><ul>{footer.social.map((social) => <li key={social}>{social}</li>)}</ul></div>
      </div>
      <div className="footer-bottom"><span className="footer-copy">{footer.copyright}</span><span className="footer-copy">{footer.crafted}</span></div>
    </footer>
  );
}


function App() {
  const { content, loading, source, error } = useWebsiteContent();
  const [page, setPage] = useState<PageId>(() => pageFromPathname(window.location.pathname));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project>();
  const [sent, setSent] = useState(false);

  useEffect(() => mountLegacyTheme(), []);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, []);
  useEffect(() => {
    const onPopState = () => setPage(pageFromPathname(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);
  useEffect(() => {
    const nav = document.getElementById('mainNav');
    const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('visible')), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.page.active .reveal:not(.visible)').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [content, page]);

  function navigate(nextPage: PageId) {
    setPage(nextPage);
    setMobileMenuOpen(false);
    setActiveCategory('all');
    window.history.pushState({}, '', nextPage === 'home' ? '/' : '/' + nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function navClick(event: MouseEvent<HTMLAnchorElement>, nextPage: PageId) { event.preventDefault(); navigate(nextPage); }
  function submitContact(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSent(true); window.setTimeout(() => setSent(false), 6000); }

  const categories = useMemo(() => content ? Array.from(new Set(content.projects.map((project) => project.category))).filter(Boolean) : [], [content]);
  const filteredProjects = content?.projects.filter((project) => activeCategory === 'all' || project.category === activeCategory) ?? [];
  if (loading || !content) return <main className="boot-screen">Loading studio content…</main>;
  const { home, about, services, contact, site } = content;

  return (
    <>
      <nav id="mainNav">
        <a className="nav-logo" href="/" onClick={(event) => navClick(event, 'home')}>{site.logo}</a>
        <ul className="nav-links">{pages.map((item) => <li key={item.id}><a href={item.id === 'home' ? '/' : '/' + item.id} onClick={(event) => navClick(event, item.id)} className={page === item.id ? 'active' : ''}>{item.label}</a></li>)}</ul>
        <button className="nav-cta" onClick={() => navigate('contact')}>{site.nav_cta}</button>
        <button className="hamburger" aria-label="Open menu" onClick={() => setMobileMenuOpen(true)}><span></span><span></span><span></span></button>
      </nav>
      <div className={classes('mobile-nav', mobileMenuOpen && 'open')}>
        <button className="mobile-nav-close" aria-label="Close menu" onClick={() => setMobileMenuOpen(false)}>✕</button>
        {pages.map((item) => <a key={item.id} href={item.id === 'home' ? '/' : '/' + item.id} onClick={(event) => navClick(event, item.id)}>{item.label}</a>)}
      </div>

      <div className={classes('page', page === 'home' && 'active')} id="page-home">
        <section className="hero">
          <div className="hero-bg-orb hero-bg-orb-1"></div><div className="hero-bg-orb hero-bg-orb-2"></div><div className="hero-bg-orb hero-bg-orb-3"></div><div className="hero-grid-lines"></div>
          <div className="hero-content">
            <div className="hero-badge">{home.hero.badge}</div>
            <h1 className="hero-title">{home.hero.title_line1}<br />That <span className="highlight-text">{home.hero.title_highlight}</span></h1>
            <p className="hero-sub">{home.hero.services.map((service, index) => <span key={service}>{service}{index < home.hero.services.length - 1 && <span> · </span>}</span>)}</p>
            <div className="hero-btns"><button className="btn-primary" onClick={() => navigate('projects')}><span>{home.hero.btn_primary}</span></button><button className="btn-secondary" onClick={() => navigate('contact')}>{home.hero.btn_secondary}</button></div>
          </div>
          <div className="hero-scroll"><span>Scroll</span><div className="scroll-line"></div></div>
        </section>
        <div className="stats-strip">{home.stats.map((stat, index) => <div className={classes('stat-item', 'reveal', delay(index))} key={stat.number + stat.label}><div className="stat-num">{stat.number}</div><div className="stat-label">{stat.label}</div></div>)}</div>
        <section className="featured">
          <div className="featured-header"><div><p className="section-label reveal">{home.featured.label}</p><h2 className="section-title reveal reveal-delay-1">{home.featured.title_line1}<br /><em>{home.featured.title_em}</em></h2></div><a className="link-arrow reveal reveal-delay-2" onClick={() => navigate('projects')}>All Projects</a></div>
          <div className="featured-grid">{home.featured.cards.map((card, index) => <div className={classes('feat-card', index === 0 && 'span-col', 'reveal', delay(index))} key={card.title + index} onClick={() => navigate('projects')} role="button" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && navigate('projects')}><div className="feat-card-inner" style={imageStyle(card.image)}></div><div className="feat-card-overlay"></div><div className="feat-card-arrow">→</div><div className="feat-card-info"><div className="feat-card-cat">{card.category}</div><div className="feat-card-title">{card.title}</div></div></div>)}</div>
        </section>
        <section className="philosophy">
          <div><p className="section-label reveal">{home.philosophy.label}</p><h2 className="section-title reveal reveal-delay-1">{home.philosophy.title_line1}<br /><em>{home.philosophy.title_em}</em></h2><p className="philosophy-text reveal reveal-delay-2">{home.philosophy.text}</p><div style={{ marginTop: 40 }} className="reveal reveal-delay-3"><a className="link-arrow" onClick={() => navigate('about')} style={{ color: 'var(--stone)' }}>Our Story</a></div></div>
          <div className="philosophy-visual reveal reveal-delay-2"><div className="phil-shape phil-shape-1"></div><div className="phil-shape phil-shape-2"></div><div className="phil-shape phil-shape-3"></div><div className="phil-line phil-line-1"></div><div className="phil-line phil-line-2"></div><div className="phil-label phil-label-1">Form</div><div className="phil-label phil-label-2">Function</div></div>
        </section>
        <section className="process"><p className="section-label reveal">{home.process.label}</p><h2 className="section-title reveal reveal-delay-1">{home.process.title_line1} <em>{home.process.title_em}</em></h2><div className="process-steps">{home.process.steps.map((step, index) => <div className={classes('process-step', 'reveal', delay(index))} key={step.number + step.title}>{index > 0 && <div className="step-dot"></div>}<div className="step-num">{step.number}</div><div className="step-title">{step.title}</div><div className="step-text">{step.text}</div></div>)}</div></section>
        <section className="testimonial"><p className="section-label reveal" style={{ textAlign: 'center' }}>{home.testimonial.label}</p><blockquote className="testimonial-quote reveal reveal-delay-1">“{home.testimonial.quote}”</blockquote><p className="testimonial-author reveal reveal-delay-2">{home.testimonial.author}</p></section>
        <Footer content={content} navigate={navigate} />
      </div>

      <div className={classes('page', page === 'projects' && 'active')} id="page-projects">
        <div className="projects-hero"><p className="section-label reveal">Our Work</p><h1 className="section-title reveal reveal-delay-1">Selected<br /><em>Projects</em></h1><div className="projects-filter reveal reveal-delay-2"><button className={classes('filter-btn', activeCategory === 'all' && 'active')} onClick={() => setActiveCategory('all')}>All</button>{categories.map((category) => <button className={classes('filter-btn', activeCategory === category && 'active')} key={category} onClick={() => setActiveCategory(category)}>{categoryLabel(category)}</button>)}</div></div>
        <div className="projects-grid" id="projectsGrid">{filteredProjects.map((project, index) => <div className={classes('proj-card', 'reveal', 'visible', delay(index % 3))} data-cat={project.category} key={project.id}><div className="proj-img"><div className="proj-img-inner" style={imageStyle(project.thumbnail)}></div><button className="proj-img-overlay" aria-label={'View ' + project.title} onClick={() => setSelectedProject(project)}><span className="proj-view">View Project</span></button></div><div className="proj-info"><div className="proj-cat">{categoryLabel(project.category)}</div><div className="proj-title">{project.title}</div></div></div>)}</div>
        <Footer content={content} navigate={navigate} />
      </div>

      <div className={classes('page', page === 'about' && 'active')} id="page-about">
        <div className="about-hero"><div className="about-hero-visual reveal" style={imageStyle(about.image)}><div className="about-visual-lines"></div></div><div><p className="section-label reveal">{about.label}</p><p className="about-lead reveal reveal-delay-1">{about.lead}</p><p className="about-text reveal reveal-delay-2">{about.text1}</p><p className="about-text reveal reveal-delay-3">{about.text2}</p><div className="about-values reveal reveal-delay-4">{about.stats.map((stat) => <div className="about-val" key={stat.number + stat.label}><div className="about-val-num">{stat.number}</div><div className="about-val-label">{stat.label}</div></div>)}</div></div></div>
        <section className="about-story"><div className="about-story-grid"><div className="about-story-sticky"><p className="section-label reveal">{about.principles.label}</p><h2 className="section-title reveal reveal-delay-1">{about.principles.title_line1}<br /><em>{about.principles.title_em}</em></h2></div><div>{about.principles.items.map((principle, index) => <div style={{ marginBottom: 48 }} className={classes('reveal', delay(index))} key={principle.title}><div className="principle-title">{principle.title}</div><p className="principle-text">{principle.text}</p></div>)}</div></div></section>
        <Footer content={content} navigate={navigate} />
      </div>

      <div className={classes('page', page === 'services' && 'active')} id="page-services">
        <div className="services-hero"><p className="section-label reveal">{services.label}</p><h1 className="section-title reveal reveal-delay-1">{services.title_line1} <em>{services.title_em}</em></h1><p className="services-description reveal reveal-delay-2">{services.description}</p></div>
        <div className="services-grid">{services.items.map((service, index) => <div className={classes('svc-card', 'reveal', delay(index))} key={service.number + service.title}><div className="svc-num">{service.number}</div><div className={'svc-icon svc-icon-' + ((index % 4) + 1)}>{service.icon}</div><div className="svc-title">{service.title}</div><div className="svc-text">{service.text}</div><div className="svc-features">{service.features.map((feature) => <div className="svc-feat" key={feature}>{feature}</div>)}</div></div>)}</div>
        <section className="services-cta"><p className="section-label reveal" style={{ textAlign: 'center' }}>{services.cta.label}</p><h2 className="section-title reveal reveal-delay-1">{services.cta.title_line1}<br />{services.cta.title_line2} <em>{services.cta.title_em}</em></h2><p className="reveal reveal-delay-2">{services.cta.text}</p><div className="reveal reveal-delay-3"><button className="btn-primary" onClick={() => navigate('contact')}><span>{services.cta.button}</span></button></div></section>
        <Footer content={content} navigate={navigate} />
      </div>

      <div className={classes('page', page === 'contact' && 'active')} id="page-contact">
        <div className="contact-wrap"><div className="contact-info-sticky"><p className="section-label reveal">{contact.label}</p><p className="contact-lead reveal reveal-delay-1">{contact.lead}</p><div className="contact-details"><div className="contact-detail reveal reveal-delay-2"><div className="contact-detail-icon">✉</div><div className="contact-detail-text"><label>Email</label><span>{contact.email}</span></div></div><div className="contact-detail reveal reveal-delay-3"><div className="contact-detail-icon">◎</div><div className="contact-detail-text"><label>Studios</label><span>{contact.studios}</span></div></div><div className="contact-detail reveal reveal-delay-4"><div className="contact-detail-icon">☏</div><div className="contact-detail-text"><label>Phone</label><span>{contact.phone}</span></div></div></div><div className="social-links reveal">{content.footer.social.map((social) => <a className="social-link" key={social}>{social.slice(0, 2)}</a>)}</div></div>
          <form className="contact-form reveal reveal-delay-1" onSubmit={submitContact}><div className="form-title">Send a Message</div><div className="form-row"><div className="form-group"><label htmlFor="first-name">First Name</label><input id="first-name" required type="text" placeholder="First name" /></div><div className="form-group"><label htmlFor="last-name">Last Name</label><input id="last-name" required type="text" placeholder="Last name" /></div></div><div className="form-group"><label htmlFor="email">Email Address</label><input id="email" required type="email" placeholder="you@example.com" /></div><div className="form-group"><label htmlFor="service">Service of Interest</label><select id="service" required defaultValue=""><option value="" disabled>Select a service</option>{contact.service_options.map((option) => <option key={option}>{option}</option>)}</select></div><div className="form-group"><label htmlFor="budget">Project Budget</label><select id="budget" required defaultValue=""><option value="" disabled>Estimated budget range</option>{contact.budget_options.map((option) => <option key={option}>{option}</option>)}</select></div><div className="form-group"><label htmlFor="message">Tell Us About Your Project</label><textarea id="message" required placeholder="Describe your vision, the space, and any specific aspirations you have..."></textarea></div><button className="form-submit" type="submit"><span>Send Message →</span></button><div className={classes('success-msg', sent && 'show')}>✓ Thank you. We'll be in touch within one business day.</div></form>
        </div>
        <Footer content={content} navigate={navigate} />
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(undefined)}
          onInquire={() => {
            setSelectedProject(undefined);
            navigate('contact');
          }}
        />
      )}
      {source === 'seed' && <div className="content-fallback-notice">Showing offline content</div>}
      {error && <div className="content-fallback-notice">Live update paused — showing saved content</div>}
    </>
  );
}

export default App;
