import dayjs from './dayjs';

export function calculateRent({
  pickDate,
  returnDate,
  rentPrice,
  withDriver,
  driverCost = 250000,
}: {
  pickDate?: string | null | undefined;
  returnDate?: string | null | undefined;
  rentPrice: number;
  withDriver: boolean;
  driverCost?: number;
}) {
  const pickDateObj = pickDate ? dayjs(pickDate) : undefined;
  const returnDateObj = returnDate ? dayjs(returnDate) : undefined;
  const duration = returnDateObj ? returnDateObj.diff(pickDateObj, 'day') : 0;

  const carRentTotal = rentPrice * duration;
  const driverRentTotal = withDriver ? driverCost * duration : 0;
  const subtotal = carRentTotal + driverRentTotal;
  const tax = subtotal * 0.11;
  const total = subtotal + tax;

  return {
    duration,
    carRentTotal,
    driverRentTotal,
    subtotal,
    tax,
    total,
  };
}

