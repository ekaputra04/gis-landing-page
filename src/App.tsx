import MapEditable from "./components/MapEditable";
import { WorldMapComponent } from "./components/WorldMap";

export default function App() {
  return (
    <>
      <div className="px-8 md:px-16 lg:px-32 pb-16">
        <WorldMapComponent />
        <MapEditable />
      </div>
    </>
  );
}
