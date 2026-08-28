// types/index.ts

export interface Stat         { value: string; label: string }
export interface Service      { icon: string; title: string; desc: string; color: string }
export interface Leader       { name: string; role: string; emoji: string; colorFrom: string; colorTo: string; message: string; responsibilities: string[] }
export interface TeamMember   { name: string; role: string; skills: string[]; emoji: string; color: string }
export interface Project      { title: string; client: string; desc: string; tech: string[]; result: string; emoji: string; color: string; demoUrl: string }
export interface Solution     { label: string; emoji: string; color: string }
export interface ResearchItem { title: string; category: string; author: string; date: string; emoji: string; color: string }
export interface RoadmapQ     { quarter: string; tasks: { label: string; done: boolean }[] }
export interface Testimonial  { name: string; company: string; text: string; rating: number }
export interface Career       { title: string; type: string; location: string; color: string }
export interface GalleryItem  { label: string; emoji: string; color: string; cat: string }
export interface NavLink      { href: string; label: string }
