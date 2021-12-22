"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorPicker = exports.PresetGrid = exports.PresetColor = exports.GradientCanvas = exports.PresetSelection = exports.HexInput = exports.BlackTransparent = exports.BlackOpaque = exports.WhiteTransparent = exports.WhiteOpaque = exports.White = exports.Black = exports.Fuchsia = exports.Magenta = exports.Blue = exports.Cyan = exports.Aqua = exports.Green = exports.Yellow = exports.Red = exports.getColorsFromLocalStorage = exports.addColorToLocalStorage = exports.diffColor = exports.hexToRGBA = exports.isBlackOpaque = exports.isValidColor = exports.toHex = exports.toRGBAString = exports.rgb = exports.rgba = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const fixture_1 = require("./fixture");
const rgba = (r, g, b, a) => {
    return { r, g, b, a };
};
exports.rgba = rgba;
const rgb = (r, g, b) => {
    return (0, exports.rgba)(r, g, b, 1);
};
exports.rgb = rgb;
const toRGBAString = (color) => {
    return `rgba(${color.r},${color.g},${color.b},${color.a})`;
};
exports.toRGBAString = toRGBAString;
const toHex = (color) => {
    let r = color.r.toString(16).padStart(2, "0");
    let g = color.g.toString(16).padStart(2, "0");
    let b = color.b.toString(16).padStart(2, "0");
    let a = Math.round(color.a * 255)
        .toString(16)
        .padStart(2, "0");
    return `#${r}${g}${b}${a}`;
};
exports.toHex = toHex;
const isValidColor = (color) => {
    return color.r > -1 && color.g > -1 && color.b > -1 && color.a > -1;
};
exports.isValidColor = isValidColor;
const isBlackOpaque = (color) => {
    return color.r === 0 && color.g === 0 && color.b === 0 && color.a === 1;
};
exports.isBlackOpaque = isBlackOpaque;
const hexToRGBA = (hexInput) => {
    const hexWithoutHash = hexInput.slice(1, hexInput.length);
    const parse = (hex) => parseInt(hex.padStart(2, hex), 16);
    let r;
    let g;
    let b;
    let a;
    switch (hexWithoutHash.length) {
        case 3:
            [r, g, b] = Array.prototype.map.call(hexWithoutHash, parse);
            return (0, exports.rgb)(r, g, b);
        case 6:
            [r, g, b] = [0, 2, 4]
                .map((index) => hexWithoutHash.slice(index, index + 2))
                .map(parse);
            return (0, exports.rgb)(r, g, b);
        case 8:
            [r, g, b, a] = [0, 2, 4, 6]
                .map((index) => hexWithoutHash.slice(index, index + 2))
                .map(parse);
            return (0, exports.rgba)(r, g, b, a / 255);
        default: {
            return {
                r: -1,
                g: -1,
                b: -1,
                a: -1,
            };
        }
    }
};
exports.hexToRGBA = hexToRGBA;
const diffColor = (a, b) => {
    return Math.sqrt(Math.pow(a.r - b.r, 2) + Math.pow(a.g - b.g, 2) + Math.pow(a.b - b.b, 2));
};
exports.diffColor = diffColor;
const addColorToLocalStorage = (localStorageKey, color) => {
    let preset = (0, exports.getColorsFromLocalStorage)(localStorageKey);
    const hex = (0, exports.toHex)(color);
    const existingIndex = preset.indexOf(hex);
    if (existingIndex !== -1) {
        preset = preset.filter((color) => color !== hex);
    }
    preset = [hex, ...preset];
    localStorage.setItem(localStorageKey, JSON.stringify(preset));
};
exports.addColorToLocalStorage = addColorToLocalStorage;
const getColorsFromLocalStorage = (localStorageKey) => {
    let preset = [];
    const valueInLocalStorage = localStorage.getItem(localStorageKey);
    if (valueInLocalStorage) {
        try {
            preset = JSON.parse(valueInLocalStorage);
        }
        catch (e) { }
    }
    return preset;
};
exports.getColorsFromLocalStorage = getColorsFromLocalStorage;
exports.Red = (0, exports.rgb)(255, 0, 0);
exports.Yellow = (0, exports.rgb)(255, 255, 0);
exports.Green = (0, exports.rgb)(0, 255, 0);
exports.Aqua = (0, exports.rgb)(0, 255, 255);
exports.Cyan = exports.Aqua;
exports.Blue = (0, exports.rgb)(0, 0, 255);
exports.Magenta = (0, exports.rgb)(255, 0, 255);
exports.Fuchsia = exports.Magenta;
exports.Black = (0, exports.rgb)(0, 0, 0);
exports.White = (0, exports.rgb)(255, 255, 255);
exports.WhiteOpaque = (0, exports.rgba)(255, 255, 255, 1);
exports.WhiteTransparent = (0, exports.rgba)(255, 255, 255, 0);
exports.BlackOpaque = (0, exports.rgba)(0, 0, 0, 1);
exports.BlackTransparent = (0, exports.rgba)(0, 0, 0, 0);
const HexInput = ({ color, onChange }) => {
    const [buffer, setBuffer] = (0, react_1.useState)("");
    return ((0, jsx_runtime_1.jsx)("input", { type: "text", style: {
            width: "6rem",
        }, onChange: (event) => {
            const textValue = event.target.value;
            const webSafeColors = (0, fixture_1.getWebSafeColors)();
            let color;
            if (webSafeColors.hasOwnProperty(textValue)) {
                color = (0, exports.hexToRGBA)(webSafeColors[textValue]);
                console.log(color);
            }
            else {
                color = (0, exports.hexToRGBA)(textValue);
            }
            if ((0, exports.isValidColor)(color)) {
                onChange(color);
                setBuffer("");
            }
            else {
                setBuffer(textValue);
            }
        }, value: buffer || (0, exports.toHex)(color) }, void 0));
};
exports.HexInput = HexInput;
const PresetSelection = ({ currentPreset, presets, onSelect }) => {
    return ((0, jsx_runtime_1.jsx)("select", { value: currentPreset.key, onChange: (event) => onSelect(event.target.value), children: presets.map((preset) => ((0, jsx_runtime_1.jsx)("option", { value: preset.key, children: preset.label }, preset.key))) }, void 0));
};
exports.PresetSelection = PresetSelection;
const GradientCanvas = ({ currentColor, reflectedColor, background = exports.WhiteTransparent, width, height, gradients, pickerBorderWidth, pickerSize, fixedVerticalPosition = false, fixedHorizontalPosition = false, initialPickerPosition = { x: -1, y: -1 }, onChange = () => { }, onSelect = () => { }, onReflect = () => { }, }) => {
    const canvas = (0, react_1.useRef)(null);
    const [pickerPosition, setPickerPosition] = (0, react_1.useState)(initialPickerPosition);
    const drawGradients = () => {
        if (!canvas.current)
            return;
        const context = canvas.current.getContext("2d");
        if (!context)
            return;
        context.fillStyle = (0, exports.toHex)(background);
        context.fillRect(0, 0, width, height);
        gradients.forEach((gradient) => {
            let gradientVectors;
            switch (gradient.direction) {
                case "to-right":
                    gradientVectors = [0, 0, width, 0];
                    break;
                case "to-bottom":
                default:
                    gradientVectors = [0, 0, 0, height];
                    break;
            }
            const linearGradient = context.createLinearGradient(...gradientVectors);
            gradient.colors.forEach((color, index) => {
                linearGradient.addColorStop(index * (1 / (gradient.colors.length - 1)), (0, exports.toRGBAString)(color));
            });
            context.fillStyle = linearGradient;
            context.fillRect(0, 0, width, height);
        });
    };
    (0, react_1.useEffect)(() => {
        if (reflectedColor) {
            const position = findColorOnCanvas(reflectedColor);
            if (position) {
                onReflect(pickColorFromCanvas(position));
            }
        }
    }, [reflectedColor]);
    const setPickerPositionPageCoordinates = (position) => {
        if (!canvas.current) {
            return pickerPosition;
        }
        const boundingBox = canvas.current.getBoundingClientRect();
        let relativePosition = {
            ...pickerPosition,
        };
        if (!fixedHorizontalPosition) {
            relativePosition.x = position.x - boundingBox.left;
        }
        if (!fixedVerticalPosition) {
            relativePosition.y = position.y - boundingBox.top;
        }
        setPickerPosition(relativePosition);
        return relativePosition;
    };
    const onMouseMove = (event) => {
        if (event.buttons === 0)
            return;
        const position = setPickerPositionPageCoordinates({
            x: event.clientX,
            y: event.clientY,
        });
        const color = pickColorFromCanvas(position);
        if (color) {
            onChange(color);
        }
    };
    const onMouseDown = (event) => {
        if (event.buttons === 0)
            return;
        setPickerPositionPageCoordinates({ x: event.clientX, y: event.clientY });
    };
    const onTouchDown = (event) => {
        if (event.touches === 0)
            return;
        const [position] = event.touches;
        setPickerPositionPageCoordinates({
            x: position.clientX,
            y: position.clientY,
        });
    };
    const onTouchMove = (event) => {
        if (event.touches === 0)
            return;
        const [firstTouch] = event.touches;
        const position = setPickerPositionPageCoordinates({
            x: firstTouch.clientX,
            y: firstTouch.clientY,
        });
        const color = pickColorFromCanvas(position);
        if (color) {
            onChange(color);
        }
    };
    const onMouseUp = () => {
        const color = pickColorFromCanvas(pickerPosition);
        if (color) {
            onSelect(color);
        }
    };
    const onTouchEnd = () => {
        const color = pickColorFromCanvas(pickerPosition);
        if (color) {
            onSelect(color);
        }
    };
    const pickColorFromCanvas = (position) => {
        if (!canvas.current)
            return;
        const context = canvas.current.getContext("2d");
        if (!context)
            return;
        const colorData = context.getImageData(position.x, position.y, 1, 1).data;
        const r = colorData[0];
        const g = colorData[1];
        const b = colorData[2];
        return (0, exports.rgb)(r, g, b);
    };
    const findColorOnCanvas = (color) => {
        if (!canvas.current)
            return;
        const context = canvas.current.getContext("2d");
        if (!context)
            return;
        const boundingBox = canvas.current.getBoundingClientRect();
        const distanceMap = new Map();
        for (let x = 0; x < boundingBox.width; x += 1) {
            const colorData = context.getImageData(x, 0, 1, 1).data;
            const r = colorData[0];
            const g = colorData[1];
            const b = colorData[2];
            distanceMap.set((0, exports.diffColor)(color, (0, exports.rgb)(r, g, b)), { x, y: 0 });
        }
        let min = 255;
        let closest = pickerPosition;
        for (const [distance, point] of distanceMap.entries()) {
            if (distance < min) {
                min = distance;
                closest = point;
            }
        }
        const position = {
            x: closest.x,
            y: initialPickerPosition.y,
        };
        setPickerPosition(position);
        return position;
    };
    (0, react_1.useEffect)(drawGradients, [background]);
    (0, react_1.useEffect)(() => {
        findColorOnCanvas(currentColor);
    }, []);
    return ((0, jsx_runtime_1.jsxs)("div", { style: {
            display: "flex",
            position: "relative",
        }, children: [(0, jsx_runtime_1.jsx)("div", { style: {
                    top: pickerPosition.y - pickerSize / 2 - pickerBorderWidth,
                    left: Math.max(Math.min(pickerPosition.x, width - pickerSize * 2 - 2), 2),
                    width: pickerSize,
                    height: pickerSize,
                    position: "absolute",
                    border: `${pickerBorderWidth}px solid white`,
                    borderRadius: "50%",
                    pointerEvents: "none",
                } }, void 0), (0, jsx_runtime_1.jsx)("canvas", { onMouseMove: onMouseMove, onMouseDown: onMouseDown, onMouseUp: onMouseUp, onTouchMove: onTouchMove, onTouchStart: onTouchDown, onTouchEnd: onTouchEnd, ref: canvas, width: width, height: height }, void 0)] }, void 0));
};
exports.GradientCanvas = GradientCanvas;
const PresetColor = ({ color, size, onClick }) => {
    return ((0, jsx_runtime_1.jsx)("span", { onClick: onClick, style: {
            width: size,
            cursor: "pointer",
            height: size,
            background: (0, exports.toRGBAString)(color),
        } }, void 0));
};
exports.PresetColor = PresetColor;
const PresetGrid = ({ preset, visibilePresetColors, presetItemSize, onSelect, localStorageKey, }) => {
    let colors;
    if (preset.keepHistory) {
        colors = (0, exports.getColorsFromLocalStorage)(localStorageKey).map(exports.hexToRGBA);
    }
    else {
        colors = preset.colors;
    }
    colors = colors.concat(Array(visibilePresetColors).fill(exports.White));
    colors = colors.slice(0, visibilePresetColors);
    return ((0, jsx_runtime_1.jsx)("div", { style: {
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
        }, children: colors.map((color, index) => ((0, jsx_runtime_1.jsx)(exports.PresetColor, { onClick: () => onSelect(color), size: presetItemSize, color: color }, index))) }, void 0));
};
exports.PresetGrid = PresetGrid;
const ColorPicker = ({ color = { r: 0, g: 255, b: 0, a: 1 }, hueGradientWidth = 320, hueGradientHeight = 30, shadeGradientWidth = 320, shadeGradientHeight = 200, visibilePresetColors = 40, presetItemSize = 14, onChange, pickerSize = 10, pickerBorderWidth = 3, localStorageKey = "color-picker-with-presets", defaultPresetIndex = 0, presets = [
    {
        key: "last-used-colors",
        label: "Last used colors",
        colors: [exports.Black, exports.White, exports.Yellow],
        keepHistory: true,
    },
    {
        key: "basic-colors",
        label: "Basic colors",
        colors: [exports.Red, exports.Yellow, exports.Green, exports.Aqua, exports.Blue, exports.Fuchsia, exports.Black, exports.White],
        keepHistory: false,
    },
    {
        key: "web-safe-colors",
        label: "Web safe colors",
        colors: Object.values(fixture_1.WEB_SAFE_COLORS).map(exports.hexToRGBA),
        keepHistory: false,
    },
], }) => {
    const [hue, setHue] = (0, react_1.useState)(color);
    const [currentPreset, setCurrentPreset] = (0, react_1.useState)(presets[defaultPresetIndex]);
    const [reflectedColor, setReflectedColor] = (0, react_1.useState)(color);
    (0, react_1.useEffect)(() => {
        (0, exports.addColorToLocalStorage)(localStorageKey, color);
    }, [color]);
    return ((0, jsx_runtime_1.jsxs)("div", { style: {
            display: "flex",
            flexDirection: "column",
            gap: 5,
            width: Math.max(hueGradientWidth, shadeGradientWidth),
        }, children: [(0, jsx_runtime_1.jsx)(exports.GradientCanvas, { onReflect: (color) => {
                    if (color && !(0, exports.isBlackOpaque)(color)) {
                        setReflectedColor(color);
                    }
                }, reflectedColor: color, background: exports.WhiteTransparent, currentColor: hue, width: hueGradientWidth, height: hueGradientHeight, fixedVerticalPosition: true, pickerBorderWidth: pickerBorderWidth, pickerSize: pickerSize, initialPickerPosition: {
                    x: hueGradientWidth / 2 - pickerSize / 2,
                    y: hueGradientHeight / 2,
                }, onChange: (color) => {
                    setHue(color);
                    setReflectedColor(color);
                }, gradients: [
                    {
                        direction: "to-right",
                        colors: [exports.Red, exports.Yellow, exports.Green, exports.Aqua, exports.Blue, exports.Magenta],
                    },
                ] }, void 0), (0, jsx_runtime_1.jsx)(exports.GradientCanvas, { pickerSize: pickerSize, pickerBorderWidth: pickerBorderWidth, background: reflectedColor, currentColor: color, width: shadeGradientWidth, height: shadeGradientHeight, onSelect: onChange, initialPickerPosition: { x: shadeGradientWidth - 5, y: pickerSize + 4 }, gradients: [
                    { direction: "to-right", colors: [exports.WhiteOpaque, exports.WhiteTransparent] },
                    { direction: "to-bottom", colors: [exports.BlackTransparent, exports.BlackOpaque] },
                ] }, void 0), (0, jsx_runtime_1.jsxs)("div", { style: {
                    display: "flex",
                    gap: 5,
                    justifyContent: "space-between",
                }, children: [(0, jsx_runtime_1.jsx)(exports.PresetSelection, { onSelect: (presetKey) => setCurrentPreset(presets.find((preset) => preset.key === presetKey)), presets: presets, currentPreset: currentPreset }, void 0), (0, jsx_runtime_1.jsx)(exports.HexInput, { color: color, onChange: onChange }, void 0)] }, void 0), (0, jsx_runtime_1.jsx)(exports.PresetGrid, { presetItemSize: presetItemSize, visibilePresetColors: visibilePresetColors, preset: currentPreset, onSelect: onChange, localStorageKey: localStorageKey }, void 0)] }, void 0));
};
exports.ColorPicker = ColorPicker;
//# sourceMappingURL=index.js.map