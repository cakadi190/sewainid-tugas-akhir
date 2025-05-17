import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { twMerge } from "tailwind-merge";

interface LabelValueProps {
  label: string;
  value: string | number | JSX.Element;
  className?: string;
  bottomBorder?: boolean;
  icon?: JSX.Element | IconDefinition;
  noMarginBottom?: boolean;
  iconColor?: string;
  iconSize?: "xs" | "sm" | "lg" | "xl" | "2xl";
}

/**
 * Komponen LabelValue
 *
 * @component
 * @param {LabelValueProps} props - Props komponen
 * @param {string} props.label - Teks label yang akan ditampilkan
 * @param {string | number | JSX.Element} props.value - Nilai yang akan ditampilkan
 * @param {string} [props.className] - Kelas CSS tambahan untuk styling
 * @param {boolean} [props.bottomBorder=true] - Menentukan apakah akan menampilkan garis bawah
 * @param {boolean} [props.noMarginBottom=false] - Menentukan apakah akan menghilangkan margin bawah
 * @param {JSX.Element | IconDefinition} [props.icon] - Ikon yang akan ditampilkan di sebelah label
 * @param {string} [props.iconColor='primary'] - Warna untuk ikon
 * @param {'xs' | 'sm' | 'lg' | 'xl' | '2xl'} [props.iconSize='lg'] - Ukuran untuk ikon
 * @returns {JSX.Element} Komponen LabelValue yang menampilkan label dan nilai dengan ikon opsional
 */
export default function LabelValue({
  label,
  value,
  className,
  bottomBorder = true,
  noMarginBottom = false,
  icon,
  iconSize = "xl"
}: LabelValueProps) {
  return (
    <div className={twMerge(
      className,
      bottomBorder ? "border-bottom" : "",
      "d-flex gap-2 align-items-center"
    )}>
      {icon && (
        <div className="flex-shrink-0 d-flex align-items-center justify-content-center"
          style={{ aspectRatio: "1/1", minHeight: "40px", minWidth: "40px" }}>
          {isIconDefinition(icon) ? (
            <FontAwesomeIcon
              icon={icon}
              size={iconSize}
            />
          ) : (
            icon
          )}
        </div>
      )}
      <div className="flex-grow-1">
        <div className="pb-1 fw-bold">{label}</div>
        <div className={noMarginBottom ? "" : "pb-2"}>{value}</div>
      </div>
    </div>
  );
}

/**
 * Type guard function to check if the provided icon is an IconDefinition
 * @param icon - The icon to check
 * @returns true if the icon is an IconDefinition, false otherwise
 */
function isIconDefinition(icon: JSX.Element | IconDefinition): icon is IconDefinition {
  return (
    typeof icon === "object" &&
    icon !== null &&
    'icon' in icon &&
    Array.isArray((icon as IconDefinition).icon) &&
    typeof (icon as any).iconName === 'string' &&
    typeof (icon as any).prefix === 'string'
  );
}
