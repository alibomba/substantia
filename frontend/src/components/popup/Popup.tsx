

interface Props {
    active: boolean,
    type: 'good' | 'bad',
    children: string | null
}

const Popup = ({ active, type, children }: Props) => {
    return (
        <p data-testid='popup' role='alert' aria-live={active ? 'assertive' : 'off'} className={`z-[1000000] text-5xl max-sm:text-4xl text-white font-medium w-fit px-8 py-5 rounded-[20px] fixed top-4 max-sm:top-1 right-4 max-sm:right-1 transition-primary ${type === 'good' ? 'bg-[rgba(0,255,0,.85)]' : 'bg-[rgba(255,0,0,.85)]'} ${active ? 'translate-x-0' : 'translate-x-[200%]'}`}>{children}</p>
    )
}

export default Popup
