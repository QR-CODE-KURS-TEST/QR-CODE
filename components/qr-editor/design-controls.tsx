"use client";

import { useRef } from "react";
import { Upload, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ColorField } from "./color-field";
import {
  type QRDesign,
  type DotStyle,
  type CornerSquareStyle,
  type CornerDotStyle,
  DOT_STYLE_LABELS,
  CORNER_SQUARE_LABELS,
  CORNER_DOT_LABELS,
  QR_PRESETS,
  DEFAULT_DESIGN,
} from "@/lib/qr/types";

export function DesignControls({
  design,
  onChange,
}: {
  design: QRDesign;
  onChange: (patch: Partial<QRDesign>) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  function handleLogo(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      onChange({ logoDataUrl: reader.result as string });
    reader.readAsDataURL(file);
  }

  return (
    <Tabs defaultValue="stil" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="stil">Stil</TabsTrigger>
        <TabsTrigger value="farben">Farben</TabsTrigger>
        <TabsTrigger value="logo">Logo</TabsTrigger>
        <TabsTrigger value="rahmen">Rahmen</TabsTrigger>
      </TabsList>

      {/* STIL */}
      <TabsContent value="stil" className="grid gap-5 pt-4">
        <div className="grid gap-2">
          <Label className="text-xs text-muted-foreground">Vorlagen</Label>
          <div className="grid grid-cols-4 gap-2">
            {QR_PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => onChange(p.design)}
                className="rounded-lg border px-2 py-2 text-xs font-medium transition-colors hover:border-primary hover:bg-accent"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <StyleSelect
          label="Punkte-Stil"
          value={design.dotStyle}
          labels={DOT_STYLE_LABELS}
          onChange={(v) => onChange({ dotStyle: v as DotStyle })}
        />
        <div className="grid grid-cols-2 gap-3">
          <StyleSelect
            label="Ecken (außen)"
            value={design.cornerSquareStyle}
            labels={CORNER_SQUARE_LABELS}
            onChange={(v) =>
              onChange({ cornerSquareStyle: v as CornerSquareStyle })
            }
          />
          <StyleSelect
            label="Ecken (innen)"
            value={design.cornerDotStyle}
            labels={CORNER_DOT_LABELS}
            onChange={(v) => onChange({ cornerDotStyle: v as CornerDotStyle })}
          />
        </div>
      </TabsContent>

      {/* FARBEN */}
      <TabsContent value="farben" className="grid gap-5 pt-4">
        <div className="grid grid-cols-2 gap-3">
          <ColorField
            label="Vordergrund"
            value={design.fgColor}
            onChange={(v) => onChange({ fgColor: v })}
          />
          <ColorField
            label="Hintergrund"
            value={design.bgColor}
            onChange={(v) => onChange({ bgColor: v })}
          />
        </div>
        <ColorField
          label="Ecken-Farbe"
          value={design.cornerColor}
          onChange={(v) => onChange({ cornerColor: v })}
        />

        <div className="grid gap-3 rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Farbverlauf</Label>
            <Switch
              checked={design.gradient.enabled}
              onCheckedChange={(v) =>
                onChange({ gradient: { ...design.gradient, enabled: v } })
              }
            />
          </div>
          {design.gradient.enabled && (
            <div className="grid gap-3">
              <ColorField
                label="Zweite Farbe"
                value={design.gradient.color2}
                onChange={(v) =>
                  onChange({ gradient: { ...design.gradient, color2: v } })
                }
              />
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label className="text-xs text-muted-foreground">Typ</Label>
                  <Select
                    value={design.gradient.type}
                    onValueChange={(v) =>
                      v &&
                      onChange({
                        gradient: {
                          ...design.gradient,
                          type: v as "linear" | "radial",
                        },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linear">Linear</SelectItem>
                      <SelectItem value="radial">Radial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Winkel: {design.gradient.rotation}°
                  </Label>
                  <Slider
                    min={0}
                    max={360}
                    step={5}
                    value={[design.gradient.rotation]}
                    onValueChange={(val) =>
                      onChange({
                        gradient: {
                          ...design.gradient,
                          rotation: Array.isArray(val) ? val[0] : val,
                        },
                      })
                    }
                    className="mt-3"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </TabsContent>

      {/* LOGO */}
      <TabsContent value="logo" className="grid gap-4 pt-4">
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml,image/webp"
          className="hidden"
          onChange={(e) => handleLogo(e.target.files?.[0])}
        />
        {design.logoDataUrl ? (
          <div className="flex items-center gap-3 rounded-lg border p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={design.logoDataUrl}
              alt="Logo"
              className="size-12 rounded object-contain"
            />
            <div className="flex-1 text-sm text-muted-foreground">
              Logo hinzugefügt
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onChange({ logoDataUrl: null })}
            >
              <X className="size-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => fileRef.current?.click()}
            className="h-20 border-dashed"
          >
            <Upload className="size-4" />
            Logo hochladen
          </Button>
        )}

        {design.logoDataUrl && (
          <div className="grid gap-1.5">
            <Label className="text-xs text-muted-foreground">
              Logo-Größe: {Math.round(design.logoSizeRatio * 100)}%
            </Label>
            <Slider
              min={0.1}
              max={0.5}
              step={0.01}
              value={[design.logoSizeRatio]}
              onValueChange={(val) =>
                onChange({ logoSizeRatio: Array.isArray(val) ? val[0] : val })
              }
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground">
              Tipp: Bei Logo wird automatisch die höchste Fehlerkorrektur
              genutzt, damit der Code scanbar bleibt.
            </p>
          </div>
        )}
      </TabsContent>

      {/* RAHMEN */}
      <TabsContent value="rahmen" className="grid gap-4 pt-4">
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div>
            <Label className="text-sm">Rahmen mit Call-to-Action</Label>
            <p className="text-xs text-muted-foreground">
              Erhöht nachweislich die Scan-Rate.
            </p>
          </div>
          <Switch
            checked={design.frame.enabled}
            onCheckedChange={(v) =>
              onChange({ frame: { ...design.frame, enabled: v } })
            }
          />
        </div>
        {design.frame.enabled && (
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label className="text-xs text-muted-foreground">Text</Label>
              <Input
                value={design.frame.text}
                maxLength={24}
                onChange={(e) =>
                  onChange({ frame: { ...design.frame, text: e.target.value } })
                }
              />
            </div>
            <ColorField
              label="Rahmen-Farbe"
              value={design.frame.color}
              onChange={(v) =>
                onChange({ frame: { ...design.frame, color: v } })
              }
            />
          </div>
        )}
      </TabsContent>

      <div className="pt-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => onChange(DEFAULT_DESIGN)}
        >
          Zurücksetzen
        </Button>
      </div>
    </Tabs>
  );
}

function StyleSelect<T extends string>({
  label,
  value,
  labels,
  onChange,
}: {
  label: string;
  value: T;
  labels: Record<T, string>;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Select value={value} onValueChange={(v) => v && onChange(v)}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {(Object.entries(labels) as [string, string][]).map(([k, v]) => (
            <SelectItem key={k} value={k}>
              {v}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
