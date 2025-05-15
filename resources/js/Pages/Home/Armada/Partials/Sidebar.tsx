import { FC, useCallback, useEffect, useState, memo } from "react";
import { Form, FormFloating, Button, InputGroup } from "react-bootstrap";
import { router } from "@inertiajs/react";
import { CarModelEnum, CarTransmissionEnum, FuelEnum } from "@/Helpers/enum";
import { getCarFuelTypeLabel, getCarModelLabel, getCarTransmissionLabel } from "@/Helpers/EnumHelper";
import { useDebounce } from "@/Hooks/useDebounce";
import styled from "@emotion/styled";

export interface FilterState {
  model: string;
  year_from: string | number;
  year_to: string | number;
  fuel_type: string;
  transmission: string;
  status: string;
  condition: string;
  price_min: number;
  price_max: number;
  seats: string;
  search: string;
  [key: string]: string | number;
}

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

const SidebarStyled = styled.aside`
  position: sticky;
  top: 6rem;
`;

const FilterSection = styled.div`
  margin-bottom: 1.5rem;
`;

const FilterTitle = styled.h5`
  margin-bottom: 1rem;
  font-weight: 600;
`;

const FilterSidebar: FC<FilterSidebarProps> = ({ filters, setFilters }) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [activeFilters, setActiveFilters] = useState(0);

  const updateFilters = useCallback((newFilters: FilterState) => {
    const nonEmptyFilters = Object.entries(newFilters).reduce((acc, [key, value]) => {
      if (value !== "" && value !== 0 && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);

    router.get(route('armada.index'), nonEmptyFilters, {
      preserveState: true,
      replace: true,
      only: ['cars']
    });
  }, []);

  const debouncedUpdateFilters = useDebounce(updateFilters, 500);

  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;
    const updatedValue = type === 'number' ? (value ? parseInt(value) : 0) : value;

    const newFilters = {
      ...localFilters,
      [name]: updatedValue
    };

    setLocalFilters(newFilters);
    setFilters(newFilters);

    debouncedUpdateFilters(newFilters);
  }, [localFilters, setFilters, debouncedUpdateFilters]);

  const handleResetFilters = useCallback(() => {
    const emptyFilters = Object.keys(filters).reduce((acc, key) => {
      acc[key] = key.includes('price') ? 0 : '';
      return acc;
    }, {} as FilterState);

    setLocalFilters(emptyFilters);
    setFilters(emptyFilters);
    router.get(route('armada.index'), {}, { preserveState: true });
  }, [filters, setFilters]);

  useEffect(() => {
    const count = Object.entries(localFilters).reduce((acc, [key, value]) => {
      return value && key !== 'search' ? acc + 1 : acc;
    }, 0);

    setActiveFilters(count);
  }, [localFilters]);

  useEffect(() => {
    if (JSON.stringify(filters) !== JSON.stringify(localFilters)) {
      setLocalFilters(filters);
    }
  }, [filters]);

  return (
    <SidebarStyled>
      <FilterSection>
        <FormFloating className="mb-3">
          <Form.Control
            type="search"
            placeholder="Cari Nama Kendaraan"
            name="search"
            value={localFilters.search || ''}
            onChange={handleFilterChange}
          />
          <label>Cari</label>
        </FormFloating>
      </FilterSection>

      <FilterSection>
        <FilterTitle>Filter Kendaraan</FilterTitle>

        <Form.Floating className="mb-3">
          <Form.Select
            name="model"
            value={localFilters.model || ''}
            onChange={handleFilterChange}
          >
            <option value="">Semua</option>
            {Object.values(CarModelEnum).map((model) => (
              <option key={model} value={model}>{getCarModelLabel(model)}</option>
            ))}
          </Form.Select>
          <Form.Label>Model</Form.Label>
        </Form.Floating>

        <Form.Group className="mb-3">
          <Form.Label>Tahun</Form.Label>
          <InputGroup>
            <Form.Control
              type="number"
              placeholder="Dari"
              name="year_from"
              value={localFilters.year_from || ''}
              onChange={handleFilterChange}
            />
            <InputGroup.Text>s/d</InputGroup.Text>
            <Form.Control
              type="number"
              placeholder="Sampai"
              name="year_to"
              value={localFilters.year_to || ''}
              onChange={handleFilterChange}
            />
          </InputGroup>
        </Form.Group>

        <Form.Floating className="mb-3">
          <Form.Select
            name="fuel_type"
            value={localFilters.fuel_type || ''}
            onChange={handleFilterChange}
          >
            <option value="">Semua</option>
            {Object.values(FuelEnum).map((fuel) => (
              <option key={fuel} value={fuel}>{getCarFuelTypeLabel(fuel)}</option>
            ))}
          </Form.Select>
          <Form.Label>Jenis Bahan Bakar</Form.Label>
        </Form.Floating>

        <Form.Floating className="mb-3">
          <Form.Select
            name="transmission"
            value={localFilters.transmission || ''}
            onChange={handleFilterChange}
          >
            <option value="">Semua</option>
            {Object.values(CarTransmissionEnum).map((transmission) =>
              <option key={transmission} value={transmission}>{getCarTransmissionLabel(transmission)}</option>
            )}
          </Form.Select>
          <Form.Label>Transmisi</Form.Label>
        </Form.Floating>

        <Form.Group className="mb-3">
          <Form.Label>Harga (per hari)</Form.Label>
          <InputGroup>
            <InputGroup.Text>Rp</InputGroup.Text>
            <Form.Control
              type="number"
              placeholder="Min"
              name="price_min"
              value={localFilters.price_min || ''}
              onChange={handleFilterChange}
            />
            <InputGroup.Text>-</InputGroup.Text>
            <Form.Control
              type="number"
              placeholder="Max"
              name="price_max"
              value={localFilters.price_max || ''}
              onChange={handleFilterChange}
            />
          </InputGroup>
        </Form.Group>
      </FilterSection>

      {activeFilters > 0 && (
        <Button
          variant="danger"
          className="w-100"
          size="lg"
          onClick={handleResetFilters}
        >
          Reset Filter
        </Button>
      )}
    </SidebarStyled>
  );
};

export default memo(FilterSidebar);

