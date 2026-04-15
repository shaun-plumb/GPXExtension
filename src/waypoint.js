class WayPoint {
  constructor(lat, lon, silent, name = null) {
    this.lat = lat;
    this.lon = lon;
    this.silent = silent;
    this.name = name;
  }

  toString() {
    return `WayPoint{lat=${this.lat}, lon=${this.lon}, silent=${this.silent}, name='${this.name}'}`;
  }
}
