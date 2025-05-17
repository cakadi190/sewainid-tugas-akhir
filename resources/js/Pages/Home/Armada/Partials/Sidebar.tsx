import { FC, useCallback, useEffect, useState, memo } from "react";
import { Form, FormFloating, Button, FloatingLabel } from "react-bootstrap";
import RangeSlider from "react-bootstrap-range-slider";
import { router } from "@inertiajs/react";
import { CarModelEnum, CarTransmissionEnum, FuelEnum } from "@/Helpers/enum";
import { getCarFuelTypeLabel, getCarModelLabel, getCarTransmissionLabel } from "@/Helpers/EnumHelper";
import { useDebounce } from "@/Hooks/useDebounce";
import styled from "@emotion/styled";
import Flatpickr from "react-flatpickr";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";

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
  pickup_date: string;
  return_date: string;
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

const RangeValue = styled.div`
  font-size: 0.875rem;
  color: #6c757d;
  text-align: center;
  margin-top: 0.25rem;
`;

const SliderLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
`;

const SliderContainer = styled.div`
  padding: 0 5px;
  margin-bottom: 1.5rem;
`;

const FilterSidebar: FC<FilterSidebarProps> = ({ filters, setFilters }) => {
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 30;
  const maxYear = currentYear + 1;

  const maxPriceLimit = 2000000; // Harga maksimum yang bisa dipilih (2 juta)

  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [activeFilters, setActiveFilters] = useState(0);

  // State yang digunakan untuk menampilkan nilai slider
  const [yearFromDisplay, setYearFromDisplay] = useState<number>(Number(localFilters.year_from) || minYear);
  const [yearToDisplay, setYearToDisplay] = useState<number>(Number(localFilters.year_to) || maxYear);
  const [priceMinDisplay, setPriceMinDisplay] = useState<number>(Number(localFilters.price_min) || 0);
  const [priceMaxDisplay, setPriceMaxDisplay] = useState<number>(Number(localFilters.price_max) || maxPriceLimit);

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
    const updatedValue = type === 'number' || type === 'range' ? (value ? parseInt(value) : 0) : value;

    const newFilters = {
      ...localFilters,
      [name]: updatedValue
    };

    setLocalFilters(newFilters);
    setFilters(newFilters);

    debouncedUpdateFilters(newFilters);
  }, [localFilters, setFilters, debouncedUpdateFilters]);

  // Handler untuk slider tahun
  const handleYearFromChange = useCallback((value: number) => {
    setYearFromDisplay(value);

    // Pastikan year_from tidak lebih besar dari year_to
    const yearTo = Number(localFilters.year_to) || maxYear;

    const newFilters = {
      ...localFilters,
      year_from: value
    };

    // Jika year_from lebih besar dari year_to, update juga year_to
    if (value > yearTo) {
      newFilters.year_to = value;
      setYearToDisplay(value);
    }

    setLocalFilters(newFilters);
    setFilters(newFilters);
    debouncedUpdateFilters(newFilters);
  }, [localFilters, setFilters, debouncedUpdateFilters, maxYear]);

  const handleYearToChange = useCallback((value: number) => {
    setYearToDisplay(value);

    // Pastikan year_to tidak lebih kecil dari year_from
    const yearFrom = Number(localFilters.year_from) || minYear;

    const newFilters = {
      ...localFilters,
      year_to: value
    };

    // Jika year_to lebih kecil dari year_from, update juga year_from
    if (value < yearFrom) {
      newFilters.year_from = value;
      setYearFromDisplay(value);
    }

    setLocalFilters(newFilters);
    setFilters(newFilters);
    debouncedUpdateFilters(newFilters);
  }, [localFilters, setFilters, debouncedUpdateFilters, minYear]);

  // Handler untuk slider harga
  const handlePriceMinChange = useCallback((value: number) => {
    setPriceMinDisplay(value);

    // Pastikan price_min tidak lebih besar dari price_max
    const priceMax = Number(localFilters.price_max) || maxPriceLimit;

    const newFilters = {
      ...localFilters,
      price_min: value
    };

    // Jika price_min lebih besar dari price_max, update juga price_max
    if (value > priceMax) {
      newFilters.price_max = value;
      setPriceMaxDisplay(value);
    }

    setLocalFilters(newFilters);
    setFilters(newFilters);
    debouncedUpdateFilters(newFilters);
  }, [localFilters, setFilters, debouncedUpdateFilters, maxPriceLimit]);

  const handlePriceMaxChange = useCallback((value: number) => {
    setPriceMaxDisplay(value);

    // Pastikan price_max tidak lebih kecil dari price_min
    const priceMin = Number(localFilters.price_min) || 0;

    const newFilters = {
      ...localFilters,
      price_max: value
    };

    // Jika price_max lebih kecil dari price_min, update juga price_min
    if (value < priceMin) {
      newFilters.price_min = value;
      setPriceMinDisplay(value);
    }

    setLocalFilters(newFilters);
    setFilters(newFilters);
    debouncedUpdateFilters(newFilters);
  }, [localFilters, setFilters, debouncedUpdateFilters]);

  const formatPriceToRupiah = (price: number) => {
    return new Intl.NumberFormat('id-ID').format(price);
  };

  const handleDateChange = useCallback((dates: Date[], currentDateStr: string, instance: any, data: any) => {
    const name = instance.input.getAttribute('name') || 'pickup_date';
    const formattedDate = dates[0] ?
      dates[0].getFullYear() + '-' +
      String(dates[0].getMonth() + 1).padStart(2, '0') + '-' +
      String(dates[0].getDate()).padStart(2, '0') :
      '';

    const newFilters = {
      ...localFilters,
      [name]: formattedDate
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
    setYearFromDisplay(minYear);
    setYearToDisplay(maxYear);
    setPriceMinDisplay(0);
    setPriceMaxDisplay(maxPriceLimit);
    router.get(route('armada.index'), {}, { preserveState: true });
  }, [filters, setFilters, minYear, maxYear, maxPriceLimit]);

  useEffect(() => {
    const count = Object.entries(localFilters).reduce((acc, [key, value]) => {
      return value && key !== 'search' ? acc + 1 : acc;
    }, 0);

    setActiveFilters(count);
  }, [localFilters]);

  useEffect(() => {
    if (JSON.stringify(filters) !== JSON.stringify(localFilters)) {
      setLocalFilters(filters);

      // Update display values
      setYearFromDisplay(Number(filters.year_from) || minYear);
      setYearToDisplay(Number(filters.year_to) || maxYear);
      setPriceMinDisplay(Number(filters.price_min) || 0);
      setPriceMaxDisplay(Number(filters.price_max) || maxPriceLimit);
    }
  }, [filters, minYear, maxYear, maxPriceLimit]);

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
          <FloatingLabel label="Tanggal Diambil">
            <Flatpickr
              className="form-control"
              options={{
                dateFormat: "Y-m-d",
                minDate: "today"
              }}
              value={localFilters.pickup_date || ''}
              onChange={handleDateChange}
              name="pickup_date"
            />
          </FloatingLabel>
        </Form.Group>

        <Form.Group className="mb-3">
          <FloatingLabel label="Tanggal Kembali">
            <Flatpickr
              className="form-control"
              options={{
                dateFormat: "Y-m-d",
                minDate: "today"
              }}
              value={localFilters.return_date || ''}
              onChange={handleDateChange}
              name="return_date"
            />
          </FloatingLabel>
        </Form.Group>

        {/* Range slider untuk tahun */}
        <Form.Group className="mb-4">
          <Form.Label>Tahun</Form.Label>
          <SliderContainer>
            <SliderLabel>
              <span>Dari:</span>
              <span>{yearFromDisplay}</span>
            </SliderLabel>
            <RangeSlider
              min={minYear}
              max={maxYear}
              value={yearFromDisplay}
              onChange={(e) => handleYearFromChange(Number(e.target.value))}
              variant="primary"
              tooltip="off"
              size="sm"
            />
          </SliderContainer>

          <SliderContainer>
            <SliderLabel>
              <span>Sampai:</span>
              <span>{yearToDisplay}</span>
            </SliderLabel>
            <RangeSlider
              min={minYear}
              max={maxYear}
              value={yearToDisplay}
              onChange={(e) => handleYearToChange(Number(e.target.value))}
              variant="primary"
              tooltip="off"
              size="sm"
            />
          </SliderContainer>

          <RangeValue>
            Range: {yearFromDisplay} - {yearToDisplay}
          </RangeValue>
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

        {/* Range slider untuk harga */}
        <Form.Group className="mb-4">
          <Form.Label>Harga (per hari)</Form.Label>
          <SliderContainer>
            <SliderLabel>
              <span>Minimum:</span>
              <span>Rp {formatPriceToRupiah(priceMinDisplay)}</span>
            </SliderLabel>
            <RangeSlider
              min={0}
              max={maxPriceLimit}
              step={50000}
              value={priceMinDisplay}
              onChange={(e) => handlePriceMinChange(Number(e.target.value))}
              variant="success"
              tooltip="off"
              size="sm"
            />
          </SliderContainer>

          <SliderContainer>
            <SliderLabel>
              <span>Maksimum:</span>
              <span>Rp {formatPriceToRupiah(priceMaxDisplay)}</span>
            </SliderLabel>
            <RangeSlider
              min={0}
              max={maxPriceLimit}
              step={50000}
              value={priceMaxDisplay}
              onChange={(e) => handlePriceMaxChange(Number(e.target.value))}
              variant="success"
              tooltip="off"
              size="sm"
            />
          </SliderContainer>

          <RangeValue>
            Range: Rp {formatPriceToRupiah(priceMinDisplay)} - Rp {formatPriceToRupiah(priceMaxDisplay)}
          </RangeValue>
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
