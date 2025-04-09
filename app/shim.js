// Polyfill btoa for Hermes
import { encode as btoa } from "base-64";
if (typeof globalThis.btoa === "undefined") {
  globalThis.btoa = btoa;
}
