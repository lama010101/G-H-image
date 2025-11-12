import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

const INITIAL_DATE_RANGE_START = 1577836800000; // 1 Jan 2020
const createDefaultDateRange = (): [number, number] => [INITIAL_DATE_RANGE_START, Date.now()];
const createDefaultPeopleRange = (): [number, number] => [0, 100];
const createDefaultConfidenceRange = (): [number, number] => [0, 100];

const areFiltersEqual = (a: FiltersState, b: FiltersState) => {
  const keys = new Set<keyof FiltersState>([
    ...(Object.keys(a) as (keyof FiltersState)[]),
    ...(Object.keys(b) as (keyof FiltersState)[]),
  ]);
  for (const key of keys) {
    const aValue = a[key];
    const bValue = b[key];
    const bothArrays = Array.isArray(aValue) && Array.isArray(bValue);
    if (bothArrays) {
      if (aValue.length !== bValue.length) return false;
      for (let i = 0; i < aValue.length; i += 1) {
        if (aValue[i] !== bValue[i]) return false;
      }
      continue;
    }
    if (aValue !== bValue) return false;
  }
  return true;
};

export interface FiltersState {
  theme?: string;
  location?: string;
  continent?: string;
  readyStatus?: 'all' | 'ready' | 'not_ready';
  celebrityOnly?: boolean;
  /** Date created range [from, to] (timestamps in ms) */
  dateCreatedRange?: [number, number];
  /** Year range [min, max] */
  yearRange?: [number, number];
  /** Approximate number of people range [min, max] */
  numberPeopleRange?: [number, number];
  /** Confidence range [min, max] */
  confidenceRange?: [number, number];
  realEventStatus?: 'all' | 'true' | 'fictional';
  hasFullHints?: boolean;
  imageStatus?: 'all' | 'with_image' | 'missing_image';
  usedStatus?: 'all' | 'used' | 'unused' | 'failed';
  zeroCostOnly?: boolean;
}

interface FiltersPanelProps {
  state: FiltersState;
  onApply: (newState: FiltersState) => void;
  onClear?: () => void;
  themeOptions?: string[];
  locationOptions?: string[];
  continentOptions?: string[];
  yearBounds?: { minYear: number; maxYear: number } | null;
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({
  state,
  onApply,
  onClear,
  themeOptions = [],
  locationOptions = [],
  continentOptions = [],
  yearBounds = null,
}) => {
  const ALL_VALUE = "__ALL__";
  const fallbackMinYear = 1900;
  const currentYear = React.useMemo(() => new Date().getFullYear(), []);
  const rawYearMin = yearBounds?.minYear ?? fallbackMinYear;
  const rawYearMax = yearBounds?.maxYear ?? currentYear;
  const yearMin = Math.min(rawYearMin, rawYearMax);
  const yearMax = Math.max(rawYearMin, rawYearMax);
  const defaultYearRange = React.useMemo<[number, number]>(
    () => [yearMin, yearMax],
    [yearMin, yearMax]
  );

  const [draft, setDraft] = React.useState<FiltersState>(state);

  React.useEffect(() => {
    setDraft(state);
  }, [state]);

  const updateDraft = React.useCallback((partial: Partial<FiltersState>) => {
    setDraft((prev) => {
      const next: FiltersState = { ...prev, ...partial };
      Object.entries(partial).forEach(([key, value]) => {
        if (value === undefined) {
          delete next[key as keyof FiltersState];
        }
      });
      return next;
    });
  }, []);

  // Local slider states to avoid spamming queries while dragging
  const [localDateRange, setLocalDateRange] = React.useState<[number, number]>(
    () => draft.dateCreatedRange ?? createDefaultDateRange()
  );
  const [localYearRange, setLocalYearRange] = React.useState<[number, number]>(
    () => draft.yearRange ?? defaultYearRange
  );
  const [yearInputValues, setYearInputValues] = React.useState<[string, string]>(
    () => [String((draft.yearRange ?? defaultYearRange)[0]), String((draft.yearRange ?? defaultYearRange)[1])]
  );
  const [localPeopleRange, setLocalPeopleRange] = React.useState<[number, number]>(
    () => draft.numberPeopleRange ?? createDefaultPeopleRange()
  );
  const [localConfidenceRange, setLocalConfidenceRange] = React.useState<[number, number]>(
    () => draft.confidenceRange ?? createDefaultConfidenceRange()
  );

  // Sync local states if external state changes elsewhere
  React.useEffect(() => {
    if (draft.dateCreatedRange) setLocalDateRange(draft.dateCreatedRange);
    else setLocalDateRange(createDefaultDateRange());
  }, [draft.dateCreatedRange]);
  React.useEffect(() => {
    if (draft.yearRange) {
      const [minYear, maxYear] = draft.yearRange;
      const clamped: [number, number] = [
        Math.max(yearMin, Math.min(yearMax, minYear)),
        Math.max(yearMin, Math.min(yearMax, maxYear))
      ];
      const sorted: [number, number] =
        clamped[0] <= clamped[1] ? clamped : [clamped[1], clamped[0]];
      setLocalYearRange(sorted);
      setYearInputValues([String(sorted[0]), String(sorted[1])]);
    } else {
      setLocalYearRange(defaultYearRange);
      setYearInputValues([String(defaultYearRange[0]), String(defaultYearRange[1])]);
    }
  }, [draft.yearRange, defaultYearRange, yearMin, yearMax]);
  React.useEffect(() => {
    if (draft.numberPeopleRange) setLocalPeopleRange(draft.numberPeopleRange);
    else setLocalPeopleRange(createDefaultPeopleRange());
  }, [draft.numberPeopleRange]);
  React.useEffect(() => {
    if (draft.confidenceRange) setLocalConfidenceRange(draft.confidenceRange);
    else setLocalConfidenceRange(createDefaultConfidenceRange());
  }, [draft.confidenceRange]);

  React.useEffect(() => {
    setYearInputValues([String(localYearRange[0]), String(localYearRange[1])]);
  }, [localYearRange]);

  const handleYearInputChange = (index: 0 | 1) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    setYearInputValues((prev) => {
      const next = [...prev] as [string, string];
      next[index] = rawValue;
      return next;
    });

    if (rawValue === "") {
      return;
    }

    const parsed = Number.parseInt(rawValue, 10);
    if (Number.isNaN(parsed)) {
      return;
    }

    const clamped = Math.max(yearMin, Math.min(yearMax, parsed));
    setLocalYearRange((prev) => {
      const nextRange: [number, number] = [...prev] as [number, number];
      nextRange[index] = clamped;
      if (index === 0 && clamped > nextRange[1]) {
        nextRange[1] = clamped;
      } else if (index === 1 && clamped < nextRange[0]) {
        nextRange[0] = clamped;
      }
      const sorted: [number, number] = nextRange[0] <= nextRange[1]
        ? nextRange
        : [nextRange[1], nextRange[0]];
      setYearInputValues([String(sorted[0]), String(sorted[1])]);
      updateDraft({ yearRange: sorted });
      return sorted;
    });
  };

  // Control the accordion to keep it open across re-renders (collapsed by default)
  const [accordionValue, setAccordionValue] = React.useState<string>('');
  const hasChanges = React.useMemo(() => !areFiltersEqual(draft, state), [draft, state]);
  const activeFilterTags = React.useMemo(() => {
    const tags: string[] = [];

    if (state.readyStatus === 'ready') tags.push('Ready');
    if (state.readyStatus === 'not_ready') tags.push('Not Ready');

    if (state.zeroCostOnly) tags.push('Zero Cost');

    if (state.usedStatus === 'used') tags.push('Used');
    if (state.usedStatus === 'unused') tags.push('Not Used');
    if (state.usedStatus === 'failed') tags.push('Failed Generation');

    if (state.imageStatus === 'with_image') tags.push('Has Image');
    if (state.imageStatus === 'missing_image') tags.push('No Image');

    if (state.realEventStatus === 'true') tags.push('True Event');
    if (state.realEventStatus === 'fictional') tags.push('Fictional Event');

    if (state.hasFullHints) tags.push('Full Hints');
    if (state.celebrityOnly) tags.push('Celebrity Only');

    if (state.theme) tags.push(state.theme);
    if (state.location) tags.push(state.location);
    if (state.continent) tags.push(state.continent);

    if (state.yearRange) {
      const [fromYear, toYear] = state.yearRange;
      tags.push(`Year: ${fromYear}${fromYear !== toYear ? `-${toYear}` : ''}`);
    }

    if (state.dateCreatedRange) {
      const [fromDate, toDate] = state.dateCreatedRange;
      tags.push(
        `Created: ${new Date(fromDate).toLocaleDateString()} - ${new Date(toDate).toLocaleDateString()}`
      );
    }

    if (state.numberPeopleRange) {
      const [minPeople, maxPeople] = state.numberPeopleRange;
      tags.push(`People: ${minPeople}${minPeople !== maxPeople ? `-${maxPeople}` : ''}`);
    }

    if (state.confidenceRange) {
      const [minConfidence, maxConfidence] = state.confidenceRange;
      tags.push(
        `Confidence: ${minConfidence}%${minConfidence !== maxConfidence ? `-${maxConfidence}%` : ''}`
      );
    }

    return tags;
  }, [state]);

  const handleApply = React.useCallback(() => {
    const nextFilters: FiltersState = { ...draft };
    onApply(nextFilters);
  }, [draft, onApply]);

  const handleClear = React.useCallback(() => {
    setDraft({});
    setLocalDateRange(createDefaultDateRange());
    setLocalYearRange(defaultYearRange);
    setYearInputValues([String(defaultYearRange[0]), String(defaultYearRange[1])]);
    setLocalPeopleRange(createDefaultPeopleRange());
    setLocalConfidenceRange(createDefaultConfidenceRange());
    onClear?.();
  }, [defaultYearRange, onClear]);

  return (
    <Card className="mb-6 flex w-full max-w-sm flex-col overflow-hidden md:max-h-[calc(100vh-5rem)]">
      <CardHeader className="flex-1 overflow-y-auto p-0">
        <Accordion
          type="single"
          collapsible
          value={accordionValue}
          onValueChange={(val) => setAccordionValue(val ?? '')}
        >
          <AccordionItem value="filters" className="border-0">
            <AccordionTrigger className="px-4">
              <div className="flex w-full flex-wrap items-center gap-2 text-left">
                <span className="text-base font-medium">Filters</span>
                {activeFilterTags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1">
                    {activeFilterTags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-[10px] uppercase tracking-wide">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-24">
              {/* Ready Status Filter (for images) */}
              <div className="mb-4">
                <Label className="mb-2 block text-sm font-medium">Ready</Label>
                <RadioGroup
                  value={draft.readyStatus ?? 'all'}
                  onValueChange={(val) => updateDraft({ readyStatus: val as 'all' | 'ready' | 'not_ready' })}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="ready-all" />
                    <Label htmlFor="ready-all">All</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ready" id="ready-true" />
                    <Label htmlFor="ready-true">Ready</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="not_ready" id="ready-false" />
                    <Label htmlFor="ready-false">Not Ready</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between mb-4">
                <Label className="text-sm">Zero Cost Only</Label>
                <Switch
                  checked={!!draft.zeroCostOnly}
                  onCheckedChange={(checked) => updateDraft({ zeroCostOnly: checked ? true : undefined })}
                />
              </div>

              {/* Used Status Filter (for prompts) */}
              <div className="mb-4">
                <Label className="mb-2 block text-sm font-medium">Used</Label>
                <RadioGroup
                  value={draft.usedStatus ?? 'all'}
                  onValueChange={(val) => updateDraft({ usedStatus: val as 'all' | 'used' | 'unused' | 'failed' })}
                  className="flex space-x-4 flex-wrap gap-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="used-all" />
                    <Label htmlFor="used-all">All</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="used" id="used-true" />
                    <Label htmlFor="used-true">Used</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unused" id="used-false" />
                    <Label htmlFor="used-false">Not Used</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="failed" id="used-failed" />
                    <Label htmlFor="used-failed">Failed Generation</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="mb-4">
                <Label className="mb-1 block text-sm font-medium">Filter by Location</Label>
                <Select
                  value={draft.location ?? ALL_VALUE}
                  onValueChange={(val) => updateDraft({ location: val === ALL_VALUE ? undefined : val })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select location..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_VALUE}>All</SelectItem>
                    {locationOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-4">
                <Label className="mb-1 block text-sm font-medium">Filter by Continent</Label>
                <Select
                  value={draft.continent ?? ALL_VALUE}
                  onValueChange={(val) => updateDraft({ continent: val === ALL_VALUE ? undefined : val })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select continent..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_VALUE}>All</SelectItem>
                    {continentOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Year Range */}
              <div className="mb-4">
                <Label className="mb-2 block text-sm font-medium">Year Range</Label>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{yearMin}</span>
                  <span>{yearMax}</span>
                </div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span>
                    {localYearRange
                      ? `${localYearRange[0]} - ${localYearRange[1]}`
                      : `${yearMin} - ${yearMax}`}
                  </span>
                </div>
                <div className="flex gap-2 mb-2">
                  <Input
                    type="number"
                    min={yearMin}
                    max={yearMax}
                    value={yearInputValues[0]}
                    onChange={handleYearInputChange(0)}
                    className="h-8"
                  />
                  <Input
                    type="number"
                    min={yearMin}
                    max={yearMax}
                    value={yearInputValues[1]}
                    onChange={handleYearInputChange(1)}
                    className="h-8"
                  />
                </div>
                <Slider
                  min={yearMin}
                  max={yearMax}
                  step={1}
                  value={localYearRange}
                  onValueChange={(val) => {
                    const next = val as [number, number];
                    setLocalYearRange(next);
                    setYearInputValues([String(next[0]), String(next[1])]);
                  }}
                  onValueCommit={(val) => {
                    const [minYear, maxYear] = val as [number, number];
                    const clamped: [number, number] = [
                      Math.max(yearMin, Math.min(yearMax, minYear)),
                      Math.max(yearMin, Math.min(yearMax, maxYear))
                    ];
                    const sorted: [number, number] =
                      clamped[0] <= clamped[1] ? clamped : [clamped[1], clamped[0]];
                    updateDraft({ yearRange: sorted });
                    setYearInputValues([String(sorted[0]), String(sorted[1])]);
                  }}
                  disabled={yearMin === yearMax}
                />
              </div>

              {/* Celebrity Only */}
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  id="celebrity-only"
                  checked={!!draft.celebrityOnly}
                  onCheckedChange={(checked) => updateDraft({ celebrityOnly: checked ? true : undefined })}
                />
                <Label htmlFor="celebrity-only" className="text-sm">
                  Celebrity Only
                </Label>
              </div>

              {/* Date Created Range */}
              <div className="mb-6">
                <Label className="mb-2 block text-sm font-medium">Date Created Range</Label>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>1/1/2020</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span>
                    {localDateRange
                      ? `${new Date(localDateRange[0]).toLocaleDateString()} - ${new Date(localDateRange[1]).toLocaleDateString()}`
                      : `${new Date(1577836800000).toLocaleDateString()} - ${new Date(Date.now()).toLocaleDateString()}`}
                  </span>
                </div>
                <Slider
                  min={1577836800000} // 1 Jan 2020
                  max={Date.now()}
                  step={24 * 60 * 60 * 1000}
                  value={localDateRange}
                  onValueChange={(val) => setLocalDateRange(val as [number, number])}
                  onValueCommit={(val) => updateDraft({ dateCreatedRange: val as [number, number] })}
                />
              </div>

              {/* Number of People Range */}
              <div className="mb-4">
                <Label className="mb-2 block text-sm font-medium">Number of People</Label>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span>
                    {localPeopleRange
                      ? `${localPeopleRange[0]} - ${localPeopleRange[1]}`
                      : `0 - 100`}
                  </span>
                </div>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={localPeopleRange}
                  onValueChange={(val) => setLocalPeopleRange(val as [number, number])}
                  onValueCommit={(val) => {
                    const clamped: [number, number] = [
                      Math.max(0, Math.min(100, val[0] as number)),
                      Math.max(0, Math.min(100, val[1] as number))
                    ];
                    updateDraft({ numberPeopleRange: clamped });
                  }}
                />
              </div>

              {/* Confidence Level (range) */}
              <div className="mb-6">
                <Label className="mb-2 block text-sm font-medium">Confidence Level</Label>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>0%</span>
                  <span>100%</span>
                </div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span>
                    {localConfidenceRange
                      ? `${localConfidenceRange[0]}% - ${localConfidenceRange[1]}%`
                      : `0% - 100%`}
                  </span>
                </div>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={localConfidenceRange}
                  onValueChange={(val) => setLocalConfidenceRange(val as [number, number])}
                  onValueCommit={(val) => updateDraft({ confidenceRange: val as [number, number] })}
                />
              </div>

              {/* True Event tri-state */}
              <div className="mb-4">
                <Label className="mb-2 block text-sm font-medium">True Event</Label>
                <RadioGroup
                  value={draft.realEventStatus ?? 'all'}
                  onValueChange={(val) => updateDraft({ realEventStatus: val as 'all' | 'true' | 'fictional' })}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="real-all" />
                    <Label htmlFor="real-all">All</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="real-true" />
                    <Label htmlFor="real-true">True</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fictional" id="real-fictional" />
                    <Label htmlFor="real-fictional">Fictional</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Has Full Hints toggle */}
              <div className="flex items-center justify-between mb-6">
                <Label className="text-sm">Has Full Hints</Label>

                <Switch
                  checked={!!draft.hasFullHints}
                  onCheckedChange={(checked) => updateDraft({ hasFullHints: checked ? true : undefined })}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardHeader>
      <CardContent className="sticky bottom-0 z-10 border-t border-border bg-card/95 p-4 pt-4 backdrop-blur supports-[backdrop-filter]:bg-card/75">
        <div className="flex flex-col gap-2">
          <Button
            className="w-full bg-emerald-500 text-white hover:bg-emerald-600 focus-visible:ring-emerald-600 disabled:bg-emerald-500 disabled:text-white disabled:opacity-60"
            onClick={handleApply}
            disabled={!hasChanges}
          >
            Apply Filters
          </Button>
          {onClear && (
            <Button
              className="w-full bg-orange-500 text-white hover:bg-orange-600 focus-visible:ring-orange-600"
              onClick={handleClear}
            >
              Clear All Filters
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FiltersPanel;
