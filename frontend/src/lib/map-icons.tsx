import type { Map as MapLbreMap, MapLibreMap } from "maplibre-gl" 

export const MAP_ICONS = {
    TRUCK: "frontal-truck",
    TRUCK_SELECTED: "truck-selected",
    ORDER: "box",
}
const ICONS_CONFIG = [
    {
        key: MAP_ICONS.TRUCK,
        file: "frontal-truck",
    },
    {
        key: MAP_ICONS.ORDER,
        file: "box",
    },
];

export const getIconPath = (
    theme: string,
    icon: string
) => {
    return `/icons/${theme}/${icon}.png`;
}


export const registerMapIcons = async (
    map: MapLibreMap, 
    theme: string
) => {
    for (const icon of ICONS_CONFIG) {
        if (map.hasImage(icon.key)) continue;

        const image = await map.loadImage(
            getIconPath(theme, icon.file)
        );

        map.addImage(icon.file, image.data);
    }
};

export const reloadMapIcons = async (
    map: MapLibreMap,
    theme: string
) => {
    for (const icon of ICONS_CONFIG) {
        if (map.hasImage(icon.key)) {
            map.removeImage(icon.key);
        }
    }

    await registerMapIcons(map, theme);
}
