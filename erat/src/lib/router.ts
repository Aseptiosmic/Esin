export type RouteName = "home" | "index" | "piece" | "board" | "about" | "contact";
export type Route = { name: RouteName; id?: string };

export function parseHash(hash: string): Route {
  const h = hash.replace(/^#\/?/, "");
  const [a, b] = h.split("/");
  switch (a) {
    case "index":
    case "sites":
      return { name: "index" };
    case "about":
    case "contact":
      return { name: a };
    case "board":
      return b ? { name: "board", id: decodeURIComponent(b) } : { name: "board" };
    case "site":
    case "piece":
      return b ? { name: "piece", id: decodeURIComponent(b) } : { name: "index" };
    case "":
    case undefined:
      return { name: "home" };
    default:
      // retired plates of the old library (library, cabinet, atlas, archive, analyze…)
      return { name: "index" };
  }
}

export function toHash(r: Route) {
  if (r.name === "home") return "#/";
  if (r.name === "piece") return `#/site/${r.id}`;
  if (r.name === "board" && r.id) return `#/board/${encodeURIComponent(r.id)}`;
  return `#/${r.name}`;
}

export function routeKey(r: Route) {
  return r.name === "piece" || r.name === "board" ? `${r.name}-${r.id ?? ""}` : r.name;
}

/** visual tone of the chrome on each page */
export function toneOf(r: Route): "scene" | "paper" | "dark" | "fog" {
  if (r.name === "home" || r.name === "contact") return "scene";
  return "paper";
}

export const PLATE_ORDER: RouteName[] = ["home", "index", "piece", "board", "about", "contact"];
export const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
export const plateNo = (n: RouteName) => ROMAN[Math.max(0, PLATE_ORDER.indexOf(n))];
