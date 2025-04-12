/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Marker,
  Popup,
} from "react-leaflet";
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

export type MarkerData = {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  userId: string;
  categoryId: number;
};

export type LineData = {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number][];
  userId: string;
  categoryId: number;
};

export type RectangleData = {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number][];
  userId: string;
  categoryId: number;
};

export default function MapEditable() {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const [loading, setLoading] = useState(false);
  const [customIcon, setCustomIcon] = useState<L.Icon | null>(null);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  // const [lines, setLines] = useState<LineData[]>([]);
  // const [rectangles, setRectangles] = useState<RectangleData[]>([]);

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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const responseMarkers = await fetch(API_URL + "/api/maps/markers");
        const dataMarkers = await responseMarkers.json();
        console.log("Markers data:", dataMarkers);
        setMarkers(dataMarkers.data);

        // const responseLines = await fetch(API_URL + "/api/maps/lines");
        // const lines = await responseLines.json();
        // const linesData = lines.data;

        // const lineProcessed = linesData.map((line: any) => ({
        //   id: line.id.toString(),
        //   name: line.name,
        //   description: line.description,
        //   coordinates: JSON.parse(line.coordinates).coordinates.map(
        //     ([lng, lat]: [number, number]) => [lat, lng] // ✅ Tukar agar sesuai format Leaflet [lat, lng]
        //   ),
        //   userId: line.userId,
        //   categoryId: line.categoryId,
        //   createdAt: line.createdAt,
        //   updatedAt: line.updatedAt,
        // }));

        // console.log("Lines data:", lineProcessed);

        // setLines(lineProcessed.data);

        // const responseRectangles = await fetch(
        //   API_URL + "/api/maps/rectangles"
        // );
        // const dataRectangles = await responseRectangles.json();
        // console.log("Rectangles data:", dataRectangles);
        // setRectangles(dataRectangles.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
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
    <>
      {loading && <div>Loading maps data...</div>}
      {!loading && (
        <>
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

            {markers.map((marker, index) => (
              <Marker
                key={index}
                position={[marker.lat, marker.lng]}
                icon={customIcon}
              >
                <Popup>
                  {marker.name ? (
                    <strong>{marker.name}</strong>
                  ) : (
                    "Lokasi tanpa nama"
                  )}{" "}
                  <br />
                  {marker.description || "Tidak ada deskripsi"}
                </Popup>
              </Marker>
            ))}

            {/* {lines.map((line) => (
              <Polyline
                key={line.id}
                positions={line.coordinates.map((p) => [p[0], p[1]])}
                color="blue"
              >
                <Popup>
                  <strong>{line.name}</strong> <br />
                  {line.description || "Tidak ada deskripsi"}
                </Popup>
              </Polyline>
            ))} */}

            {/* {rectangles.map((rect) => {
              if (
                !rect.coordinates ||
                !Array.isArray(rect.coordinates) ||
                rect.coordinates.length === 0
              ) {
                console.warn(
                  `Rectangle ${rect.id} tidak memiliki data koordinat yang valid`
                );
                return null;
              }

              const coordinates = rect.coordinates;
              return (
                <Polygon
                  key={rect.id}
                  positions={coordinates as any}
                  color="blue"
                >
                  <Popup>
                    <strong>{rect.name}</strong> <br />
                    {rect.description || "Tidak ada deskripsi"}
                  </Popup>
                </Polygon>
              );
            })} */}
          </MapContainer>
        </>
      )}
    </>
  );
}
