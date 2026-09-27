import { Project } from '../types/content';
import { ProjectModal } from './ProjectModal';

interface ProjectDialogProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  formatCategory?: (cat: string) => string;
}

export function ProjectDialog({ project, isOpen, onClose }: ProjectDialogProps) {
  if (!isOpen || !project) return null;
  return <ProjectModal project={project} onClose={onClose} />;
}
