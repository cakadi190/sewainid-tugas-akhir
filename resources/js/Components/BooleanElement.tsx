import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'

interface BooleanElementProps {
  value: boolean
  trueLabel?: string
  falseLabel?: string
}

export default function BooleanElement({ value, trueLabel = 'Ya', falseLabel = 'Tidak' }: BooleanElementProps) {
  return (
    <span className='gap-1 d-flex align-items-center'>
      {value ? (
        <FontAwesomeIcon icon={faCheckCircle} color="green" />
      ) : (
        <FontAwesomeIcon icon={faTimesCircle} color="red" />
      )}
      {value ? trueLabel : falseLabel}
    </span>
  )
}
