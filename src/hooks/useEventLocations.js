import { useEffect, useState } from "react";

export function useEventLocations() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/events/locations")
      .then((res) => res.json())
      .then(setLocations);
  }, []);

  return locations;
}
