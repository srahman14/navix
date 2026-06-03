import { getRoute } from "@/lib/api"

export const routeService = {
    fetchRoute: async (start: any, end: any) => {
        return getRoute([start, end], "driving-car")
    }
}