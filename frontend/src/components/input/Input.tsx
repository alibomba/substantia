import { useState } from "react"

interface Props {
    id?: string,
    type: string,
    label: string,
    placeholder?: string,
    minLength?: number,
    maxLength?: number,
    min?: number,
    max?: number,
    onChange?: (e: React.ChangeEvent) => void,
    value?: string,
    required?: boolean,
    width?: string
}

const Input = ({ id, type, label, placeholder, minLength, maxLength, min, max, onChange, value, required, width }: Props) => {
    const [isFocused, setIsFocused] = useState<boolean>(value ? true : false);
    const [isPlaceholder, setIsPlaceholder] = useState<boolean>(false);

    function handleFocus() {
        setIsFocused(true);
        setTimeout(() => setIsPlaceholder(true), 150);
    }

    function handleBlur(e: React.ChangeEvent) {
        const input = e.target as HTMLInputElement;
        if (!input.value) {
            setIsFocused(false);
            setIsPlaceholder(false);
        }
    }

    return (
        <div data-testid='input' style={{ width: width ? width : '100%' }} className="my-4 relative">
            <p data-testid='label' className={`absolute pointer-events-none transition-primary letf-0 bottom-2 ${isFocused ? '-translate-y-12 text-3xl max-sm:text-2xl' : 'text-5xl max-sm:text-4xl'} font-medium`}>{label}</p>
            <input id={id} type={type} aria-label={label} minLength={minLength} maxLength={maxLength} min={min} max={max} onChange={onChange} value={value} required={required} onFocus={handleFocus} onBlur={handleBlur} placeholder={isPlaceholder ? placeholder : undefined} className="w-full text-4xl max-sm:text-3xl outline-none p-2 pl-1 border-b-[3px] border-primary" />
        </div>
    )
}

export default Input
