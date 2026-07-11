# Domain Select-Search Field

API-backed searchable dropdown component for selecting related domain models (taxonomy lookups, company search, geo area search).

**Output file:** `app/domains/{domain-model}/{domain-model}-search-select-field.jsx` or `{domain-model}-select-field.jsx`

## Adapt for your resource

- Component name: `GeoAreaSearchSelectField` -> your `{DomainModel}SearchSelectField`
- API import: `sharedGeoAreasApi` -> your API module
- State variable: `geoAreas` -> your collection name (plural)
- Response key: `geoAreaApiResponse.geo_areas` -> your API response key
- Fetch params: `{ query: searchValue }` -> your API search params
- Option renderer: `GeoAreaOption` -> your option component (inline or imported)
- Props: Keep `name`, `label`, `placeholder`, `required`, `formText` as the standard interface

## Template — With imported option renderer

Use when the option display is complex (multiple lines, formatting):

```jsx
import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { sharedGeoAreasApi } from "@/api/shared/shared-geo-areas-api";
import { getApiErrorToastConfig } from "@/utils/error-utils";
import SelectSearchField from "@/components/forms/select-search-field";
import GeoAreaOption from "@/domains/geo-area/geo-area-option";

const GeoAreaSearchSelectField = ({
  name,
  label,
  placeholder = "",
  required = true,
  formText = "",
  isLeaf = true,
  adminLevel,
}) => {
  const [geoAreas, setGeoAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const fetchGeoAreas = useCallback(
    async (geoAreaInputValue = "") => {
      try {
        setIsLoading(true);
        const geoAreaApiResponse = await sharedGeoAreasApi.index({
          query: geoAreaInputValue,
          is_leaf: isLeaf,
          admin_level: adminLevel,
        });
        setGeoAreas(geoAreaApiResponse.geo_areas);
      } catch (error) {
        const toastConfig = getApiErrorToastConfig(error);
        showToast(toastConfig);
        setGeoAreas([]);
      } finally {
        setIsLoading(false);
      }
    },
    [showToast, isLeaf, adminLevel],
  );

  // Initial fetch on mount
  useEffect(() => {
    fetchGeoAreas();
  }, [fetchGeoAreas]);

  const handleGeoAreaSearchChange = (geoAreaSearchValue) => {
    fetchGeoAreas(geoAreaSearchValue);
  };

  return (
    <SelectSearchField
      name={name}
      label={label}
      required={required}
      placeholder={placeholder}
      options={geoAreas}
      optionRender={GeoAreaOption}
      onSearchChange={handleGeoAreaSearchChange}
      isOptionsLoading={isLoading}
      formText={formText}
    />
  );
};

export default GeoAreaSearchSelectField;
```

## Template — With inline option renderer

Use when the option display is simple (just the name):

```jsx
import { useCallback, useEffect, useState } from "react";
import SelectSearchField from "@/components/forms/select-search-field";
import { useToast } from "@/hooks/use-toast";
import { getApiErrorToastConfig } from "@/utils/error-utils";
import { taxonomyCategoriesApi } from "@/api/shared/taxonomy-categories-api";

// Named as a render function (camelCase), not a component (PascalCase)
// — it is passed as a prop, not used as JSX
const renderTaxonomyCategoryOption = (taxonomyCategory) => (
  <>{taxonomyCategory.name}</>
);

const TaxonomyCategorySelectField = ({
  name,
  label,
  placeholder = "",
  required = true,
  formText = "",
}) => {
  const [taxonomyCategories, setTaxonomyCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  const fetchTaxonomyCategories = useCallback(
    async (searchValue = "") => {
      try {
        setIsLoading(true);
        const jobCategoriesResponse = await taxonomyCategoriesApi.index({
          name: searchValue,
        });
        setTaxonomyCategories(jobCategoriesResponse.taxonomy_categories || []);
      } catch (error) {
        const toastConfig = getApiErrorToastConfig(error);
        showToast(toastConfig);
        setTaxonomyCategories([]);
      } finally {
        setIsLoading(false);
      }
    },
    [showToast],
  );

  useEffect(() => {
    fetchTaxonomyCategories();
  }, [fetchTaxonomyCategories]);

  const handleSearchChange = (searchValue) => {
    fetchTaxonomyCategories(searchValue);
  };

  return (
    <SelectSearchField
      name={name}
      label={label}
      required={required}
      placeholder={placeholder}
      options={taxonomyCategories}
      optionRender={renderTaxonomyCategoryOption}
      onSearchChange={handleSearchChange}
      isOptionsLoading={isLoading}
      formText={formText}
    />
  );
};

export default TaxonomyCategorySelectField;
```

## Option renderer pattern

Option renderers are camelCase `render*` functions, NOT PascalCase React components — they are passed as props, not used in JSX. When the display is complex, export from a separate file:

**File:** `app/domains/{domain-model}/{domain-model}-option.jsx`

```jsx
const formatGeoAreaPath = (geoAreaPath) => {
  if (!geoAreaPath) return "";

  const geoAreaSegments = geoAreaPath.split(".");
  const relevantSegments =
    geoAreaSegments.length > 1 ? geoAreaSegments.slice(1, 3) : geoAreaSegments;

  return relevantSegments
    .map((geoAreaSegment) =>
      geoAreaSegment
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    )
    .join(" > ");
};

const renderGeoAreaOption = (geoArea) => (
  <>
    <div className="text-muted small">{formatGeoAreaPath(geoArea.path)}</div>
    <div>{geoArea.name}</div>
  </>
);

export default renderGeoAreaOption;
```
