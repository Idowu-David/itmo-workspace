import api from "./api";

export default async function fetchDesks() {
  try {
    const response = await api.get("/desks");
    return response.data
   } catch (error) {
    console.error("Error while fetching from frontend", error);
  }
}
