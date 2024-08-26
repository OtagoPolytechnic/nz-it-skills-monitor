let map: google.maps.Map;
const center: google.maps.LatLngLiteral = {lat: 30, lng: -110};

const initMap = () => {
  map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    center,
    zoom: 8
  });
}

export default initMap;
