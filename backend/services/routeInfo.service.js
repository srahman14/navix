// Temporary - in memory store (until DB)
let routesInformation = []

export const createRouteInfo = (data) => {
    const newRouteInfo = {
        ...data
    };

    routesInformation.push(newRouteInfo);
    return newRouteInfo;
}

export const getRouteInfo = () => routesInformation;