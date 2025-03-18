/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";
import { EditControl } from "react-leaflet-draw";

// Define better typing for the event handlers
// interface DrawCreatedEvent {
//   layerType: string;
//   layer: L.Layer;
// }

// interface DrawEditedEvent {
//   layers: L.LayerGroup;
// }

export default function MapEditable() {
  // const [markers, setMarkers] = useState<L.LatLng[]>([]);
  const [customIcon, setCustomIcon] = useState<L.Icon | null>(null);

  // Initialize the icon after component mounts to avoid SSR issues
  useEffect(() => {
    // Fix Leaflet icon issues
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: "/leaflet/images/marker-icon.png",
      iconRetinaUrl: "/leaflet/images/marker-icon-2x.png",
      shadowUrl: "/leaflet/images/marker-shadow.png",
    });

    setCustomIcon(
      new L.Icon({
        iconUrl: "/leaflet/images/marker-icon.png",
        iconRetinaUrl: "/leaflet/images/marker-icon-2x.png",
        shadowUrl: "/leaflet/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      })
    );
  }, []);

  // Event when adding a new marker
  // const handleCreated = (e: any) => {
  //   const event = e as DrawCreatedEvent;
  //   if (event.layerType === "marker") {
  //     const newMarker = (event.layer as L.Marker).getLatLng();
  //     setMarkers([...markers, newMarker]);
  //   }
  // };

  // // Event when editing or deleting
  // const handleEdited = (e: any) => {
  //   const event = e as DrawEditedEvent;
  //   console.log("Edited layers:", event.layers);
  // };

  // // Event when deleting
  // const handleDeleted = (e: any) => {
  //   console.log("Deleted layers:", e.layers);
  //   // You could update your markers state here if needed
  // };

  if (!customIcon) {
    return <div>Loading map...</div>;
  }

  return (
    <MapContainer
      center={[-8.65, 115.21]}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <FeatureGroup>
        <EditControl
          position="topright"
          // onCreated={handleCreated}
          // onEdited={handleEdited}
          // onDeleted={handleDeleted}
          draw={{
            rectangle: true,
            polygon: true,
            circle: true,
            marker: true,
            polyline: true,
          }}
        />
      </FeatureGroup>

      {/* {markers.map((pos, index) => (
        <Marker key={`marker-${index}`} position={pos} icon={customIcon}>
          <Popup>Marker {index + 1}</Popup>
        </Marker>
      ))} */}
    </MapContainer>
  );
}
