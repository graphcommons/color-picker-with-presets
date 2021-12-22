import { FC, useEffect, useRef, useState } from "react";
import { getWebSafeColors, WEB_SAFE_COLORS } from "./fixture";
import {
  Gradient,
  Invalid,
  Invisible,
  Point,
  Preset,
  RGBA,
  Transparent,
} from "./types";

export const rgba = (r: number, g: number, b: number, a: number): RGBA => {
  return { r, g, b, a };
};

export const rgb = (r: number, g: number, b: number): RGBA => {
  return rgba(r, g, b, 1);
};

export const toRGBAString = (color: RGBA) => {
  return `rgba(${color.r},${color.g},${color.b},${color.a})`;
};

export const toHex = (color: RGBA) => {
  let r = color.r.toString(16).padStart(2, "0");
  let g = color.g.toString(16).padStart(2, "0");
  let b = color.b.toString(16).padStart(2, "0");
  let a = Math.round(color.a * 255)
    .toString(16)
    .padStart(2, "0");
  return `#${r}${g}${b}${a}`;
};

export const isValidColor = (color: RGBA | Invalid): boolean => {
  return color.r > -1 && color.g > -1 && color.b > -1 && color.a > -1;
};

export const isBlackOpaque = (color: RGBA): boolean => {
  return color.r === 0 && color.g === 0 && color.b === 0 && color.a === 1;
};

export const hexToRGBA = (hexInput: string): RGBA | Invalid => {
  const hexWithoutHash = hexInput.slice(1, hexInput.length);
  const parse = (hex: string): number => parseInt(hex.padStart(2, hex), 16);
  let r;
  let g;
  let b;
  let a;
  switch (hexWithoutHash.length) {
    case 3:
      [r, g, b] = Array.prototype.map.call(hexWithoutHash, parse) as number[];
      return rgb(r, g, b);
    case 6:
      [r, g, b] = [0, 2, 4]
        .map((index) => hexWithoutHash.slice(index, index + 2))
        .map(parse) as number[];
      return rgb(r, g, b);
    case 8:
      [r, g, b, a] = [0, 2, 4, 6]
        .map((index) => hexWithoutHash.slice(index, index + 2))
        .map(parse) as number[];
      return rgba(r, g, b, a / 255);
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

export const diffColor = (a: RGBA, b: RGBA) => {
  return Math.sqrt(
    Math.pow(a.r - b.r, 2) + Math.pow(a.g - b.g, 2) + Math.pow(a.b - b.b, 2)
  );
};

export const addColorToLocalStorage = (
  localStorageKey: string,
  color: RGBA
) => {
  let preset = getColorsFromLocalStorage(localStorageKey);
  const hex = toHex(color);
  const existingIndex = preset.indexOf(hex);
  if (existingIndex !== -1) {
    preset = preset.filter((color: string) => color !== hex);
  }
  preset = [hex, ...preset];
  localStorage.setItem(localStorageKey, JSON.stringify(preset));
};

export const getColorsFromLocalStorage = (localStorageKey: string) => {
  let preset: string[] = [];
  const valueInLocalStorage = localStorage.getItem(localStorageKey);
  if (valueInLocalStorage) {
    try {
      preset = JSON.parse(valueInLocalStorage);
    } catch (e) {}
  }
  return preset;
};

export const Red = rgb(255, 0, 0);
export const Yellow = rgb(255, 255, 0);
export const Green = rgb(0, 255, 0);
export const Aqua = rgb(0, 255, 255);
export const Cyan = Aqua;
export const Blue = rgb(0, 0, 255);
export const Magenta = rgb(255, 0, 255);
export const Fuchsia = Magenta;
export const Black = rgb(0, 0, 0);
export const White = rgb(255, 255, 255);
export const WhiteOpaque = rgba(255, 255, 255, 1);
export const WhiteTransparent = rgba(255, 255, 255, 0);
export const BlackOpaque = rgba(0, 0, 0, 1);
export const BlackTransparent = rgba(0, 0, 0, 0);

export const HexInput: FC<{
  color: RGBA;
  onChange: (color: RGBA) => void;
}> = ({ color, onChange }) => {
  const [buffer, setBuffer] = useState("");
  return (
    <input
      type={"text"}
      style={{
        width: "6rem",
      }}
      onChange={(event: any) => {
        const textValue = event.target.value;
        const webSafeColors = getWebSafeColors();
        let color;

        if (webSafeColors.hasOwnProperty(textValue)) {
          color = hexToRGBA(webSafeColors[textValue]);
          console.log(color);
        } else {
          color = hexToRGBA(textValue);
        }

        if (isValidColor(color)) {
          onChange(color);
          setBuffer("");
        } else {
          setBuffer(textValue);
        }
      }}
      value={buffer || toHex(color)}
    />
  );
};

export const PresetSelection: FC<{
  currentPreset: Preset;
  presets: Preset[];
  onSelect: (presetKey: string) => void;
}> = ({ currentPreset, presets, onSelect }) => {
  return (
    <select
      value={currentPreset.key}
      onChange={(event) => onSelect(event.target.value)}
    >
      {presets.map((preset) => (
        <option value={preset.key} key={preset.key}>
          {preset.label}
        </option>
      ))}
    </select>
  );
};

export const GradientCanvas: FC<{
  currentColor: RGBA;
  reflectedColor?: RGBA | null;
  background: RGBA;
  width: number;
  height: number;
  gradients: Gradient[];
  pickerBorderWidth: number;
  pickerSize: number;
  fixedVerticalPosition?: boolean;
  fixedHorizontalPosition?: boolean;
  initialPickerPosition?: Point;
  onChange?: (color: RGBA) => void;
  onSelect?: (color: RGBA) => void;
  onReflect?: (color?: RGBA) => void;
}> = ({
  currentColor,
  reflectedColor,
  background = WhiteTransparent,
  width,
  height,
  gradients,
  pickerBorderWidth,
  pickerSize,
  fixedVerticalPosition = false,
  fixedHorizontalPosition = false,
  initialPickerPosition = { x: -1, y: -1 },
  onChange = () => {},
  onSelect = () => {},
  onReflect = () => {},
}) => {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const [pickerPosition, setPickerPosition] = useState<Point | Invisible>(
    initialPickerPosition
  );
  const drawGradients = () => {
    if (!canvas.current) return;
    const context = canvas.current.getContext("2d");
    if (!context) return;
    context.fillStyle = toHex(background);
    context.fillRect(0, 0, width, height);
    gradients.forEach((gradient) => {
      let gradientVectors: [x0: number, y0: number, x1: number, y1: number];

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

      gradient.colors.forEach((color: RGBA, index: number) => {
        linearGradient.addColorStop(
          index * (1 / (gradient.colors.length - 1)),
          toRGBAString(color)
        );
      });

      context.fillStyle = linearGradient;
      context.fillRect(0, 0, width, height);
    });
  };
  useEffect(() => {
    if (reflectedColor) {
      const position = findColorOnCanvas(reflectedColor);
      if (position) {
        onReflect(pickColorFromCanvas(position));
      }
    }
  }, [reflectedColor]);
  const setPickerPositionPageCoordinates = (position: Point) => {
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
  const onMouseMove = (event: any) => {
    if (event.buttons === 0) return;
    const position = setPickerPositionPageCoordinates({
      x: event.clientX,
      y: event.clientY,
    });
    const color = pickColorFromCanvas(position);
    if (color) {
      onChange(color);
    }
  };
  const onMouseDown = (event: any) => {
    if (event.buttons === 0) return;
    setPickerPositionPageCoordinates({ x: event.clientX, y: event.clientY });
  };
  const onTouchDown = (event: any) => {
    if (event.touches === 0) return;
    const [position] = event.touches;
    setPickerPositionPageCoordinates({
      x: position.clientX,
      y: position.clientY,
    });
  };
  const onTouchMove = (event: any) => {
    if (event.touches === 0) return;
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
  const pickColorFromCanvas = (position: Point) => {
    if (!canvas.current) return;
    const context = canvas.current.getContext("2d");
    if (!context) return;
    const colorData = context.getImageData(position.x, position.y, 1, 1).data!;
    const r = colorData[0];
    const g = colorData[1];
    const b = colorData[2];
    return rgb(r, g, b);
  };
  const findColorOnCanvas = (color: RGBA) => {
    if (!canvas.current) return;
    const context = canvas.current.getContext("2d");
    if (!context) return;

    const boundingBox = canvas.current.getBoundingClientRect();
    const distanceMap: Map<number, Point> = new Map();
    for (let x = 0; x < boundingBox.width; x += 1) {
      const colorData = context.getImageData(x, 0, 1, 1).data!;
      const r = colorData[0];
      const g = colorData[1];
      const b = colorData[2];
      distanceMap.set(diffColor(color, rgb(r, g, b)), { x, y: 0 });
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
  useEffect(drawGradients, [background]);
  useEffect(() => {
    findColorOnCanvas(currentColor);
  }, []);
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
      }}
    >
      <div
        style={{
          top: pickerPosition.y - pickerSize / 2 - pickerBorderWidth,
          left: Math.max(
            Math.min(pickerPosition.x, width - pickerSize * 2 - 2),
            2
          ),
          width: pickerSize,
          height: pickerSize,
          position: "absolute",
          border: `${pickerBorderWidth}px solid white`,
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      ></div>
      <canvas
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchMove={onTouchMove}
        onTouchStart={onTouchDown}
        onTouchEnd={onTouchEnd}
        ref={canvas}
        width={width}
        height={height}
      ></canvas>
    </div>
  );
};

export const PresetColor: FC<{
  color: RGBA;
  size: number;
  onClick: () => void;
}> = ({ color, size, onClick }) => {
  return (
    <span
      onClick={onClick}
      style={{
        width: size,
        cursor: "pointer",
        height: size,
        background: toRGBAString(color),
      }}
    ></span>
  );
};

export const PresetGrid: FC<{
  preset: Preset;
  visibilePresetColors: number;
  presetItemSize: number;
  onSelect: (color: RGBA) => void;
  localStorageKey: string;
}> = ({
  preset,
  visibilePresetColors,
  presetItemSize,
  onSelect,
  localStorageKey,
}) => {
  let colors: RGBA[];
  if (preset.keepHistory) {
    colors = getColorsFromLocalStorage(localStorageKey).map(hexToRGBA);
  } else {
    colors = preset.colors;
  }
  colors = colors.concat(Array(visibilePresetColors).fill(White));
  colors = colors.slice(0, visibilePresetColors);

  return (
    <div
      style={{
        display: "flex",
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      {colors.map((color, index) => (
        <PresetColor
          onClick={() => onSelect(color)}
          size={presetItemSize}
          key={index}
          color={color}
        />
      ))}
    </div>
  );
};

export const ColorPicker: FC<{
  color: RGBA;
  hueGradientWidth: number;
  hueGradientHeight: number;
  shadeGradientWidth: number;
  shadeGradientHeight: number;
  showAlphaChannel: boolean;
  presets: Preset[];
  visibilePresetColors: number;
  presetItemSize: number;
  onChange: (color: RGBA | Transparent) => void;
  defaultPresetIndex: number;
  localStorageKey: string;
  pickerSize: number;
  pickerBorderWidth: number;
}> = ({
  color = { r: 0, g: 255, b: 0, a: 1 },
  hueGradientWidth = 320,
  hueGradientHeight = 30,
  shadeGradientWidth = 320,
  shadeGradientHeight = 200,
  visibilePresetColors = 40,
  presetItemSize = 14,
  onChange,
  pickerSize = 10,
  pickerBorderWidth = 3,
  localStorageKey = "color-picker-with-presets",
  defaultPresetIndex = 0,
  presets = [
    {
      key: "last-used-colors",
      label: "Last used colors",
      colors: [Black, White, Yellow],
      keepHistory: true,
    },
    {
      key: "basic-colors",
      label: "Basic colors",
      colors: [Red, Yellow, Green, Aqua, Blue, Fuchsia, Black, White],
      keepHistory: false,
    },
    {
      key: "web-safe-colors",
      label: "Web safe colors",
      colors: Object.values(WEB_SAFE_COLORS).map(hexToRGBA),
      keepHistory: false,
    },
  ],
}) => {
  const [hue, setHue] = useState<RGBA>(color);
  const [currentPreset, setCurrentPreset] = useState<Preset>(
    presets[defaultPresetIndex]
  );
  const [reflectedColor, setReflectedColor] = useState<RGBA>(color);
  useEffect(() => {
    addColorToLocalStorage(localStorageKey, color);
  }, [color]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 5,
        width: Math.max(hueGradientWidth, shadeGradientWidth),
      }}
    >
      <GradientCanvas
        onReflect={(color) => {
          if (color && !isBlackOpaque(color)) {
            setReflectedColor(color);
          }
        }}
        reflectedColor={color}
        background={WhiteTransparent}
        currentColor={hue}
        width={hueGradientWidth}
        height={hueGradientHeight}
        fixedVerticalPosition={true}
        pickerBorderWidth={pickerBorderWidth}
        pickerSize={pickerSize}
        initialPickerPosition={{
          x: hueGradientWidth / 2 - pickerSize / 2,
          y: hueGradientHeight / 2,
        }}
        onChange={(color) => {
          setHue(color);
          setReflectedColor(color);
        }}
        gradients={[
          {
            direction: "to-right",
            colors: [Red, Yellow, Green, Aqua, Blue, Magenta],
          },
        ]}
      />
      <GradientCanvas
        pickerSize={pickerSize}
        pickerBorderWidth={pickerBorderWidth}
        background={reflectedColor}
        currentColor={color}
        width={shadeGradientWidth}
        height={shadeGradientHeight}
        onSelect={onChange}
        initialPickerPosition={{ x: shadeGradientWidth - 5, y: pickerSize + 4 }}
        gradients={[
          { direction: "to-right", colors: [WhiteOpaque, WhiteTransparent] },
          { direction: "to-bottom", colors: [BlackTransparent, BlackOpaque] },
        ]}
      />
      <div
        style={{
          display: "flex",
          gap: 5,
          justifyContent: "space-between",
        }}
      >
        <PresetSelection
          onSelect={(presetKey: string) =>
            setCurrentPreset(
              presets.find((preset) => preset.key === presetKey)!
            )
          }
          presets={presets}
          currentPreset={currentPreset}
        />
        <HexInput color={color} onChange={onChange} />
      </div>
      <PresetGrid
        presetItemSize={presetItemSize}
        visibilePresetColors={visibilePresetColors}
        preset={currentPreset}
        onSelect={onChange}
        localStorageKey={localStorageKey}
      />
    </div>
  );
};
