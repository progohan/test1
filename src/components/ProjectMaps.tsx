import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { ResumeData, ProjectRegion } from '../types';

const icon = L.icon({ iconUrl: markerIcon, iconRetinaUrl: markerIcon2x, shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
const regions: Array<{ id: ProjectRegion | 'global'; label: string }> = [
  { id: 'global', label: 'Global' }, { id: 'usa', label: 'United States' },
  { id: 'canada', label: 'Canada' }, { id: 'europe', label: 'Europe' },
  { id: 'south-america', label: 'South America' },
];
function FitProjects({ projects }: { projects: ResumeData['key_projects'] }) {
  const map = useMap();
  useEffect(() => {
    if (!projects.length) return;
    const bounds = L.latLngBounds(projects.map(project => [project.map.latitude, project.map.longitude]));
    map.fitBounds(bounds, { padding: [35, 35], maxZoom: 11 });
  }, [map, projects]);
  return null;
}
export default function ProjectMaps({ projects }: { projects: ResumeData['key_projects'] }) {
  const [region, setRegion] = useState<ProjectRegion | 'global'>('global');
  const visible = region === 'global' ? projects : projects.filter(project => project.region === region);
  return <div className="mt-12">
    <h3 className="text-3xl font-semibold text-center mb-4">Interactive Project Atlas</h3>
    <p className="text-muted-foreground text-center mb-6">Approximate project locations, not office locations or surveyed coordinates.</p>
    <div className="flex flex-wrap gap-2 mb-4">{regions.map(item => <button key={item.id} type="button" aria-pressed={region === item.id} onClick={() => setRegion(item.id)} className={`px-4 py-2 rounded-full border ${region === item.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>{item.label}</button>)}</div>
    <div className="h-[480px] w-full border border-border rounded-xl overflow-hidden" aria-label="Approximate project locations">
      <MapContainer center={[30, -30]} zoom={3} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <FitProjects projects={visible} />
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {visible.map(project => <Marker key={project.name} icon={icon} position={[project.map.latitude, project.map.longitude]}><Popup><strong>{project.name}</strong><br />{project.map.label}<br />Approximate location</Popup></Marker>)}
      </MapContainer>
    </div>
    <ul className="sr-only">{visible.map(project => <li key={project.name}>{project.name}: {project.map.label}, approximate location.</li>)}</ul>
  </div>;
}
