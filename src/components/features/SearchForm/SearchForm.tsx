import React, { useState, useCallback } from 'react';
import { Combobox } from '../../composed/Combobox/Combobox';
import type { ComboboxOption } from '../../composed/Combobox/Combobox';
import { Button } from '../../primitives/Button/Button';
import { useCountries, useGeoSearch } from '../../../hooks/useGeo';
import type { GeoEntity, SelectedDestination } from '../../../models/types';
import styles from './SearchForm.module.css';

const GEO_ICONS: Record<string, string> = {
  country: '🌍',
  city: '🏙',
  hotel: '🏨',
};

const GEO_META: Record<string, string> = {
  country: 'Країна',
  city: 'Місто',
  hotel: 'Готель',
};

function geoToOption(entity: GeoEntity): ComboboxOption {
  return {
    id: entity.id,
    label: entity.name,
    icon: GEO_ICONS[entity.type],
    meta: GEO_META[entity.type],
  };
}

interface SearchFormProps {
  onSearch: (destination: SelectedDestination) => void;
  loading: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, loading }) => {
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<SelectedDestination | null>(null);

  const { countries, load: loadCountries } = useCountries();
  const isTyping = inputValue.length >= 2;
  const geoResults = useGeoSearch(inputValue, isTyping && open);

  const countryOptions: ComboboxOption[] = Object.values(countries).map((c) => ({
    id: c.id,
    label: c.name,
    icon: GEO_ICONS.country,
    meta: GEO_META.country,
  }));

  const geoOptions: ComboboxOption[] = Object.values(geoResults).map((e) =>
    geoToOption(e)
  );

  const options = isTyping ? geoOptions : countryOptions;

  const handleOpen = useCallback(() => {
    if (!selected || selected.type === 'country') {
      loadCountries();
    }
    setOpen(true);
  }, [selected, loadCountries]);

  const handleSelect = (option: ComboboxOption) => {
    const entity = isTyping
      ? Object.values(geoResults).find((e) => String(e.id) === String(option.id))
      : Object.values(countries).find((c) => String(c.id) === String(option.id));

    if (!entity) return;

    const destination: SelectedDestination = {
      id: entity.id,
      name: entity.name,
      type: (entity as GeoEntity).type ?? 'country',
      countryId:
        (entity as GeoEntity).type === 'country'
          ? String(entity.id)
          : (entity as any).countryId,
    };

    setSelected(destination);
    setInputValue(entity.name);
    setOpen(false);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (selected && value !== selected.name) {
      setSelected(null);
    }
    if (!open) setOpen(true);
  };

  const handleSubmit = () => {
    if (!selected) return;
    onSearch(selected);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <form className={styles.form} onKeyDown={handleKeyDown} onSubmit={(e) => e.preventDefault()}>
      <div className={styles.field}>
        <label className={styles.label}>Напрямок</label>
        <Combobox
          inputValue={inputValue}
          options={options}
          open={open}
          placeholder="Країна, місто або готель"
          onInputChange={handleInputChange}
          onSelect={handleSelect}
          onOpen={handleOpen}
          onClose={() => setOpen(false)}
        />
      </div>
      <Button
        type="button"
        disabled={!selected || loading}
        onClick={handleSubmit}
      >
        {loading ? 'Пошук...' : 'Знайти'}
      </Button>
    </form>
  );
};
