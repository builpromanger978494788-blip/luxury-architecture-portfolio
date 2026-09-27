import { useState } from 'react';
import { WebsiteContent } from '../types/content';
import styles from './Contact.module.css';

interface ContactProps {
  content: WebsiteContent;
}

export default function Contact({ content }: ContactProps) {
  const { contact } = content;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    budget: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Fallback to mailto since there's no backend for this form
    const subject = `Enquiry: ${formData.service || 'General'} from ${formData.name}`;
    const body = `Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0ABudget: ${formData.budget}%0D%0A%0D%0A${formData.message}`;
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="animate-fade-in">
      <section className={styles.contactSection}>
        <div className="container">
          <div className={styles.grid}>
            
            <div className={styles.infoColumn}>
              <span className="eyebrow">{contact.label}</span>
              <h1 className="text-display-3" style={{ marginBottom: 'var(--space-8)' }}>{contact.lead}</h1>
              
              <div className={styles.contactDetails}>
                <div className={styles.detailBlock}>
                  <h3 className="eyebrow">Email Us</h3>
                  <a href={`mailto:${contact.email}`} className={styles.link}>{contact.email}</a>
                </div>
                
                <div className={styles.detailBlock}>
                  <h3 className="eyebrow">Call Us</h3>
                  <a href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`} className={styles.link}>{contact.phone}</a>
                </div>
                
                <div className={styles.detailBlock}>
                  <h3 className="eyebrow">Our Studios</h3>
                  <div className={styles.studios} dangerouslySetInnerHTML={{ __html: contact.studios }} />
                </div>
              </div>
            </div>

            <div className={styles.formColumn}>
              <div className={styles.formCard}>
                <h2 className="text-display-4" style={{ marginBottom: 'var(--space-6)' }}>Send an Enquiry</h2>
                <p className="eyebrow" style={{ color: 'var(--color-stone)', marginBottom: 'var(--space-8)' }}>
                  This form will open your default email client.
                </p>

                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      required 
                      className={styles.input}
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      required 
                      className={styles.input}
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="service" className={styles.label}>Service Required</label>
                      <div className={styles.selectWrapper}>
                        <select 
                          id="service" 
                          name="service" 
                          required 
                          className={styles.select}
                          value={formData.service}
                          onChange={handleChange}
                        >
                          <option value="" disabled>Select a service...</option>
                          {contact.service_options.map((opt, idx) => (
                            <option key={idx} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="budget" className={styles.label}>Budget Range</label>
                      <div className={styles.selectWrapper}>
                        <select 
                          id="budget" 
                          name="budget" 
                          required 
                          className={styles.select}
                          value={formData.budget}
                          onChange={handleChange}
                        >
                          <option value="" disabled>Select a budget...</option>
                          {contact.budget_options.map((opt, idx) => (
                            <option key={idx} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="message" className={styles.label}>Project Details</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows={5} 
                      required 
                      className={styles.textarea}
                      value={formData.message}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                    Prepare Email
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
