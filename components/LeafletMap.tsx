'use client';

import { useEffect, useRef } from 'react';

const LOCATIONS = {
  phulwari: {
    lat: 25.576096,
    lng: 85.063250,
    label: 'Phulwari Sharif',
    address: 'Phulwari Sharif, Patna, Bihar',
  },
  sabzibagh: {
    lat: 25.616797,
    lng: 85.152619,
    label: 'Sabzibagh',
    address: 'Sabzibagh, Patna, Bihar',
  },
} as const;

type LocationKey = keyof typeof LOCATIONS;

interface LeafletMapProps {
  activeLocation: LocationKey;
}

export default function LeafletMap({ activeLocation }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    // Dynamically import leaflet (client-side only)
    import('leaflet').then((L) => {
      // Fix default icon path issue with Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const loc = LOCATIONS[activeLocation];

      if (!mapInstanceRef.current) {
        // Create map
        const map = L.map(mapRef.current!, {
          center: [loc.lat, loc.lng],
          zoom: 15,
          zoomControl: true,
          scrollWheelZoom: false,
        });

        // Premium dark/stylised tile layer (CartoDB Dark Matter)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 20,
        }).addTo(map);

        // Custom golden marker icon
        const goldIcon = L.divIcon({
          className: '',
          html: `
            <div style="
              width:36px; height:36px;
              background: linear-gradient(135deg,#bf953f,#fcf6ba,#d4a843);
              border-radius:50% 50% 50% 0;
              transform:rotate(-45deg);
              border:3px solid rgba(255,255,255,0.9);
              box-shadow:0 4px 16px rgba(212,175,55,0.6),0 0 24px rgba(212,175,55,0.3);
            "></div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          popupAnchor: [0, -40],
        });

        const marker = L.marker([loc.lat, loc.lng], { icon: goldIcon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:sans-serif;text-align:center;min-width:140px;">
              <strong style="font-size:0.9rem;color:#1a1a1a;">${loc.label}</strong>
              <p style="font-size:0.75rem;color:#555;margin:4px 0 0;">${loc.address}</p>
            </div>`,
            { className: 'luxury-popup' }
          )
          .openPopup();

        mapInstanceRef.current = map;
        markerRef.current = marker;
      } else {
        // Update existing map
        const loc = LOCATIONS[activeLocation];
        mapInstanceRef.current.setView([loc.lat, loc.lng], 15, { animate: true });

        if (markerRef.current) {
          markerRef.current.setLatLng([loc.lat, loc.lng]);
          markerRef.current.getPopup()?.setContent(
            `<div style="font-family:sans-serif;text-align:center;min-width:140px;">
              <strong style="font-size:0.9rem;color:#1a1a1a;">${loc.label}</strong>
              <p style="font-size:0.75rem;color:#555;margin:4px 0 0;">${loc.address}</p>
            </div>`
          );
          markerRef.current.openPopup();
        }
      }
    });

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle location change without remounting
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current) return;
    const loc = LOCATIONS[activeLocation];
    mapInstanceRef.current.setView([loc.lat, loc.lng], 15, { animate: true });
    markerRef.current.setLatLng([loc.lat, loc.lng]);
    markerRef.current.getPopup()?.setContent(
      `<div style="font-family:sans-serif;text-align:center;min-width:140px;">
        <strong style="font-size:0.9rem;color:#1a1a1a;">${loc.label}</strong>
        <p style="font-size:0.75rem;color:#555;margin:4px 0 0;">${loc.address}</p>
      </div>`
    );
    markerRef.current.openPopup();
  }, [activeLocation]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        crossOrigin=""
      />
      <style>{`
        .luxury-popup .leaflet-popup-content-wrapper {
          border-radius: 10px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.25);
        }
        .luxury-popup .leaflet-popup-tip { background: #fff; }
        .leaflet-control-zoom a {
          background: rgba(20,20,30,0.9) !important;
          color: #d4af37 !important;
          border-color: rgba(212,175,55,0.3) !important;
        }
        .leaflet-control-zoom a:hover {
          background: rgba(212,175,55,0.2) !important;
        }
        .leaflet-control-attribution {
          background: rgba(10,10,20,0.75) !important;
          color: rgba(255,255,255,0.4) !important;
          font-size: 9px !important;
        }
        .leaflet-control-attribution a { color: rgba(212,175,55,0.6) !important; }
      `}</style>
      <div
        ref={mapRef}
        style={{ width: '100%', height: '100%', minHeight: '500px', borderRadius: '0' }}
      />
    </>
  );
}
